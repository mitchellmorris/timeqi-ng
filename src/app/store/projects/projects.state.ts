import { Injectable } from '@angular/core';
import { State, Action, Selector, StateContext, Store, } from '@ngxs/store';
import { SetOrganizationProjects, SetProject, SetProjectOrgProjects } from '../projects/projects.actions';
import { Project, ProjectsStateModel } from '../../schemas/project';
import { Projects as ProjectsService } from './projects';
import { map, mergeMap, tap } from 'rxjs';
import { dissoc } from 'ramda';
import { SetProjectTasks } from '../tasks/tasks.actions';
import { SetProjectOrganization } from '../organizations/organizations.actions';
import { UpsertProjectTimeOff } from '../time-off/time-off.actions';


@State<ProjectsStateModel>({
  name: 'projects',
  defaults: {
    projects: [],
    project: null,
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

  @Action(SetProjectOrgProjects)
  @Action(SetOrganizationProjects)
  setOrganizationProjects(ctx: StateContext<ProjectsStateModel>, action: SetOrganizationProjects | SetProjectOrgProjects) {
    const state = ctx.getState();
    ctx.setState({
      ...state,
      projects: action.projects
    });
  }

  @Action(SetProject)
  setProject(ctx: StateContext<ProjectsStateModel>, action: SetProject) {
    return this.projectsService.getProject(action.id).pipe(
      map(project => project
        ? { project: dissoc<Project, 'tasks'>('tasks', project), tasks: project.tasks || [] }
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
        const dispatches = [ctx.dispatch(new SetProjectTasks(tasks))];
        // Get organization from global OrganizationsState
        const organization = this.store.selectSnapshot<any>(state => state.organizations.organization);
        if (project && project.organization && !organization) {
          dispatches.push(ctx.dispatch(new SetProjectOrganization(project.organization)));
        }
        // If the project has timeOff, dispatch UpsertProjectTimeOff
        if (project && project.timeOff && project.timeOff.length) {
          dispatches.push(ctx.dispatch(new UpsertProjectTimeOff(project.timeOff)));
        }
        return Promise.all(dispatches);
      })
    );
  }
}
