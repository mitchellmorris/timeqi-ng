import { Injectable } from '@angular/core';
import { State, Action, Selector, StateContext } from '@ngxs/store';
import { CleanTaskActivity, SetTaskActivity } from './activity.actions';
import { ActivityStateModel } from '@betavc/timeqi-sh';



@State<ActivityStateModel>({
  name: 'activity',
  defaults: {
    activity: []
  }
})
@Injectable()
export class ActivityState {

  @Selector()
  static getState(state: ActivityStateModel) {
    return state;
  }

  @Action(SetTaskActivity)
  add(ctx: StateContext<ActivityStateModel>, { activity }: SetTaskActivity) {
    const state = ctx.getState();
    ctx.setState({
      ...state,
      activity: activity
    });
  }

  @Action(CleanTaskActivity)
  clean(ctx: StateContext<ActivityStateModel>) {
    ctx.setState({
      activity: []
    });
  }
}