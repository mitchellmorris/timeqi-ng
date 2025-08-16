import { Injectable } from '@angular/core';
import { State, Action, Selector, StateContext, Store } from '@ngxs/store';
import { SetProjectTasks, SetTask } from './tasks.actions';
import { PartialEntry, Task, TasksStateModel } from '@betavc/timeqi-sh';
import { Tasks as TasksService } from './tasks';
import { map, mergeMap, tap } from 'rxjs';
import { dissoc } from 'ramda';
import { SetTaskEntries } from '../entries/entries.actions';

@State<TasksStateModel>({
  name: 'tasks',
  defaults: {
    tasks: [],
    task: null,
  }
})
@Injectable()
export class TasksState {

  constructor(
    private tasksService: TasksService,
    private store: Store,
  ) {}

  @Selector()
  static getState(state: TasksStateModel) { return state; }

  @Action(SetProjectTasks)
  setProjectTasks(ctx: StateContext<TasksStateModel>, action: SetProjectTasks) {
    const state = ctx.getState();
    ctx.setState({
      ...state,
      tasks: action.tasks
    });
  }

  @Action(SetTask)
  setTask(ctx: StateContext<TasksStateModel>, action: SetTask) {
    if (!action.id) {
      ctx.setState({
        ...ctx.getState(),
        task: null
      });
      ctx.dispatch(new SetTaskEntries([]))
      return;
    }
    return this.tasksService.getTask(action.id).pipe(
      map(task => task
        ? { task: dissoc<Task, 'entries'>('entries', task), entries: task.entries || [] }
        : { task: null, entries: [] }
      ),
      tap(({ task }) => {
        const state = ctx.getState();
        if (!task) {
          console.warn('No task found, setting task to null.');
          ctx.setState({
            ...state,
            task: null
          });
        } else {
          ctx.setState({
            ...state,
            task
          });
        }
      }),
      mergeMap(({ entries, task }) => {
        const dispatches = [ctx.dispatch(new SetTaskEntries(entries as PartialEntry[]))];
        return Promise.all(dispatches);
      })
    );
  }
}
