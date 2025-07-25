import { Injectable } from '@angular/core';
import { State, Action, Selector, StateContext } from '@ngxs/store';
import { SetUser } from './user.actions';
import { User as UserService } from './user';
import { tap } from 'rxjs';
import { PopulatedUser, User, UserStateModel } from '../../schemas/user';

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
    const stateModel = ctx.getState();
    ctx.setState(stateModel);
    return this.userService.setUser().pipe(
      tap(user => ctx.setState({
        ...stateModel,
        user
      }))
    );
  }
}
