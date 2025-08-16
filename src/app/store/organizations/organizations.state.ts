import { inject, Injectable } from '@angular/core';
import { State, Action, Selector, StateContext, } from '@ngxs/store';
import { SetOrganization, SetProjectOrganization, SetUserOrganizations } from './organizations.actions';
import { Organization, OrganizationsStateModel, PartialProject, PartialTimeOff } from '@betavc/timeqi-sh';
import { Organizations as OrganizationsService } from './organizations';
import { map, merge, mergeMap, tap } from 'rxjs';
import { dissoc } from 'ramda';
import { SetOrganizationProjects, SetProject, SetProjectOrgProjects } from '../projects/projects.actions';
import { UpsertOrgTimeOff } from '../time-off/time-off.actions';


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
  @Action(SetProjectOrganization)
  @Action(SetOrganization)
  SetOrganization(ctx: StateContext<OrganizationsStateModel>, action: SetOrganization | SetProjectOrganization) {
    // this.setOrganization$(ctx, action);
    return this.orgsService.getOrganization(action.id).pipe(
      map(organization => organization
        ? { organization: dissoc<Organization, 'projects'>('projects', organization), projects: organization.projects as PartialProject[] || [], timeOff: organization.timeOff as PartialTimeOff[] || [] }
        : { organization: null, projects: [], timeOff: [] }
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
      mergeMap(({ projects, timeOff }) => ctx.dispatch([
          action instanceof SetProjectOrganization
            ? new SetProjectOrgProjects(projects)
            : new SetOrganizationProjects(projects),
          ...(timeOff.length ? [new UpsertOrgTimeOff(timeOff)] : [])
        ]),
      )
    );
  }
}
