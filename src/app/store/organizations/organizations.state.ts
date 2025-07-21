import { Injectable } from '@angular/core';
import { State, Action, Selector, StateContext } from '@ngxs/store';
import { AddOrganizations } from './organizations.actions';
import { Organization } from '../../schemas/organization';
import { Organizations as OrganizationsService } from './organizations';
import { tap } from 'rxjs';

export interface OrganizationsStateModel {
  organizations: Organization[];
  organization: Organization | null;
}

@State<OrganizationsStateModel>({
  name: 'organizations',
  defaults: {
    organizations: [],
    organization: null,
  }
})
@Injectable()
export class OrganizationsState {

  constructor(private organizationsService: OrganizationsService) {}

  @Selector()
  static getState(state: OrganizationsStateModel) { return state; }

  @Action(AddOrganizations) 
  addAll(ctx: StateContext<OrganizationsStateModel>, { payload }: AddOrganizations) {
    const stateModel = ctx.getState();
    return this.organizationsService.populateOrganizations(payload).pipe(
      tap(organizations => ctx.setState({
        ...stateModel,
        organizations: [...stateModel.organizations, ...organizations]
      }))
    );
  }
}
