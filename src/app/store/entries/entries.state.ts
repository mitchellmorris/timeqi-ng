import { Injectable } from '@angular/core';
import { State, Action, Selector, StateContext } from '@ngxs/store';
import { EntriesStateModel, Entry, InstanceEntry } from '@betavc/timeqi-sh';
import { CleanTaskEntries, NullifyTaskEntry, SetProjectEntries, SetTaskEntries } from './entries.actions';
import { Entries } from './entries';
import { tap } from 'rxjs/operators';
import { reduce } from 'ramda';

@State<EntriesStateModel>({
  name: 'entries',
  defaults: {
    projectEntries: {},
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

  @Selector()
  static getProjectEntries(state: EntriesStateModel) {
    return state.projectEntries;
  }

  @Action(SetProjectEntries)
  setProjectEntries(ctx: StateContext<EntriesStateModel>, action: SetProjectEntries) {
    return this.entriesService.getProjectEntries(action.projectId).pipe(
      tap((entries: Entry[] | null) => {
        const projectEntries = reduce((acc:{ [taskId: string]: InstanceEntry[] }, entry) => {
          const taskId = entry.task as string;
          if (!acc[taskId]) {
            acc[taskId] = [];
          }
          acc[taskId].push(entry);
          return acc;
        }, {}, entries || []);
        // Always update state, even if entries is null or empty array
        const state = ctx.getState();
        ctx.setState({
          ...state,
          projectEntries
        });
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

  @Action(NullifyTaskEntry)
  nullifyTaskEntry(ctx: StateContext<EntriesStateModel>) {
    const state = ctx.getState();
    ctx.setState({
      ...state,
      entry: null
    });
  }

  @Action(CleanTaskEntries)
  cleanTaskEntries(ctx: StateContext<EntriesStateModel>) {
    const state = ctx.getState();
    ctx.setState({
      ...state,
      entries: [],
      entry: null
    });
  }
}
