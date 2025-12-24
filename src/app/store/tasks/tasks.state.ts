import { Injectable } from '@angular/core';
import { State, Action, Selector, StateContext, Store } from '@ngxs/store';
import { 
  CleanProjectTasks, 
  NullifyProjectTask, 
  NullifyTask, 
  SetProjectTasks, 
  SetTask, 
  SetProjectTaskProjection, 
  SetProjectTasksProjections, 
  UpdateTask 
} from './tasks.actions';
import { getId, InstanceTimeOff, TasksStateModel } from '@betavc/timeqi-sh';
import { Tasks as TasksService } from './tasks';
import { catchError, map, mergeMap, of, tap } from 'rxjs';
import { equals, pickBy } from 'ramda';
import { SetTaskProject } from '../projects/projects.actions';
import { CleanTaskActivity } from '../activity/activity.actions';
import { CleanTaskTimeOff, SetTaskTimeOff } from '../time-off/time-off.actions';

@State<TasksStateModel>({
  name: 'tasks',
  defaults: {
    tasks: [],
    task: null,
    projection: null,
    projections: []
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

  @Selector()
  static getTask(state: TasksStateModel) { return state.task; }

  @Selector()
  static getTasks(state: TasksStateModel) { return state.tasks; }

  @Selector()
  static getProjection(state: TasksStateModel) { return state.projection; }

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
    const state = ctx.getState();
    const states = this.store.selectSnapshot(state => state);
    const task = states.tasks.task;
    const taskId = task?._id;

    if (!action.id && !task) {
      console.warn('warning: No task id provided, nullifying task.');
      ctx.dispatch(new NullifyTask());
      return;
    }

    if (taskId === action.id && task) return;
      
    return this.tasksService.getTask(action.id || taskId).pipe(
      mergeMap(( task ) => {
        if (!task) {
          console.warn('warning: No task found, nullifying task.');
          return ctx.dispatch(new NullifyTask());
        }
        
        const dispatches = [];

        ctx.setState({
          ...state,
          task
        });
        // Get project from global ProjectsState
        // Note: We are assuming that setting the new project also sets the organization.
        if (task.project) 
          dispatches.push(new SetTaskProject(
            getId(task.project)
          ));

        if (task.timeOff && task.timeOff.length) 
          dispatches.push(new SetTaskTimeOff(task.timeOff as InstanceTimeOff[]));

        return ctx.dispatch(dispatches);
      })
    );
  }

  @Action(UpdateTask)
  updateTask(ctx: StateContext<TasksStateModel>, action: UpdateTask) {
    return this.tasksService.updateTask(action.id, action.task).pipe(
      tap((updatedTask) => {
        if (updatedTask) {
          const state = ctx.getState();
          ctx.setState({
            ...state,
            task: updatedTask
          });
        }
      }),
      catchError(error => {
        console.error('Error saving organization schedule:', error);
        return of(null);
      })
    );
  }

  @Action(SetProjectTaskProjection)
  setTaskProjection(ctx: StateContext<TasksStateModel>, action: SetProjectTaskProjection) {
    const state = ctx.getState();
    ctx.setState({
      ...state,
      projection: pickBy(
          (value, key) => {
            return !equals(value, state.task![key]) &&
            // exclude these
            [
              'tasks',
              'activity',
              'timeOff',
              'users',
              'entries'
            ].indexOf(key) === -1;
          }, 
          action.taskProjection
        )
    });
  }

  @Action(SetProjectTasksProjections)
  setTasksProjections(ctx: StateContext<TasksStateModel>, action: SetProjectTasksProjections) {
    const state = ctx.getState();
    ctx.setState({
      ...state,
      projections: action.taskProjections.map((task) => {
        return pickBy(
          (value, key) => {
            // only include these keys
            return [
              '_id',
              'index',
              'startDate',
              'status',
              'remainingEstimate',
              'targetDate',
              'projectedDate',
              'endDate',
              'leadTime',
              'trailingTime',
              'elapsedHours',
              'workedHours',
            ].indexOf(key) >= 0;
          }, 
          task
        )
      })
    });
  }

  @Action(NullifyTask)
  @Action(NullifyProjectTask)
  nullifyProjectTask(ctx: StateContext<TasksStateModel>) {
    ctx.setState({
      ...ctx.getState(),
      task: null,
      projection: null,
    });
    return ctx.dispatch([
      new CleanTaskTimeOff(),
      new CleanTaskActivity()
    ]);
  }

  @Action(CleanProjectTasks)
  cleanTasks(ctx: StateContext<TasksStateModel>) {
    const state = ctx.getState();
    ctx.setState({
      ...state,
      tasks: [],
      projections: []
    });
    return ctx.dispatch([
      new NullifyProjectTask(),
    ]);
  }
}
