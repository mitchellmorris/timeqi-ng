import { Injectable } from '@angular/core';
import { State, Action, Selector, StateContext, Store } from '@ngxs/store';
import { EntriesStateModel, Entry, InstanceEntry } from '@betavc/timeqi-sh';
import { 
  CleanProjectTaskEntries, 
  NullifyTaskEntry, 
  SetProjectTaskEntries,
} from './entries.actions';
import { Entries } from './entries';
import { mergeMap, tap } from 'rxjs/operators';
import { of, reduce } from 'ramda';

@State<EntriesStateModel>({
  name: 'entries',
  defaults: {
    entries: {},
    entry: null,
  }
})
@Injectable()
export class EntriesState {

  constructor(
    private store: Store,
    private entriesService: Entries
  ) {}

  @Selector()
  static getState(state: EntriesStateModel) {
    return state;
  }

  @Selector()
  static getEntries(state: EntriesStateModel) {
    return state.entries;
  }

  @Action(SetProjectTaskEntries)
  setEntries(ctx: StateContext<EntriesStateModel>, action: SetProjectTaskEntries) {
    const state = this.store.selectSnapshot(state => state);
    const task = state.tasks.task;
    return this.entriesService.getEntries(action.projectId).pipe(
      tap((entries: Entry[] | null) => {
        // Always update state, even if entries is null or empty array
        const state = ctx.getState();
        ctx.setState({
          ...state,
          entries: reduce((acc:{ [taskId: string]: InstanceEntry[] }, entry) => {
            const taskId = entry.task as string;
            if (!acc[taskId])
              acc[taskId] = [];
            acc[taskId].push(entry);
            return acc;
          }, {}, entries || [])
        });
      })
    );
  }

  @Action(NullifyTaskEntry)
  nullifyTaskEntry(ctx: StateContext<EntriesStateModel>) {
    const state = ctx.getState();
    ctx.setState({
      ...state,
      entry: null
    });
  }

  @Action(CleanProjectTaskEntries)
  cleanProjectEntries(ctx: StateContext<EntriesStateModel>) {
    const state = ctx.getState();
    ctx.setState({
      ...state,
      entries: {}
    });
    ctx.dispatch(new NullifyTaskEntry());
  }
}
