import { Injectable } from '@angular/core';
import { State, Action, Selector, StateContext, } from '@ngxs/store';
import { SetOrganizationProjects } from '../projects/projects.actions';
import { ProjectsStateModel } from '../../schemas/project';


@State<ProjectsStateModel>({
  name: 'projects',
  defaults: {
    projects: [],
    project: null,
  }
})
@Injectable()
export class ProjectsState {

  constructor() {}

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
}
