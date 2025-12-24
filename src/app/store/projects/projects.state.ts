import { Injectable } from '@angular/core';
import { State, Action, Selector, StateContext, Store, createSelector, } from '@ngxs/store';
import { 
  CleanOrgProjects,
  NullifyOrgProject, 
  NullifyProject, 
  SaveProjectSchedule, 
  SetOrganizationProjects, 
  SetProject,
  SetProjectProjection, 
  SetTaskProject,
} from '../projects/projects.actions';
import { 
  Activity,
  getId,
  InstanceEntry, 
  InstanceTask, 
  InstanceTimeOff, 
  processProjectProjection, 
  ProjectsStateModel,
  Task
} from '@betavc/timeqi-sh';
import { Projects as ProjectsService } from './projects';
import { 
  catchError, 
  map, 
  mergeMap, 
  of, 
} from 'rxjs';
import { 
  equals, 
  isNotEmpty, 
  pickBy, 
  pipe, 
  prop, 
  reduce, 
  sortBy 
} from 'ramda';
import { 
  CleanProjectTasks, 
  NullifyProjectTask, 
  SetProjectTasks, 
  SetProjectTaskProjection, 
  SetProjectTasksProjections 
} from '../tasks/tasks.actions';
import { SetProjectOrganization } from '../organizations/organizations.actions';
import { CleanProjectTimeOff, SetProjectTimeOff } from '../time-off/time-off.actions';
import { CleanProjectTaskEntries, SetProjectTaskEntries } from '../entries/entries.actions';
import { SetProjectActivity, SetProjectTaskActivity } from '../activity/activity.actions';


@State<ProjectsStateModel>({
  name: 'projects',
  defaults: {
    projects: [],
    project: null,
    projection: null
  }
})
@Injectable()
export class ProjectsState {

  constructor(
    private projectsService: ProjectsService,
    private store: Store,
  ) {}

  @Selector()
  static getState(state: ProjectsStateModel) { return state; }

  @Selector()
  static getProject(state: ProjectsStateModel) { return state.project; }

  @Selector()
  static getProjects(state: ProjectsStateModel) { return state.projects; }

  @Selector()
  static getProjection(state: ProjectsStateModel) { return state.projection; }

  // Keeping here as reference for future use
  // static getProjectProjection = createSelector(
  //   [
  //     TasksState.getTasks, 
  //     EntriesState.getEntries, 
  //     TimeOffState.getTimeOffs,
  //     (state: ProjectsStateModel) => state.project
  //   ],
  //   async (tasks, projectEntries, timeOffs, project) => {
  //     return await processProjectProjection(
  //       {
  //         ...project as Project,
  //         tasks: assignEntriesToTasks(tasks as InstanceTask[], projectEntries)
  //       }, 0, {
  //         relativeTimeOff: timeOffs
  //       }
  //     );
  //   }
  // );

  static getProjectProjection = createSelector(
    [
      ProjectsState.getProject,
      ProjectsState.getProjection,
      (state: ProjectsStateModel) => state.project
    ],
    (project, projection) => ({ ...project, ...projection })
  );

  @Action(SetOrganizationProjects)
  setOrganizationProjects(ctx: StateContext<ProjectsStateModel>, action: SetOrganizationProjects) {
    const state = ctx.getState();
    ctx.setState({
      ...state,
      projects: action.projects
    });
  }

  @Action(SetTaskProject)
  @Action(SetProject)
  setProject(ctx: StateContext<ProjectsStateModel>, action: SetProject) {
    const state = ctx.getState();
    const states = this.store.selectSnapshot(state => state);
    const project = states.projects.project;
    const projectId = project?._id;
    if (!action.id && !project) {
      console.warn('warning: No project id provided, nullifying project.');
      return ctx.dispatch(new NullifyProject());
    }
    const alreadyLoaded = projectId === action.id;
    const getProject$ = alreadyLoaded && project ? 
      of(project) : 
      this.projectsService.getProject(action.id || projectId);

    return getProject$.pipe(
      mergeMap(( project ) => {
        if (!project) {
          console.warn('warning: No project found, nullifying project.');
          return ctx.dispatch(new NullifyProject());
        }

        const dispatches = [];
        const tasks = states.tasks.tasks;
        // Get organization from global OrganizationsState
        ctx.setState({
          ...state,
          project
        });

        dispatches.push(
          new SetProjectTaskEntries(project._id),
          new SetProjectTasks(alreadyLoaded ? tasks : project.tasks)
        );
        // If the project has timeOff, dispatch SetProjectTimeOff
        if (project.timeOff && project.timeOff.length) 
          dispatches.push(new SetProjectTimeOff(project.timeOff as InstanceTimeOff[]));

        if (project && project.organization) 
          // No need to make assumptions here
          // SetProjectOrganization will check if the org is loaded
          dispatches.push(new SetProjectOrganization(
            getId(project.organization)
          ));
        // If the action is SetProject, nullify the current project task
        // we assume that the user is viewing all tasks
        if (action instanceof SetProject)
          dispatches.push(new NullifyProjectTask());

        return ctx.dispatch(dispatches);
      })
    );
  }
  @Action(SetProjectProjection)
  setProjectProjection(ctx: StateContext<ProjectsStateModel>, action: SetProjectProjection) {
    return processProjectProjection(
      action.project,
      0,
      { 
        // convert to IDs only so we store references instead of full objects
        activityIterationCb: (activity: Activity) => {
          activity.entries = activity.entries.map(e => (e as InstanceEntry)._id);
          activity.timeOff = activity.timeOff.map(t => (t as InstanceTimeOff)._id);
          return Promise.resolve(activity);
        }
      }
    ).then((processedProject) => {
      // this.store.dispatch(new SetProjectProjection(processedProject));
      const dispatches = [];
      const state = ctx.getState();
      const task = this.store.selectSnapshot(state => state.tasks.task);
      ctx.setState({
        ...state,
        // tasks are not stored in the projection
        // we only pick the fields that have changed and are not arrays
        projection: pickBy(
          (value, key) => {
            return !equals(value, state.project![key]) &&
            // exclude these keys
            [
              'tasks',
              'timeOff',
              'users',
            ].indexOf(key) === -1;
          }, 
          processedProject
        )
      });
      dispatches.push(new SetProjectTasksProjections(processedProject.tasks as InstanceTask[]));
      if (task && isNotEmpty(processedProject.tasks)) {
        const taskProjection = processedProject.tasks![task.index] as Task;
        dispatches.push(
          new SetProjectTaskProjection(taskProjection),
          new SetProjectTaskActivity(taskProjection.activity || [])
        );
      } else if (processedProject.tasks) {
        const projectActivity = pipe(
          reduce(
            (acc: Activity[], task: InstanceTask) => acc.concat(task.activity || []), 
            [] as Activity[]
          ),
          sortBy(prop('date'))
        )(processedProject.tasks as InstanceTask[]);
        dispatches.push(new SetProjectActivity(projectActivity));
      }
      return ctx.dispatch(dispatches);
    });
  }
  @Action(SaveProjectSchedule)
  saveProjectSchedule(ctx: StateContext<ProjectsStateModel>, action: SaveProjectSchedule) {
      const state = ctx.getState();
      if (!state.project) {
        console.warn('No project found to save schedule.');
        return;
      }
      action.project.updatedAt = new Date().toISOString();
      return this.projectsService.saveProject(state.project._id, action.project).pipe(
        map(updatedProject => {
          ctx.setState({
            ...state,
            project: updatedProject
          });
        }),
        catchError(error => {
          console.error('Error saving project schedule:', error);
          return of(null);
        })
      );
  }

  @Action(NullifyProject)
  @Action(NullifyOrgProject)
  nullifyProject(ctx: StateContext<ProjectsStateModel>) {
    const state = ctx.getState();
    const dispatches = [];
    if (state.project) {
      ctx.setState({
        ...state,
        project: null,
        projection: null
      });
      dispatches.push(
        new CleanProjectTasks(), 
        new CleanProjectTimeOff(),
        new CleanProjectTaskEntries()
      );
    }
    return ctx.dispatch(dispatches);
  }

  @Action(CleanOrgProjects)
  cleanProjects(ctx: StateContext<ProjectsStateModel>) {
    const state = ctx.getState();
    ctx.setState({
      ...state,
      projects: []
    });
    return ctx.dispatch([
      new NullifyProject(),
    ]);
  }
}