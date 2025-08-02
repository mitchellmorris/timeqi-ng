import { Injectable } from '@angular/core';
import { State, Action, Selector, StateContext, Store, Select } from '@ngxs/store';
import { SetUserOrganizations } from './organizations.actions';
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

  constructor() {}

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
}
