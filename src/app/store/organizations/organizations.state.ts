import { Injectable } from '@angular/core';
import { State, Action, Selector, StateContext, Store, Select } from '@ngxs/store';
import { AddOrganizations } from './organizations.actions';
import { OrganizationsStateModel } from '../../schemas/organization';
import { Organizations as OrganizationsService } from './organizations';
import { UserState } from '../user/user.state';
import { catchError, filter, map, tap } from 'rxjs';


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
    private organizationsService: OrganizationsService
  ) {}

  @Selector()
  static getState(state: OrganizationsStateModel) { return state; }

  @Action(AddOrganizations) 
  addAll(ctx: StateContext<OrganizationsStateModel>) {
    const state = ctx.getState();
    return this.store.select(UserState.getState).pipe(
      filter(({ user }) => user !== null), // Ensure userState is not null
      map(({ user }) => user !== null ? user.organizations || [] : []),
      tap(organizations => {
        ctx.setState({
          ...state,
          organizations
        });
      }),
      catchError(error => {
        console.error('Error fetching user organizations:', error);
        return [];
      })
    );
  }
}
