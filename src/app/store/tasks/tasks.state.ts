import { Injectable } from '@angular/core';
import { State, Action, Selector, StateContext } from '@ngxs/store';
import { SetProjectTasks } from './tasks.actions';
import { TasksStateModel } from '../../schemas/task';

@State<TasksStateModel>({
  name: 'tasks',
  defaults: {
    tasks: [],
    task: null,
  }
})
@Injectable()
export class TasksState {

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
}
