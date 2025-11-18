import { Injectable } from '@angular/core';
import { State, Action, Selector, StateContext } from '@ngxs/store';
import { UpsertOrgTimeOff, UpsertProjectTimeOff, UpsertUserTimeOff } from './time-off.actions';
import { TimeOffStateModel } from '@betavc/timeqi-sh';

@State<TimeOffStateModel>({
  name: 'timeoff',
  defaults: {
    timeoff: null,
    timeoffs: []
  }
})
@Injectable()
export class TimeOffState {
  @Selector()
  static getState(state: TimeOffStateModel) {
    return state;
  }

  @Selector()
  static getTimeOff(state: TimeOffStateModel) {
    return state.timeoff;
  }

  @Selector()
  static getTimeOffs(state: TimeOffStateModel) {
    return state.timeoffs;
  }

  @Action(UpsertUserTimeOff)
  @Action(UpsertOrgTimeOff)
  @Action(UpsertProjectTimeOff)
  upsertTimeOff(ctx: StateContext<TimeOffStateModel>, action: UpsertOrgTimeOff | UpsertUserTimeOff | UpsertProjectTimeOff) {
    const state = ctx.getState();
    const existingIds = new Set(state.timeoffs.map(item => item._id));
    const newTimeOffs = action.timeOff.filter(item => !existingIds.has(item._id));
    ctx.setState({
      ...state,
      timeoffs: [
        ...state.timeoffs,
        ...newTimeOffs
      ]
    });
  }
}
