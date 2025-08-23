import { Injectable } from '@angular/core';
import { State, Action, Selector, StateContext, Store } from '@ngxs/store';
import { SetProjectTasks, SetTask } from './tasks.actions';
import { PartialEntry, Task, TasksStateModel } from '@betavc/timeqi-sh';
import { Tasks as TasksService } from './tasks';
import { map, mergeMap, tap } from 'rxjs';
import { dissoc } from 'ramda';
import { SetTaskEntries } from '../entries/entries.actions';
import { SetTaskOrganization } from '../organizations/organizations.actions';
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
        // Get organization from global OrganizationsState
        const organization = this.store.selectSnapshot<any>(state => state.organizations.organization);
        if (task && task.organization && !organization) {
          dispatches.push(ctx.dispatch(new SetTaskOrganization(task.organization as string)));
        }
        // Get organization from global OrganizationsState
        const project = this.store.selectSnapshot<any>(state => state.projects.project);
        if (task && task.project && !project) {
          dispatches.push(ctx.dispatch(new SetTaskProject(task.project as string)));
        }
        return Promise.all(dispatches);
      })
    );
  }
}
