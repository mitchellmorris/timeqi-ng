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
  Project,  
  PROJECT_PROJECTION_RELATIONAL_FIELDS,
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
  omit, 
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
  SetProjectTasksProjections, 
  CleanProjectTaskProjections
} from '../tasks/tasks.actions';
import { SetProjectOrganization } from '../organizations/organizations.actions';
import { CleanProjectTimeOff, SetProjectTasksTimeOff, SetProjectTimeOff } from '../time-off/time-off.actions';
import { CleanProjectTaskEntries, SetProjectTasksEntries } from '../entries/entries.actions';
import { SetProjectActivity, SetProjectTaskActivity } from '../activity/activity.actions';
import { TasksState } from '../tasks/tasks.state';
import { EntriesState } from '../entries/entries.state';
import { TimeOffState } from '../time-off/time-off.state';
import { CleanProjectUsers, SetProjectUsers } from '../user/user.actions';


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
  static getProjection(state: ProjectsStateModel): Project | null { 
    if (!state.project) return null;
    return { ...state.project, ...state.projection } as Project;
   }

  static getPopulatedProject = createSelector(
    [
      TasksState.getTasks,
      EntriesState.getTasksEntries,
      TimeOffState.getTasksTimeOff,
      TimeOffState.getTimeOffLookup,
      ProjectsState.getProject
    ],
    (tasks, entries, timeOffTasks, timeOffLookup, project) => {
      if (!project) return null;
      return { 
        ...project, 
        tasks: tasks.map(task => ({
          ...task,
          entries: entries[task._id] || [],
          timeOff: timeOffTasks[task._id] || []
        })), 
        timeOff: timeOffLookup.project
      };
    }
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
    if (alreadyLoaded) {
      if (action instanceof SetProject) {
        return ctx.dispatch(new NullifyProjectTask());
      } else {
        return;
      }
    }

    return this.projectsService.getProject(action.id || projectId).pipe(
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
          project: omit([
            'tasks',
            'timeOff',
            'users',
          ], project)
        });

        // Pulls timeOffs from the project's tasks
        const taskTimeOff = (project.tasks as InstanceTask[]).reduce((acc: InstanceTimeOff[], task) => {
          if (task.timeOff && task.timeOff.length) 
            acc.push(...(task.timeOff as InstanceTimeOff[]));
          return acc;
        }, []);
        if (taskTimeOff.length)
          dispatches.push(new SetProjectTasksTimeOff(taskTimeOff));
        
        dispatches.push(
          new SetProjectUsers(project.users as string[]),
          new SetProjectTasks(alreadyLoaded ? tasks : project.tasks),
          new SetProjectTasksEntries(project._id),
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
        relativeTimeOff: this.store.selectSnapshot(TimeOffState.getTimeOffs),
      }
    ).then((processedProject) => {
      const dispatches = [];
      const state = ctx.getState();
      const task = this.store.selectSnapshot(state => state.tasks.task);
      const omittedFields = PROJECT_PROJECTION_RELATIONAL_FIELDS as readonly (keyof Project)[];
      ctx.setState({
        ...state,
        // tasks are not stored in the projection
        // we only pick the fields that have changed and are not arrays
        projection: omit(omittedFields, processedProject),
      });
      // set tasks projections
      dispatches.push(new SetProjectTasksProjections(processedProject.tasks as InstanceTask[]));
      // set task projection if a task is selected
      // we match by index
      // and include activity
      // only dispatch if the working copy matches the original task
      // this should always be true unless the user has switched tasks
      if (task && isNotEmpty(processedProject.tasks)) {
          // fetch the projection for the current task
          // by the index property
          // we assume that the tasks are in order
          const taskProjection = processedProject.tasks![task.index] as InstanceTask;
          /**
           * when false this might just mean that it's a new task
           * that hasn't been fully populated yet
           * in which case we skip setting the projection
           * and we shouldn't populate the project activity either
           * for consistency while adding new tasks
           */
          if (taskProjection) {
            if (taskProjection._id === task._id) {
              dispatches.push(
                new SetProjectTaskProjection(taskProjection),
                new SetProjectTaskActivity(taskProjection.activity || [])
              );
            } else {
              console.warn('warning: Task projection _id does not match the selected task _id, skipping setting task projection.');
            }
          }
      /**
       * Set project activity from all tasks
       * if there is no selected task
       */
      } else if (processedProject.tasks) {
        // set project activity from all tasks
        // for this project
        const projectActivity = pipe(
          reduce(
            (acc: Activity[], task: InstanceTask) => acc.concat(task.activity || []), 
            [] as Activity[]
          ),
          sortBy(prop('date'))
        )(processedProject.tasks as InstanceTask[]);
        dispatches.push(
          new SetProjectActivity(projectActivity),
          new CleanProjectTaskProjections()
        );
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
        new CleanProjectUsers(),
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