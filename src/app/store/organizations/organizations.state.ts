import { inject, Injectable } from '@angular/core';
import { State, Action, Selector, StateContext, } from '@ngxs/store';
import { SaveOrganizationSchedule, SetOrganization, SetProjectOrganization, SetTaskOrganization, SetUserOrganizations } from './organizations.actions';
import { Organization, OrganizationsStateModel, PartialProject, PartialTimeOff } from '@betavc/timeqi-sh';
import { Organizations as OrganizationsService } from './organizations';
import { map, merge, mergeMap, tap, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { dissoc } from 'ramda';
import { NullifyOrgProject, SetOrganizationProjects, SetProject, SetProjectOrgProjects, SetTaskOrgProjects } from '../projects/projects.actions';
import { UpsertOrgTimeOff } from '../time-off/time-off.actions';
import { CleanOrgTasks } from '../tasks/tasks.actions';


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
  @Action(SetTaskOrganization)
  @Action(SetProjectOrganization)
  @Action(SetOrganization)
  SetOrganization(ctx: StateContext<OrganizationsStateModel>, action: SetOrganization | SetProjectOrganization) {
    // this.setOrganization$(ctx, action);
    return this.orgsService.getOrganization(action.id).pipe(
      map(organization => organization
        ? { 
          organization: dissoc<Organization, 'projects'>('projects', organization), 
          projects: organization.projects as PartialProject[] || [], 
          timeOff: organization.timeOff as PartialTimeOff[] || [] 
        } : { organization: null, projects: [], timeOff: [] }
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
      mergeMap(({ projects, timeOff }) => {
        const dispatches = [];
        if (action instanceof SetProjectOrganization) {
          dispatches.push(new SetProjectOrgProjects(projects));
        } else if (action instanceof SetTaskOrganization) {
          dispatches.push(new SetTaskOrgProjects(projects));
        } else {
          // For now we are just nullifying the project if there's more than one
          dispatches.push(new NullifyOrgProject());
          dispatches.push(new SetOrganizationProjects(projects));
        }
        if (timeOff.length) {
          dispatches.push(new UpsertOrgTimeOff(timeOff));
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
    return this.orgsService.saveOrganization(state.organization._id, action.organization).pipe(
      map(updatedOrganization => {
        ctx.setState({
          ...state,
          organization: updatedOrganization
        });
      }),
      catchError(error => {
        console.error('Error saving organization schedule:', error);
        return of(null);
      })
    );
  }
}
