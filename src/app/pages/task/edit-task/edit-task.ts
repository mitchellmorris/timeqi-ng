import { Component, inject, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngxs/store';
import { SetTask } from '../../../store/tasks/tasks.actions';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TasksState } from '../../../store/tasks/tasks.state';
import { Task } from '../../../schemas/task';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { FluidModule } from 'primeng/fluid';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-edit-task',
  imports: [
    ReactiveFormsModule,
    InputTextModule,
    FluidModule,
    ButtonModule
  ],
  templateUrl: './edit-task.html',
  styleUrl: './edit-task.css'
})
export class EditTask implements OnDestroy {
  readonly store = inject(Store);
  readonly route = inject(ActivatedRoute);
  readonly fb = inject(FormBuilder);
  taskId = this.route.snapshot.paramMap.get('taskId');
  task: Task | null = null;
  loading: boolean = true;
  form: FormGroup = this.fb.group({
      name: ['', Validators.required],
      // Add more fields as needed based on your Task schema
  });

  constructor(public router: Router) {
    const userId = localStorage.getItem('user_id');
    if (userId && this.taskId) {
      this.store.dispatch(new SetTask(this.taskId)).pipe(
        takeUntilDestroyed()
      ).subscribe(() => {
        // get task snapshot from store and set loading to false
        this.task = this.store.selectSnapshot(TasksState.getState).task;
        this.loading = false;
        if (this.task) {
          this.form.patchValue(this.task);
        }
      });
    } else {
      console.warn(userId ? 'No user ID found in local storage.' : 'No task ID found in route parameters.');
    }
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
  ngOnDestroy() {
    this.store.dispatch(new SetTask(null)); // Clear task state on component destruction
  }
}
