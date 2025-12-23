import { Injectable } from '@angular/core';
import { State, Action, Selector, StateContext, Store, createSelector, } from '@ngxs/store';
import { NullifyOrgProject, SaveProjectSchedule, SetOrganizationProjects, SetProject, SetProjectOrgProjects, SetProjectProjection, SetTaskProject } from '../projects/projects.actions';
import { 
  Activity,
  assignEntriesToTasks, 
  InstanceEntry, 
  InstanceTask, 
  InstanceTimeOff, 
  processProjectProjection, 
  Project, 
  ProjectsStateModel,
  Task
} from '@betavc/timeqi-sh';
import { Projects, Projects as ProjectsService } from './projects';
import { catchError, map, mergeMap, of, tap } from 'rxjs';
import { difference, dissoc, equals, is, isNotEmpty, pickBy, pipe, prop, reduce, sortBy } from 'ramda';
import { CleanOrgTasks, NullifyProjectTask, SetProjectTasks, SetTaskProjection, SetTasksProjections } from '../tasks/tasks.actions';
import { SetProjectOrganization } from '../organizations/organizations.actions';
import { UpsertProjectTimeOff } from '../time-off/time-off.actions';
import { TasksState } from '../tasks/tasks.state';
import { EntriesState } from '../entries/entries.state';
import { TimeOffState } from '../time-off/time-off.state';
import { SetEntries } from '../entries/entries.actions';
import { SetProjectActivity, SetTaskActivity } from '../activity/activity.actions';


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

  @Action(SetProjectOrgProjects)
  @Action(SetOrganizationProjects)
  setOrganizationProjects(ctx: StateContext<ProjectsStateModel>, action: SetOrganizationProjects | SetProjectOrgProjects) {
    const state = ctx.getState();
    ctx.setState({
      ...state,
      projects: action.projects
    });
  }

  @Action(SetTaskProject)
  @Action(SetProject)
  setProject(ctx: StateContext<ProjectsStateModel>, action: SetProject) {
    const project = this.store.selectSnapshot(state => state.projects.project);
    const tasks = this.store.selectSnapshot(state => state.tasks.tasks);
    const projectId = project ? project._id : null;
    const alreadyLoaded = projectId === action.id;
    const getProject$ = alreadyLoaded ? of(project) : this.projectsService.getProject(action.id);
    return getProject$.pipe(
      map(project => project
        ? { 
          project: dissoc<Project, 'tasks'>('tasks', project), 
          tasks: (alreadyLoaded ? tasks : project.tasks) || [] }
        : { 
          project: null, 
          tasks: [] 
        }
      ),
      tap(({ project }) => {
        const state = ctx.getState();
        if (!project) {
          console.warn('No organization found, setting project to null.');
          ctx.setState({
            ...state,
            project: null
          });
        } else {
          ctx.setState({
            ...state,
            project
          });
        }
      }),
      mergeMap(({ tasks, project }) => {
        const dispatches = [];
        // Get organization from global OrganizationsState
        if (project) 
          dispatches.push(new SetEntries(project._id));
        dispatches.push(new SetProjectTasks(tasks as InstanceTask[]));
        if (project && project.organization) 
          dispatches.push(new SetProjectOrganization(project.organization as string));
        // If the project has timeOff, dispatch UpsertProjectTimeOff
        if (project && project.timeOff && project.timeOff.length) 
          dispatches.push(new UpsertProjectTimeOff(project.timeOff as InstanceTimeOff[]));
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
      dispatches.push(new SetTasksProjections(processedProject.tasks as InstanceTask[]))
      if (task && isNotEmpty(processedProject.tasks)) {
        const taskProjection = processedProject.tasks![task.index] as Task;
        dispatches.push(
          new SetTaskProjection(taskProjection),
          new SetTaskActivity(taskProjection.activity || [])
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
  @Action(NullifyOrgProject)
  removeOrgProject(ctx: StateContext<ProjectsStateModel>, action: NullifyOrgProject) {
    const state = ctx.getState();
    if (state.project) {
      ctx.setState({
        ...state,
        project: null,
        projection: null
      });
      this.store.dispatch(new CleanOrgTasks());
    }
  }
}
