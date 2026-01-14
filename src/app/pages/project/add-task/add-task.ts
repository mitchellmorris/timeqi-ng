import { Component, inject, OnDestroy, OnInit, signal, Signal } from '@angular/core';
import { Store } from '@ngxs/store';
import { CleanNewTask, CreateTask, SetNewTask, UpdateTask } from '../../../store/tasks/tasks.actions';
import { TasksState } from '../../../store/tasks/tasks.state';
import { hasDifferences, Task, TASK_PROJECTION_SCALAR_FIELDS, Project, TASK_PROJECTION_RELATIONAL_FIELDS } from '@betavc/timeqi-sh';
import { TaskForm } from '../../../components/task-form/task-form';
import { ButtonModule } from 'primeng/button';
import { DatePipe } from '@angular/common';
import { Projection } from '../../../providers/projection/projection';
import { ProjectLens } from '../../../components/project-lens/project-lens';
import { omit, pick } from 'ramda';
import { ProjectsState } from '../../../store/projects/projects.state';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-task',
  imports: [
    ButtonModule,
    TaskForm,
    DatePipe,
    ProjectLens
  ],
  templateUrl: './add-task.html',
  styleUrl: './add-task.css'
})
export class AddTask implements OnInit, OnDestroy {
  readonly store = inject(Store);
  readonly router = inject(Router);
  taskProject: Signal<Project | null> = this.store.selectSignal(ProjectsState.getProject) as Signal<Project | null>;
  tasks: Signal<Task[]> = this.store.selectSignal(TasksState.getTasks);
  task: Signal<Task | null> = this.store.selectSignal(TasksState.getTask);
  taskProjection: Signal<Task | null> = this.store.selectSignal(TasksState.getProjection);

  constructor(
    readonly projection: Projection
  ) {}

  ngOnInit() {
    // Initialize the projection service task model
    this.store.dispatch(new SetNewTask({
      _id: 'new-task-temp-id',
      name: '',
      project: this.taskProject()?._id, 
      organization: this.taskProject()?.organization,
      index: this.tasks().length,
      description: '',
      startDate: undefined,
      endDate: null,
      locked: false,
      estimate: 0,
      assignee: '',
      weekdays: this.taskProject()?.weekdays || [],
      endOfDayHour: this.taskProject()?.endOfDayHour,
      endOfDayMin: this.taskProject()?.endOfDayMin,
      workshift: this.taskProject()?.workshift,
      timezone: this.taskProject()?.timezone,
    }));
  }

  ngOnDestroy() {
    // Clear out the projection service task model
    this.cleanup();
  }

  // Called by the route guard as a safety net and also used for explicit destroy
  cleanup() {
    // if we haven't saved the new task, clean it up
    if (this.task()?._id.startsWith('new-task-')) {
      this.store.dispatch(new CleanNewTask());
    }
  }

  // Hook for the PendingChangesGuard; return false to block navigation if needed
  canDeactivate(): boolean {
    return true;
  }

  onChanges(formData: Partial<Task>) {
    this.projection.taskModel.set({ ...this.task(), ...formData });
  }

  onSubmit(formData: Partial<Task>) {
    this.store.dispatch(new CreateTask(omit(['_id'], {
      ...(this.taskProjection() || {}),
      ...formData
    }))).subscribe(() => {
      const taskId = this.store.selectSnapshot(TasksState.getTask)?._id;
      this.router.navigate(['/task', taskId]);
    });
  }
}
