import { Injectable } from '@angular/core';
import { State, Action, Selector, StateContext } from '@ngxs/store';
import { EntriesStateModel } from '@betavc/timeqi-sh';
import { CleanTaskEntries, SetTaskEntries } from './entries.actions';

@State<EntriesStateModel>({
  name: 'entries',
  defaults: {
    entries: [],
    entry: null,
  }
})
@Injectable()
export class EntriesState {

  @Selector()
  static getState(state: EntriesStateModel) {
    return state;
  }

  @Action(SetTaskEntries)
  setTaskEntries(ctx: StateContext<EntriesStateModel>, action: SetTaskEntries) {
    const state = ctx.getState();
    ctx.setState({
      ...state,
      entries: action.entries
    });
  }

  @Action(CleanTaskEntries)
  cleanTaskEntries(ctx: StateContext<EntriesStateModel>) {
    ctx.setState({
      entries: [],
      entry: null
    });
  }
}
