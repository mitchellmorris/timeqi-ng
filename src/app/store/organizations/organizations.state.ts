import { Injectable } from '@angular/core';
import { State, Action, Selector, StateContext, Store, } from '@ngxs/store';
import { SaveOrganizationSchedule, SetOrganization, SetProjectOrganization, SetUserOrganizations } from './organizations.actions';
import { Organization, OrganizationsStateModel, InstanceProject, InstanceTimeOff, InstanceUser } from '@betavc/timeqi-sh';
import { Organizations as OrganizationsService } from './organizations';
import { map, mergeMap, tap, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { dissoc, omit } from 'ramda';
import { NullifyOrgProject, SetOrganizationProjects, SetProjectOrgProjects } from '../projects/projects.actions';
import { UpsertOrgTimeOff } from '../time-off/time-off.actions';
import { SetOrganizationUsers } from '../user/user.actions';


@State<OrganizationsStateModel>({
  name: 'organizations',
  defaults: {
    organizations: [],
    organization: null,
  }
})
@Injectable()
export class OrganizationsState {

  constructor(
    private store: Store,
    private orgsService: OrganizationsService
  ) {}


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
  setOrganization(ctx: StateContext<OrganizationsStateModel>, action: SetOrganization | SetProjectOrganization) {
    const state = this.store.selectSnapshot(state => state);
    const organizationId = state.organizations.organization ? state.organizations.organization._id : null;
    const getOrg$ = organizationId === action.id ? 
      of(state.organizations.organization) : 
      this.orgsService.getOrganization(action.id);
    return getOrg$.pipe(
      map(organization => organization
        ? { 
          organization: omit(['projects', 'timeOff', 'users'], organization) as Organization, 
          projects: organization.projects as InstanceProject[] || state.projects.projects,
          timeOff: organization.timeOff as InstanceTimeOff[] || state.timeoff.timeoffs,
          users: organization.users as InstanceUser[] || state.users.users
        } : { organization: null, projects: [], timeOff: [], users: [] }
      ),
      tap(({ organization }) => {
        const state = ctx.getState();
        if (!organization) {
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
      mergeMap(({ projects, timeOff, users }) => {
        const dispatches = [];
        if (action instanceof SetProjectOrganization) {
          dispatches.push(new SetProjectOrgProjects(projects));
        } else if (action instanceof SetOrganization) {
          // nullifying the project
          // when visiting the organization page
          dispatches.push(new NullifyOrgProject());
          dispatches.push(new SetOrganizationProjects(projects));
        }
        if (timeOff.length) {
          dispatches.push(new UpsertOrgTimeOff(timeOff));
        }
        if (users.length) {
          dispatches.push(new SetOrganizationUsers(users));
        }
        return ctx.dispatch(dispatches);
      })
    );
  }
  @Action(SaveOrganizationSchedule)
  saveOrganizationSchedule(ctx: StateContext<OrganizationsStateModel>, action: SaveOrganizationSchedule) {
    const state = ctx.getState();
    if (!state.organization) {
      console.warn('No organization found to save schedule.');
      return;
    }
    return this.orgsService.updateOrganization(state.organization._id, action.organization).pipe(
      tap(updatedOrganization => {
        if (updatedOrganization) {
          ctx.setState({
            ...state,
            organization: updatedOrganization
          });
        }
      }),
      catchError(error => {
        console.error('Error saving organization schedule:', error);
        return of(null);
      })
    );
  }
}
