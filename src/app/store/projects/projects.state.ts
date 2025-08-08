import { Injectable } from '@angular/core';
import { State, Action, Selector, StateContext, } from '@ngxs/store';
import { SetOrganizationProjects, SetProject } from '../projects/projects.actions';
import { Project, ProjectsStateModel } from '../../schemas/project';
import { Projects as ProjectsService } from './projects';
import { map, mergeMap, tap } from 'rxjs';
import { dissoc } from 'ramda';
import { SetProjectTasks } from '../tasks/tasks.actions';


@State<ProjectsStateModel>({
  name: 'projects',
  defaults: {
    projects: [],
    project: null,
  }
})
@Injectable()
export class ProjectsState {

  constructor(private projectsService: ProjectsService) {}

  @Selector()
  static getState(state: ProjectsStateModel) { return state; }

  @Action(SetOrganizationProjects) 
  setOrganizationProjects(ctx: StateContext<ProjectsStateModel>, action: SetOrganizationProjects) {
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
        console.log('Setting project:', project);
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
      mergeMap(({ tasks }) => ctx.dispatch(new SetProjectTasks(tasks)))
    );
  }
}
