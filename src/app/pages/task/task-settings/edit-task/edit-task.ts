import { Component, inject, Signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngxs/store';
import { UpdateTask } from '../../../../store/tasks/tasks.actions';
import { TasksState } from '../../../../store/tasks/tasks.state';
import { Task } from '@betavc/timeqi-sh';
import { TaskForm } from '../../../../components/task-form/task-form';
import { ButtonModule } from 'primeng/button';
import { DatePipe } from '@angular/common';
import { Projection } from '../../../../providers/projection/projection';
import { ProjectLens } from '../../../../components/project-lens/project-lens';

@Component({
  selector: 'app-edit-task',
  imports: [
    ButtonModule,
    TaskForm,
    DatePipe,
    ProjectLens
  ],
  templateUrl: './edit-task.html',
  styleUrl: './edit-task.css'
})
export class EditTask {
  readonly store = inject(Store);
  // Remember that that the taskResolver should have already fetched the task
  task: Signal<Task | null> = this.store.selectSignal(TasksState.getTask);
  taskProjection: Signal<Task | null> = this.store.selectSignal(TasksState.getProjection);

  constructor(
    readonly projection: Projection
  ) {}

  onChanges(formData: Partial<Task>) {
    this.projection.taskModel.set(
      { ...this.task(), ...formData }
    );
  }

  onSubmit(formData: Partial<Task>) {
    this.store.dispatch(new UpdateTask(
      this.task()!._id,
      {
        ...(this.taskProjection() || {}),
        ...formData
      },
    ));
  }
}
