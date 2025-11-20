import { Injectable } from '@angular/core';
import { State, Action, Selector, StateContext, Store, createSelector, } from '@ngxs/store';
import { NullifyOrgProject, SaveProjectSchedule, SetOrganizationProjects, SetProject, SetProjectOrgProjects, SetProjectProjection, SetTaskProject } from '../projects/projects.actions';
import { 
  assignEntriesToTasks, 
  PartialTask, 
  PartialTimeOff, 
  processProjectTasks, 
  Project, 
  ProjectsStateModel
} from '@betavc/timeqi-sh';
import { Projects as ProjectsService } from './projects';
import { catchError, map, mergeMap, of, tap } from 'rxjs';
import { dissoc } from 'ramda';
import { CleanOrgTasks, NullifyProjectTask, SetProjectTasks } from '../tasks/tasks.actions';
import { SetProjectOrganization } from '../organizations/organizations.actions';
import { UpsertProjectTimeOff } from '../time-off/time-off.actions';
import { TasksState } from '../tasks/tasks.state';
import { EntriesState } from '../entries/entries.state';
import { TimeOffState } from '../time-off/time-off.state';
import { SetProjectEntries } from '../entries/entries.actions';


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

  static getProjectProjection = createSelector(
    [
      TasksState.getTasks, 
      EntriesState.getProjectEntries, 
      TimeOffState.getTimeOffs,
      (state: ProjectsStateModel) => state.project
    ],
    async (tasks, projectEntries, timeOffs, project) => {
      return await processProjectTasks(
        {
          ...project,
          tasks: assignEntriesToTasks(tasks, projectEntries)
        }, 0, {
          relativeTimeOff: timeOffs
        }
      );
    }
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
        ? { project: dissoc<Project, 'tasks'>('tasks', project), tasks: (alreadyLoaded ? tasks : project.tasks) || [] }
        : { project: null, tasks: [] }
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
        dispatches.push(new SetProjectTasks(tasks as PartialTask[]));
        // Get organization from global OrganizationsState
        if (project) {
          dispatches.push(new SetProjectEntries(project._id));
        }
        if (project && project.organization) {
          dispatches.push(new SetProjectOrganization(project.organization as string));
        }
        // If the project has timeOff, dispatch UpsertProjectTimeOff
        if (project && project.timeOff && project.timeOff.length) {
          dispatches.push(new UpsertProjectTimeOff(project.timeOff as PartialTimeOff[]));
        }
        if (action instanceof SetProject) {
          dispatches.push(new NullifyProjectTask());
        }
        return ctx.dispatch(dispatches);
      })
    );
  }
  @Action(SetProjectProjection)
  setProjectProjection(ctx: StateContext<ProjectsStateModel>, action: SetProjectProjection) {
    const state = ctx.getState();
    ctx.setState({
      ...state,
      projection: action.projectProjection
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
        project: null
      });
      this.store.dispatch(new CleanOrgTasks());
    }
  }
}
