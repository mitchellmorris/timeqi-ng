import { Injectable } from '@angular/core';
import { 
  State, 
  Action, 
  Selector, 
  StateContext 
} from '@ngxs/store';
import { 
  CleanOrgTimeOff,
  CleanProjectTimeOff,
  CleanTaskTimeOff,
  SetOrgTimeOff, 
  SetProjectTimeOff, 
  SetTaskTimeOff, 
} from './time-off.actions';
import { TimeOffStateModel } from '@betavc/timeqi-sh';
import { concat } from 'ramda';

@State<TimeOffStateModel>({
  name: 'timeoff',
  defaults: {
    timeoff: null,
    timeoffs: [],
    grouped: {
      organization: [],
      project: [],
      task: []
    }
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

  @Action(SetOrgTimeOff)
  @Action(SetProjectTimeOff)
  @Action(SetTaskTimeOff)
  upsertTimeOff(
    ctx: StateContext<TimeOffStateModel>, 
    action: 
      | SetOrgTimeOff 
      | SetProjectTimeOff 
      | SetTaskTimeOff
    ) {
    const state = ctx.getState();
    switch(true) {
      case action instanceof SetOrgTimeOff:
        state.grouped.organization = action.timeOff.map(item => item._id);
        break;
      case action instanceof SetProjectTimeOff:
        state.grouped.project = action.timeOff.map(item => item._id);
        break;
      case action instanceof SetTaskTimeOff:
        state.grouped.task = action.timeOff.map(item => item._id);
        break;
    }
    ctx.setState({
      ...state,
      timeoffs: [
        ...state.timeoffs,
        ...action.timeOff
      ]
    });
  }

  @Action(CleanOrgTimeOff)
  @Action(CleanProjectTimeOff)
  @Action(CleanTaskTimeOff)
  cleanTimeOff(ctx: StateContext<TimeOffStateModel>, action: CleanOrgTimeOff | CleanProjectTimeOff | CleanTaskTimeOff) {
    const state = ctx.getState();
    const groupedIds: string[] = [];
    switch(true) {
      case action instanceof CleanOrgTimeOff:
        groupedIds.push(
          ...state.grouped.organization, 
          ...state.grouped.project, 
          ...state.grouped.task
        );
        state.grouped.organization = [];
        state.grouped.project = [];
        state.grouped.task = [];
        break;
      case action instanceof CleanProjectTimeOff:
        groupedIds.push(
          ...state.grouped.project, 
          ...state.grouped.task
        );
        state.grouped.project = [];
        state.grouped.task = [];
        break;
      case action instanceof CleanTaskTimeOff:
        groupedIds.push(
          ...state.grouped.task
        );
        state.grouped.task = [];
        break;
    }
    ctx.setState({
      ...state,
      timeoffs: state.timeoffs.filter(timeOff => 
        !groupedIds.includes(timeOff._id)
      )
    });
  }
}