import { Injectable } from '@angular/core';
import { State, Action, Selector, StateContext } from '@ngxs/store';
import { UpsertOrgTimeOff, UpsertProjectTimeOff, UpsertUserTimeOff } from './time-off.actions';
import { TimeOffStateModel } from '../../schemas/time-off';

@State<TimeOffStateModel>({
  name: 'timeoff',
  defaults: {
    timeoff: []
  }
})
@Injectable()
export class TimeOffState {

  @Selector()
  static getState(state: TimeOffStateModel) {
    return state;
  }

  @Action(UpsertUserTimeOff)
  @Action(UpsertOrgTimeOff)
  @Action(UpsertProjectTimeOff)
  upsertTimeOff(ctx: StateContext<TimeOffStateModel>, action: UpsertOrgTimeOff | UpsertUserTimeOff | UpsertProjectTimeOff) {
    const state = ctx.getState();
    const existingIds = new Set(state.timeoff.map(item => item._id));
    const newTimeOffs = action.timeOff.filter(item => !existingIds.has(item._id));
    ctx.setState({
      ...state,
      timeoff: [
        ...state.timeoff,
        ...newTimeOffs
      ]
    });
  }
}
