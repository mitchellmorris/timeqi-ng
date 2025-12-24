import { Injectable } from '@angular/core';
import { 
  State, 
  Action, 
  Selector, 
  StateContext, 
  Store, 
} from '@ngxs/store';
import { 
  NullifyOrganization,
  SaveOrganizationSchedule, 
  SetOrganization, 
  SetProjectOrganization, 
  SetUserOrganizations 
} from './organizations.actions';
import { 
  OrganizationsStateModel, 
} from '@betavc/timeqi-sh';
import { Organizations as OrganizationsService } from './organizations';
import { mergeMap, tap, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { 
  CleanOrgProjects,
  NullifyOrgProject, 
  SetOrganizationProjects,
} from '../projects/projects.actions';
import { 
  CleanOrgTimeOff, 
  SetOrgTimeOff, 
} from '../time-off/time-off.actions';
import { 
  CleanOrganizationUsers, 
  SetOrganizationUsers, 
} from '../user/user.actions';


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
    const state = ctx.getState();
    const states = this.store.selectSnapshot(state => state);
    const organization = states.organizations.organization;
    // Check if the organization is already in the state
    const organizationId = organization?._id;
    if (!action.id && !organization) {
      console.warn('warning: No organization id provided, nullifying organization.');
      return ctx.dispatch(new NullifyOrganization());
    }

    // Only fetch the organization if it's not already in the state
    const getOrg$ = organizationId === action.id ? 
      of(organization) : 
      this.orgsService.getOrganization(action.id || organizationId);

    return getOrg$.pipe(
      mergeMap((organization) => {
        if (!organization) {
          console.warn('warning: No organization found, nullifying organization.');
          return ctx.dispatch(new NullifyOrganization());
        }

        const dispatches = [];
        const projects = organization.projects || states.projects.projects;
        const timeOff = organization.timeOff || states.timeoff.timeoffs;
        const users = organization.users || states.users.users;

        ctx.setState({
          ...state,
          organization
        });

        // If the action is setting a project organization, update the projects list
        if (action instanceof SetOrganization)
          // nullifying the project
          // and cleaning the time off
          // when visiting the organization page
          dispatches.push(new NullifyOrgProject());
        // Also calls setOrganizationProjects
        dispatches.push(new SetOrganizationProjects(projects));

        if (timeOff.length > 0) 
          // set or override the organization's time off
          dispatches.push(new SetOrgTimeOff(timeOff));

        if (users.length > 0) 
          dispatches.push(new SetOrganizationUsers(users));

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

  @Action(NullifyOrganization)
  nullifyOrganization(ctx: StateContext<OrganizationsStateModel>) {
    const state = ctx.getState();
    const dispatches = [];
    if (state.organization) {
      ctx.setState({
        ...state,
        organization: null
      });
      dispatches.push(
        new CleanOrgTimeOff(),
        new CleanOrganizationUsers(),
        new CleanOrgProjects()
      );
    }
    return ctx.dispatch(dispatches);
  }
}