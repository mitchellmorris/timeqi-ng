import { Injectable } from '@angular/core';
import { State, Action, Selector, StateContext, Store } from '@ngxs/store';
import { CleanTaskActivity, SetProjectActivity, SetProjectTaskActivity } from './activity.actions';
import { ActivityStateModel, InstanceProject, InstanceTask, Project, Activity } from '@betavc/timeqi-sh';
import { reduce } from 'ramda';



@State<ActivityStateModel>({
  name: 'activity',
  defaults: {
    activity: []
  }
})
@Injectable()
export class ActivityState {

  constructor(
    private store: Store,
  ) {}

  @Selector()
  static getState(state: ActivityStateModel) {
    return state;
  }

  @Action(SetProjectActivity)
  @Action(SetProjectTaskActivity)
  addTaskActivity(ctx: StateContext<ActivityStateModel>, { activity }: SetProjectTaskActivity) {
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