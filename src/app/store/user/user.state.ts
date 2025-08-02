import { Injectable } from '@angular/core';
import { State, Action, Selector, StateContext } from '@ngxs/store';
import { SetUser } from './user.actions';
import { User as UserService } from './user';
import { map, tap } from 'rxjs';
import { User, UserStateModel } from '../../schemas/user';
import { SetUserOrganizations } from '../organizations/organizations.actions';
import { dissoc } from 'ramda';

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
    const state = ctx.getState();
    return this.userService.setUser().pipe(
      map(user => user
        ? { user: dissoc<User, 'organizations'>('organizations', user), organizations: user.organizations || [] }
        : { user: null, organizations: [] }
      ),
      tap(({ user, organizations }) => {
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
          ctx.dispatch(new SetUserOrganizations(organizations));
        }
      }),
      map(({ user }) => user)
    );
  }
}
