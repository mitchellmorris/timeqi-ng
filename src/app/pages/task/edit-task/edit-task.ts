import { Component, inject, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngxs/store';
import { SetTask } from '../../../store/tasks/tasks.actions';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TasksState } from '../../../store/tasks/tasks.state';
import { Task } from '../../../schemas/task';

@Component({
  selector: 'app-edit-task',
  imports: [],
  templateUrl: './edit-task.html',
  styleUrl: './edit-task.css'
})
export class EditTask implements OnDestroy {
  readonly store = inject(Store);
  readonly route = inject(ActivatedRoute);
  taskId = this.route.snapshot.paramMap.get('taskId');
  task: Task | null = null;
  loading: boolean = true;
  constructor(public router: Router) {
    const userId = localStorage.getItem('user_id');
    if (userId && this.taskId) {
      this.store.dispatch(new SetTask(this.taskId)).pipe(
        takeUntilDestroyed()
      ).subscribe(() => {
        // get task snapshot from store and set loading to false
        this.task = this.store.selectSnapshot(TasksState.getState).task;
        this.loading = false;
      });
    } else {
      console.warn(userId ? 'No user ID found in local storage.' : 'No task ID found in route parameters.');
    }
  }
  ngOnDestroy() {
    this.store.dispatch(new SetTask(null)); // Clear task state on component destruction
  }
}
