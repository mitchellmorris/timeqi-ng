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
  SetProjectTasksTimeOff, 
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
    lookup: {
      organization: [],
      project: [],
      task: []
    },
    tasks: {}
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
        state.lookup.organization = action.timeOff.map(item => item._id);
        break;
      case action instanceof SetProjectTimeOff:
        state.lookup.project = action.timeOff.map(item => item._id);
        break;
      case action instanceof SetTaskTimeOff:
        state.lookup.task = action.timeOff.map(item => item._id);
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
    const lookupIds: string[] = [];
    switch(true) {
      case action instanceof CleanOrgTimeOff:
        lookupIds.push(
          ...state.lookup.organization, 
          ...state.lookup.project, 
          ...state.lookup.task
        );
        state.lookup.organization = [];
        state.lookup.project = [];
        state.lookup.task = [];
        break;
      case action instanceof CleanProjectTimeOff:
        lookupIds.push(
          ...state.lookup.project, 
          ...state.lookup.task
        );
        state.lookup.project = [];
        state.lookup.task = [];
        break;
      case action instanceof CleanTaskTimeOff:
        lookupIds.push(
          ...state.lookup.task
        );
        state.lookup.task = [];
        break;
    }
    ctx.setState({
      ...state,
      timeoffs: state.timeoffs.filter(timeOff => 
        !lookupIds.includes(timeOff._id)
      )
    });
  }

  @Action(SetProjectTasksTimeOff)
  setProjectTasksTimeOff(ctx: StateContext<TimeOffStateModel>, action: SetProjectTasksTimeOff) {
    const state = ctx.getState();
    const taskGroups = { ...state.tasks };
    action.timeOff.forEach(timeOff => {
      const taskId = timeOff.target as string;
      if (!taskGroups[taskId]) {
        taskGroups[taskId] = [];
      }
      taskGroups[taskId].push(timeOff);
    });
    ctx.setState({
      ...state,
      tasks: taskGroups
    });
  }
}