import { Injectable } from '@angular/core';
import { State, Action, Selector, StateContext } from '@ngxs/store';
import { SetOrganizationUsers, SetUser } from './user.actions';
import { User as UserService } from './user';
import { map, mergeMap, tap } from 'rxjs';
import { map as _map } from 'ramda';
import { InstanceOrganization, PartialTimeOff, User, UserStateModel } from '@betavc/timeqi-sh';
import { SetUserOrganizations } from '../organizations/organizations.actions';
import { dissoc } from 'ramda';
import { UpsertUserTimeOff } from '../time-off/time-off.actions';

@State<UserStateModel>({
  name: 'users',
  defaults: {
    users: [],
    user: null
  }
})
@Injectable()
export class UserState {

  constructor(private userService: UserService) {}

  @Selector()
  static getState(state: UserStateModel) { return state; }

  @Selector()
  static getUsers(state: UserStateModel) { return state.users; }

  @Selector()
  static getUserSelectOptions(state: UserStateModel) { 
    return _map(user => ({ label: user.name, value: user._id }), state.users); 
  }
  
  @Action(SetOrganizationUsers) 
  setUserOrganizations(ctx: StateContext<UserStateModel>, action: SetOrganizationUsers) {
    const state = ctx.getState();
    ctx.setState({
      ...state,
      users: action.users
    });
  }

  @Action(SetUser)
  setUser(ctx: StateContext<UserStateModel>) {
    return this.userService.getUser().pipe(
      map(user => user
        ? { user: dissoc<User, 'organizations'>('organizations', user), organizations: user.organizations || [] }
        : { user: null, organizations: [], timeOff: [] }
      ),
      tap(({ user }) => {
        const state = ctx.getState();
        if (!user) {
          console.warn('No user found, setting user to null.');
          ctx.setState({
            ...state,
            user: null
          });
          return;
        } else {
          ctx.setState({
            ...state,
            user
          });
        }
      }),
      mergeMap(({ organizations, timeOff }) => ctx.dispatch([
        new SetUserOrganizations(organizations as InstanceOrganization[])
      ])),
      // map(({ user }) => user)
    );
  }
}
