import { Injectable } from '@angular/core';
import { State, Action, Selector, StateContext, Store } from '@ngxs/store';
import { CleanOrgTasks, NullifyProjectTask, SetProjectTasks, SetTask } from './tasks.actions';
import { PartialEntry, Task, TasksStateModel } from '@betavc/timeqi-sh';
import { Tasks as TasksService } from './tasks';
import { map, mergeMap, of, tap } from 'rxjs';
import { dissoc } from 'ramda';
import { CleanTaskEntries, SetTaskEntries } from '../entries/entries.actions';
import { SetTaskProject } from '../projects/projects.actions';

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
    const state = this.store.selectSnapshot(state => state);
    const task = state.tasks.task;
    const entries = state.entries.entries;
    const taskId = task ? task._id : null;
    const getTask$ = taskId === action.id ? of(task) : this.tasksService.getTask(action.id!);
    if (!action.id) {
      ctx.setState({
        ...ctx.getState(),
        task: null
      });
      ctx.dispatch(new CleanTaskEntries());
      return;
    }
    return getTask$.pipe(
      map(task => task
        ? { task: dissoc<Task, 'entries'>('entries', task), entries: task.entries || entries }
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
        const dispatches = [];
        dispatches.push(new SetTaskEntries(entries as PartialEntry[]));
        // Get project from global ProjectsState
        // Note: We are assuming that setting the new project also sets the organization.
        if (task && task.project) {
          dispatches.push(new SetTaskProject(task.project as string));
        }
        return ctx.dispatch(dispatches);
      })
    );
  }
  @Action(NullifyProjectTask)
  nullifyProjectTask(ctx: StateContext<TasksStateModel>) {
    ctx.setState({
      ...ctx.getState(),
      task: null
    });
    ctx.dispatch(new NullifyTaskEntry());
  }
  @Action(CleanOrgTasks)
  cleanOrgTasks(ctx: StateContext<TasksStateModel>) {
    ctx.setState({
      tasks: [],
      task: null
    });
  }
}
