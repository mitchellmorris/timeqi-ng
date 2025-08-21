import { Component, inject } from '@angular/core';
import { Store } from '@ngxs/store';
import { TasksState } from '../../store/tasks/tasks.state';
import { filter, map } from 'rxjs';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { PartialTask, Task } from '@betavc/timeqi-sh';
import { has } from 'ramda';
import { TableModule } from 'primeng/table';
import { SplitButtonModule } from 'primeng/splitbutton';
import { MenuItem } from 'primeng/api';
import { RouterModule } from '@angular/router';
import { Dialog } from 'primeng/dialog';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-project',
  imports: [
    TableModule,
    SplitButtonModule,
    RouterModule,
    Dialog,
  ],
  templateUrl: './project.html',
  styleUrl: './project.css'
})
export class Project {
  readonly store = inject(Store);
  readonly route = inject(ActivatedRoute);
  projectId = this.route.snapshot.paramMap.get('id');
  activeTaskId: string | null = null;
  activeTaskLabel: string = '';
  isTaskOpen: boolean = false;
  tasks: PartialTask[] = [];
  tasks$ = this.store.select(TasksState.getState).pipe(
    filter(state => has('tasks', state)),
    map(({ tasks }) => tasks),
    takeUntilDestroyed()
  );
  loading: boolean = true;
  taskActions: MenuItem[] = [
    {
      label: 'Edit',
      command: () => {
        this.router.navigate(['project', this.projectId, 'edit', this.activeTaskId]);
      }
    },
    { separator: true },
    { label: 'Add Task Above' },
    { label: 'Add Task Below' },
    { separator: true },
    {
      label: 'Delete',
      command: () => {
        console.log('Delete command executed', this.activeTaskId);
        // this.delete();
      }
    }
  ];

  constructor(public router: Router) {
    const userId = localStorage.getItem('user_id');
    if (userId && this.projectId) {
      this.tasks$.subscribe((tasks) => {
        if (tasks.length > 0) {
          this.loading = false;
          this.tasks = tasks;
        }
      });
    } else {
      console.warn(userId ? 'No user ID found in local storage.' : 'No project ID found in route parameters.');
    }
    // Reset activeTaskId on navigation
    this.router.events.pipe(takeUntilDestroyed()).subscribe(event => {
      if (event instanceof NavigationEnd) {
        const urlSegments = event.urlAfterRedirects.split('/');
        // Example: ['', 'project', '123', 'review', '456']
        this.activeTaskId = urlSegments[4];
        this.isTaskOpen = true;
        switch (event.urlAfterRedirects) {
          case `/project/${this.projectId}/review/${urlSegments[4]}`:
            this.activeTaskLabel = "Review Task";
            break;
          case `/project/${this.projectId}/edit/${urlSegments[4]}`:
            this.activeTaskLabel = "Edit Task";
            break;
          default:
            this.activeTaskLabel = "";
            this.activeTaskId = null;
            this.isTaskOpen = false;
            break;
        }
      }
    });
  }
}

