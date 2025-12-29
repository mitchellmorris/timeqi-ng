import { computed, effect, inject, Injectable, signal, Signal, untracked, WritableSignal } from '@angular/core';
import { ProjectsState } from '../../store/projects/projects.state';
import { 
  InstanceTask, 
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
  // Current Project
  private projectPopulated: Signal<Project | null> = this.store.selectSignal(ProjectsState.getPopulatedProject);
  // Used to merge in any local changes to the project
  projectModel: WritableSignal<Project | null> = signal(null);
  private debouncedProjectModel = toSignal(
    toObservable(this.projectModel).pipe(
      debounceTime(300)
    ),
    { initialValue: null }
  );
  // Merged Project
  private projectContext: Signal<Project | null> = computed(() => {
    const projectPopulated = this.projectPopulated();
    const projectModel = this.debouncedProjectModel();

    if (!projectPopulated && !projectModel) return null;
    if (!projectModel) return projectPopulated;
    if (!projectPopulated) return projectModel;

    return { ...projectPopulated, ...projectModel };
  });
  // Current Task (when available in the context)
  private task: Signal<Task | null> = this.store.selectSignal(TasksState.getTask);
  // Used to merge in any local changes to the task
  taskModel: WritableSignal<Partial<Task> | null> = signal(null);
  private debouncedTaskModel = toSignal(
    toObservable(this.taskModel).pipe(
      debounceTime(300)
    ),
    { initialValue: null }
  );
  // Merged Task
  private taskContext: Signal<Partial<Task> | null> = computed(() => {
    const task = this.task();
    const taskModel = this.debouncedTaskModel();

    if (!task && !taskModel) return null;
    if (!taskModel) return task;
    if (!task) return taskModel;

    return { ...task, ...taskModel };
  });

  constructor() {
    effect(() => {
      const projectPopulated = this.projectContext();
      if (!projectPopulated) return;
      // This also includes updates that are only accessible through the taskContext
      const taskUpdated = this.taskContext();
      // This inserts the updated task into the tasks array at the correct index
      const projectWithUpdatedTask = upsertTaskIntoProjectTasks(
        taskUpdated as Task, 
        projectPopulated
      );
      this.store.dispatch(new SetProjectProjection(projectWithUpdatedTask));
    });
  }
}
