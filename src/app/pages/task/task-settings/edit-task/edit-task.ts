import { Component, effect, inject, Signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngxs/store';
import { SetTask, UpdateTask } from '../../../../store/tasks/tasks.actions';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { TasksState } from '../../../../store/tasks/tasks.state';
import { Task, PrimeNG, Project } from '@betavc/timeqi-sh';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { FluidModule } from 'primeng/fluid';
import { TaskForm } from '../../../../components/task-form/task-form';
import { ButtonModule } from 'primeng/button';
import { catchError, startWith, debounceTime, distinctUntilChanged } from 'rxjs';
import { SelectButtonModule } from 'primeng/selectbutton';
import { DatePipe } from '@angular/common';
import { InputNumberModule } from 'primeng/inputnumber';
import { UserState } from '../../../../store/user/user.state';
import { SelectModule } from 'primeng/select';
import { DatePickerModule } from 'primeng/datepicker';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../environments/environment';
import { of } from 'rxjs';
import { Projection } from '../../../../providers/projection/projection';
import { ProjectsState } from '../../../../store/projects/projects.state';

@Component({
  selector: 'app-edit-task',
  imports: [
    ButtonModule,
    TaskForm,
    DatePipe,
  ],
  templateUrl: './edit-task.html',
  styleUrl: './edit-task.css'
})
export class EditTask {
  readonly store = inject(Store);
  readonly route = inject(ActivatedRoute);
  id = this.route.snapshot.params['taskId'];
  task: Signal<Task | null> = this.store.selectSignal(TasksState.getTask);
  projectProjection: Signal<Project | null> = this.store.selectSignal(ProjectsState.getProjection);
  taskProjection: Signal<Task | null> = this.store.selectSignal(TasksState.getProjection);

  constructor(
    readonly http: HttpClient,
    readonly projection: Projection,
    router: Router
  ) {}

  onChanges(formData: Partial<Task>) {
    this.projection.taskModel.set(formData);
  }

  onSubmit(formData: Partial<Task>) {
    this.store.dispatch(new UpdateTask(
      this.id,
      {
        ...(this.taskProjection() || {}),
        ...formData
      },
    ));
  }
}
