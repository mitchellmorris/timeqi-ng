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
  UpdateTask, 
  SetNewTask,
  CleanNewTask,
  CleanTaskProjections,
  CleanProjectTaskProjections,
  CreateTask
} from './tasks.actions';
import { 
  getId, 
  InstanceTimeOff, 
  Task, 
  TASK_PROJECTION_SCALAR_FIELDS, 
  TASK_PROJECTION_RELATIONAL_FIELDS,
  TasksStateModel, 
  isTaskProjectionCandidate,
  InstanceTask
} from '@betavc/timeqi-sh';
import { Tasks as TasksService } from './tasks';
import { catchError, map, mergeMap, of, tap } from 'rxjs';
import { omit } from 'ramda';
import { SetTaskProject } from '../projects/projects.actions';
import { CleanTaskActivity } from '../activity/activity.actions';
import { CleanTaskTimeOff, SetTaskTimeOff } from '../time-off/time-off.actions';
import { CleanTaskUsers, SetTaskUsers } from '../user/user.actions';

@State<TasksStateModel>({
  name: 'tasks',
  defaults: {
    tasks: [],
    task: null,
    projection: null,
    projections: [],
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
  static getProjection(state: TasksStateModel): Task | null { 
    if (!state.task) return null;
    const projection = { ...state.task, ...state.projection };
    if (!isTaskProjectionCandidate(projection)) return null;
    return { ...state.task, ...state.projection } as Task;
  }

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
          task: omit(
            TASK_PROJECTION_RELATIONAL_FIELDS as (keyof Task)[], task
          ) as Task
        });
        // Get project from global ProjectsState
        // Note: We are assuming that setting the new project also sets the organization.
        if (task.project) {
          dispatches.push(new SetTaskProject(
            getId(task.project)
          ));
        }
        dispatches.push(new SetTaskUsers(task.users as string[]));

        if (task.timeOff && task.timeOff.length) {
          dispatches.push(new SetTaskTimeOff(task.timeOff as InstanceTimeOff[]));
        } 

        return ctx.dispatch(dispatches);
      })
    );
  }

  @Action(SetNewTask)
  setNewTask(ctx: StateContext<TasksStateModel>, action: SetNewTask) {
    const state = ctx.getState();
    const tasks = state.tasks;
    const newTask: Task = {
      ...action.task,
      index: action.index ?? tasks.length,
    } as Task;
    tasks.splice(action.index ?? tasks.length, 0, omit(
      TASK_PROJECTION_RELATIONAL_FIELDS as (keyof Task)[], newTask
    ) as Task);
    ctx.setState({
      ...state,
      tasks,
      task: omit(
        TASK_PROJECTION_RELATIONAL_FIELDS as (keyof Task)[], newTask
      ) as Task
    });
  }

  @Action(CreateTask)
  createTask(ctx: StateContext<TasksStateModel>, action: CreateTask) {
    return this.tasksService.createTask(action.task).pipe(
      tap((newTask) => {
        if (newTask) {
          const state = ctx.getState();
          // Replace the temporary new task with the created task
          state.tasks.splice(newTask.index, 1, newTask);
          ctx.setState({
            ...state,
            task: newTask
          });
        }
      }),
      catchError(error => {
        console.error('Error creating organization schedule:', error);
        return of(null);
      })
    );
  }

  @Action(CleanNewTask)
  cleanNewTask(ctx: StateContext<TasksStateModel>) {
    const state = ctx.getState();
    const tasks = state.tasks;
    const task = state.task;
    if (task && task._id && task._id.startsWith('new-task-')) {
      const index = tasks.findIndex(t => t._id === task._id);
      if (index >= 0) tasks.splice(index, 1);
    }
    ctx.setState({
      ...state,
      tasks,
      task: null,
      projections: [],
      projection: null,
    });
  }

  @Action(UpdateTask)
  updateTask(ctx: StateContext<TasksStateModel>, action: UpdateTask) {
    return this.tasksService.updateTask(action.id, action.task).pipe(
      tap((existingTask) => {
        if (existingTask) {
          const state = ctx.getState();
          if (state.task) {
            state.tasks[state.task.index] = existingTask;
          }
          ctx.setState({
            ...state,
            task: existingTask
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
    const omittedFields = TASK_PROJECTION_RELATIONAL_FIELDS as readonly (keyof Task)[];
    ctx.setState({
      ...state,
      projection: omit(omittedFields, action.taskProjection)
    });
  }

  @Action(SetProjectTasksProjections)
  setTasksProjections(ctx: StateContext<TasksStateModel>, action: SetProjectTasksProjections) {
    const state = ctx.getState();
    const omittedFields = TASK_PROJECTION_RELATIONAL_FIELDS as readonly (keyof InstanceTask)[];
    ctx.setState({
      ...state,
      projections: action.projections.map((task) => {
        return omit(omittedFields, task);
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
      new CleanTaskUsers(),
      new CleanTaskTimeOff(),
      new CleanTaskActivity()
    ]);
  }
  @Action(CleanTaskProjections)
  @Action(CleanProjectTaskProjections)
  cleanTaskProjections(ctx: StateContext<TasksStateModel>) {
    const state = ctx.getState();
    ctx.setState({
      ...state,
      projections: [],
      projection: null,
    });
  };

  @Action(CleanProjectTasks)
  cleanTasks(ctx: StateContext<TasksStateModel>) {
    const state = ctx.getState();
    ctx.setState({
      ...state,
      tasks: []
    });
    return ctx.dispatch([
      new CleanTaskProjections(),
      new NullifyTask(),
    ]);
  }
}
