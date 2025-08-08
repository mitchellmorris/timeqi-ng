import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Store } from '@ngxs/store';
import { ButtonModule } from 'primeng/button';
import { SetTask } from '../../store/tasks/tasks.actions';
import { Entry } from '../../schemas/entry';
import { EntriesState } from '../../store/entries/entries.state';
import { filter, map, Subscription } from 'rxjs';
import { has } from 'ramda';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';


@Component({
  selector: 'app-task',
  imports: [
    RouterModule,
    ButtonModule,
  ],
  templateUrl: './task.html',
  styleUrl: './task.css'
})
export class Task {
  readonly store = inject(Store);
  readonly route = inject(ActivatedRoute);
  taskId = this.route.snapshot.paramMap.get('taskId');
  entries: Partial<Entry>[] = [];
  entries$ = this.store.select(EntriesState.getState).pipe(
    filter(state => has('entries', state)),
    map(({ entries }) => entries),
    takeUntilDestroyed()
  );
  entriesSubscription!: Subscription;
  loading: boolean = true;
  constructor(public router: Router) {
    const userId = localStorage.getItem('user_id');
    if (userId && this.taskId) {
      this.store.dispatch(new SetTask(this.taskId));
      this.entriesSubscription = this.entries$.subscribe((entries) => {
        if (entries.length > 0) {
          this.loading = false;
          this.entries = entries;
        }
      });
    } else {
      console.warn(userId ? 'No user ID found in local storage.' : 'No task ID found in route parameters.');
    }
  }
}
