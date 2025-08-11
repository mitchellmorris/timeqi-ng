import { Injectable } from '@angular/core';
import { State, Action, Selector, StateContext } from '@ngxs/store';
import { SetUser } from './user.actions';
import { User as UserService } from './user';
import { map, mergeMap, tap } from 'rxjs';
import { User, UserStateModel } from '../../schemas/user';
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
  static getState(state: UserStateModel) {
    return state;
  }

  @Action(SetUser)
  setUser(ctx: StateContext<UserStateModel>) {
    return this.userService.getUser().pipe(
      map(user => user
        ? { user: dissoc<User, 'organizations'>('organizations', user), organizations: user.organizations || [], timeOff: user.timeOff || [] }
        : { user: null, organizations: [], timeOff: [] }
      ),
      tap(({ user, organizations }) => {
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
        new SetUserOrganizations(organizations),
        ...(timeOff.length ? [new UpsertUserTimeOff(timeOff)] : [])
      ])),
      // map(({ user }) => user)
    );
  }
}
