import { computed, effect, inject, Injectable, signal, Signal, untracked, WritableSignal } from '@angular/core';
import { ProjectsState } from '../../store/projects/projects.state';
import { 
  isTaskProjectionCandidate,
  Project,
  Task,
  upsertTaskIntoProjectTasks,
} from '@betavc/timeqi-sh';
import { Store } from '@ngxs/store';
import { TasksState } from '../../store/tasks/tasks.state';
import { SetProjectProjection } from '../../store/projects/projects.actions';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { debounceTime } from 'rxjs';
import { pick } from 'ramda';

@Injectable({
  providedIn: 'root'
})
export class Projection {
  private store = inject(Store);
  private debouncedModel = <T,>(model: WritableSignal<T | null>) => {
    return toSignal(
      toObservable(model).pipe(
        debounceTime(300)
      ),
      { initialValue: null }
    );
  }
  private context = (original: any, workingModel: any) => {
    if (!original && !workingModel) return null;
    if (!workingModel) return original;
    if (!original) return workingModel;
    return { ...original, ...workingModel };
  };
  // Current Project
  private projectPopulated: Signal<Project | null> = this.store.selectSignal(ProjectsState.getPopulatedProject);
  // Used to merge in any local changes to the project
  projectModel: WritableSignal<Project | null> = signal(null);
  // 300ms debounce to avoid rapid updates
  private debouncedProjectModel = this.debouncedModel(this.projectModel);
  // Merged Project
  private projectContext: Signal<Project | null> = computed(() => {
    const projectPopulated = this.projectPopulated();
    const projectModel = this.debouncedProjectModel();
    return this.context(projectPopulated, projectModel);
  });
  // Current Task (when available in the context)
  private task: Signal<Task | null> = this.store.selectSignal(TasksState.getTask);
  // Used to merge in any local changes to the task
  taskModel: WritableSignal<Partial<Task> | null> = signal(null);
  // 300ms debounce to avoid rapid updates
  private debouncedTaskModel = this.debouncedModel(this.taskModel);
  // Merged Task
  private taskContext: Signal<Task | null> = computed(() => {
    const task = this.task();
    const taskModel = this.debouncedTaskModel();
    const taskUpdated = this.context(task, taskModel);
    if (taskUpdated && isTaskProjectionCandidate(taskUpdated)) {
      return this.context(task, taskModel);
    } else {
      return null;
    }
  });

  constructor() {
    effect(() => {
      const projectPopulated = this.projectContext();
      if (!projectPopulated) return;
      // This also includes updates that are only accessible through the taskContext
      const taskUpdated = this.taskContext();
      if (!!taskUpdated) {
        // This inserts the updated task into the tasks array at the correct index
        const projectWithUpdatedTask = upsertTaskIntoProjectTasks(
          taskUpdated as Task, 
          projectPopulated
        );
        this.store.dispatch(new SetProjectProjection(projectWithUpdatedTask));
      } else {
        this.store.dispatch(new SetProjectProjection(projectPopulated));
      }
    });
  }
}
