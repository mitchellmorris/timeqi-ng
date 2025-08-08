import { Component, inject, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngxs/store';
import { SetTask } from '../../../store/tasks/tasks.actions';

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
  loading: boolean = true;
  constructor(public router: Router) {
    const userId = localStorage.getItem('user_id');
    if (userId && this.taskId) {
      this.store.dispatch(new SetTask(this.taskId));
    } else {
      console.warn(userId ? 'No user ID found in local storage.' : 'No task ID found in route parameters.');
    }
  }
  ngOnDestroy() {
    this.store.dispatch(new SetTask(null)); // Clear task state on component destruction
  }
}
