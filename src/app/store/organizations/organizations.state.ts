import { Injectable } from '@angular/core';
import { State, Action, Selector, StateContext, } from '@ngxs/store';
import { SetUserOrganization, SetUserOrganizations } from './organizations.actions';
import { Organization, OrganizationsStateModel } from '../../schemas/organization';
import { Organizations as OrganizationsService } from './organizations';
import { map, merge, mergeMap, tap } from 'rxjs';
import { dissoc } from 'ramda';
import { SetOrganizationProjects } from '../projects/projects.actions';


@State<OrganizationsStateModel>({
  name: 'organizations',
  defaults: {
    organizations: [],
    organization: null,
  }
})
@Injectable()
export class OrganizationsState {

  constructor(private orgsService: OrganizationsService) {}

  @Selector()
  static getState(state: OrganizationsStateModel) { return state; }

  @Action(SetUserOrganizations) 
  setUserOrganizations(ctx: StateContext<OrganizationsStateModel>, action: SetUserOrganizations) {
    const state = ctx.getState();
    ctx.setState({
      ...state,
      organizations: action.organizations
    });
  }

  @Action(SetUserOrganization)
  setUserOrganization(ctx: StateContext<OrganizationsStateModel>, action: SetUserOrganization) {
    return this.orgsService.getOrganization(action.id).pipe(
      map(organization => organization
        ? { organization: dissoc<Organization, 'projects'>('projects', organization), projects: organization.projects || [] }
        : { organization: null, projects: [] }
      ),
      tap(({ organization }) => {
        const state = ctx.getState();
        if (!organization) {
          console.warn('No organization found, setting organization to null.');
          ctx.setState({
            ...state,
            organization: null
          });
        } else {
          ctx.setState({
            ...state,
            organization
          });
        }
      }),
      mergeMap(({ projects }) => ctx.dispatch(new SetOrganizationProjects(projects)))
    );
  }
}
