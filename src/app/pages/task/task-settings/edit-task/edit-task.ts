import { Component, effect, inject, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngxs/store';
import { SetTask } from '../../../../store/tasks/tasks.actions';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { TasksState } from '../../../../store/tasks/tasks.state';
import { PartialUser, Task } from '@betavc/timeqi-sh';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { FluidModule } from 'primeng/fluid';
import { ButtonModule } from 'primeng/button';
import { StateUtils } from '../../../../providers/utils/state';
import { filter, map } from 'rxjs';
import { SelectButtonModule } from 'primeng/selectbutton';
import { DatePipe } from '@angular/common';
import { InputNumberModule } from 'primeng/inputnumber';
import { UserState } from '../../../../store/user/user.state';
import { SelectModule } from 'primeng/select';

@Component({
  selector: 'app-edit-task',
  imports: [
    ReactiveFormsModule,
    InputTextModule,
    FluidModule,
    ButtonModule,
    SelectButtonModule,
    DatePipe,
    InputNumberModule,
    SelectModule
  ],
  templateUrl: './edit-task.html',
  styleUrl: './edit-task.css'
})
export class EditTask {
  readonly store = inject(Store);
  readonly route = inject(ActivatedRoute);
  readonly fb = inject(FormBuilder);
  readonly stateUtils = inject(StateUtils);
  taskId = this.route.snapshot.paramMap.get('taskId');
  task$ = this.stateUtils.getState$(TasksState.getState, 'task');
  task = toSignal(this.task$, { initialValue: null });
  users$ = this.stateUtils.getState$(UserState.getState, 'users').pipe(
    map(users => users.map((user: PartialUser) => ({ label: user.name, value: user._id }))),
  );
  users = toSignal(this.users$, { initialValue: [] });
  modeOptions = [
    { label: 'Snap', value: false },
    { label: 'Lock', value: true }
  ];
  form: FormGroup = this.fb.group({
      name: ['', Validators.required],
      startDate: [null],
      endDate: [null],
      locked: [false],
      estimate: [0],
      assignee: ['']
  });
  constructor(public router: Router) {
    effect(() => {
      if (this.task()) {
        this.form.patchValue(this.task());
      }
    });
  }
  onSubmit() {
    if (this.form.valid) {
      const updatedTask: Task = {
        ...this.task,
        ...this.form.value
      };
      console.log('Updated Task:', updatedTask);
      // Dispatch an action to update the task in the store
      // this.store.dispatch(new SetTask(updatedTask.id)).subscribe(() => {
      //   this.router.navigate(['../'], { relativeTo: this.route });
      // });
    }
  }
}
