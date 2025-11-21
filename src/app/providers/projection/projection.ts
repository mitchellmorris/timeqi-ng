import { computed, effect, inject, Injectable, signal, Signal, WritableSignal } from '@angular/core';
import { StateUtils } from '../utils/state';
import { ProjectsState } from '../../store/projects/projects.state';
import { 
  assignEntriesToTasks,
  PartialEntry, 
  PartialTask, 
  processProjectTasks, 
  Project,
  ProjectEntries,
  Task
} from '@betavc/timeqi-sh';
import { Store } from '@ngxs/store';
import { TasksState } from '../../store/tasks/tasks.state';
import { EntriesState } from '../../store/entries/entries.state';
import { SetProjectProjection } from '../../store/projects/projects.actions';
import { SetTaskProjection } from '../../store/tasks/tasks.actions';

@Injectable({
  providedIn: 'root'
})
export class Projection {
  private store = inject(Store);
  // Current Project
  private projectState: Signal<Project | null> = this.store.selectSignal(ProjectsState.getProject);
  // Used to merge in any local changes to the project
  projectModel: WritableSignal<Project | null> = signal(null);
  // Merged Project
  private projectContext: Signal<Project | null> = computed(() => {
    const projectState = this.projectState();
    const projectModel = this.projectModel();
    if (!projectState && !projectModel) return null;
    if (!projectModel) return projectState;
    if (!projectState) return projectModel;
    return {...projectState, ...projectModel};
  });
  // All Tasks for the current Project
  private tasks: Signal<(PartialTask | Partial<Task>)[]> = this.store.selectSignal(TasksState.getTasks);
  // All Entries for the current Project
  private projectEntries: Signal<ProjectEntries> = this.store.selectSignal(EntriesState.getProjectEntries);
  // Current Task (when available in the context)
  private taskState: Signal<Task | null> = this.store.selectSignal(TasksState.getTask);
  // Used to merge in any local changes to the task
  taskModel: WritableSignal<Partial<Task> | null> = signal(null);
  // Merged Task
  private taskContext: Signal<Partial<Task> | null> = computed(() => {
    const taskState = this.taskState();
    const taskModel = this.taskModel();
    if (!taskState && !taskModel) return null;
    if (!taskModel) return taskState;
    if (!taskState) return taskModel;
    return {...taskState, ...taskModel};
  });
  readonly project: WritableSignal<Project | null> = signal(null);
  constructor() {
    effect(() => {
      const project = this.projectContext();
      if (!project) return;
      const task = this.taskContext();
      const tasks = this.tasks();
      if (task && task.index !== undefined) tasks.splice(task.index, 1, task);
      const projectEntries = this.projectEntries();
      project.tasks = assignEntriesToTasks(tasks, projectEntries);
      processProjectTasks(project,0).then((processedProject) => {
        this.store.dispatch(new SetProjectProjection(processedProject));
        if (!!task) {
          this.store.dispatch(new SetTaskProjection(processedProject.tasks[task.index]));
        }
      });
    });
  }
}
