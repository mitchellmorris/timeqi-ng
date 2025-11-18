import { Injectable } from '@angular/core';
import { State, Action, Selector, StateContext } from '@ngxs/store';
import { EntriesStateModel, Entry } from '@betavc/timeqi-sh';
import { CleanTaskEntries, SetProjectEntries, SetTaskEntries } from './entries.actions';
import { Entries } from './entries';
import { tap } from 'rxjs/operators';

@State<EntriesStateModel>({
  name: 'entries',
  defaults: {
    entries: [],
    entry: null,
  }
})
@Injectable()
export class EntriesState {

  constructor(
    private entriesService: Entries
  ) {}

  @Selector()
  static getState(state: EntriesStateModel) {
    return state;
  }

  @Action(SetProjectEntries)
  setProjectEntries(ctx: StateContext<EntriesStateModel>, action: SetProjectEntries) {
    const projectEntries$ = this.entriesService.getProjectEntries(action.projectId);
    return projectEntries$.pipe(
      tap((entries: Entry[] | null) => {
        if (entries) {
          const state = ctx.getState();
          ctx.setState({
            ...state,
            entries
          });
        }
      })
    );
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
