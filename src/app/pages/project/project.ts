import { Component, inject } from '@angular/core';
import { Store } from '@ngxs/store';
import { TasksState } from '../../store/tasks/tasks.state';
import { filter, map, Subscription } from 'rxjs';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { SetProject } from '../../store/projects/projects.actions';
import { Task } from '../../schemas/task';
import { has } from 'ramda';
import { TableModule } from 'primeng/table';
import { SplitButtonModule } from 'primeng/splitbutton';
import { MenuItem } from 'primeng/api';
import { RouterModule } from '@angular/router';
import { Dialog } from 'primeng/dialog';

@Component({
  selector: 'app-project',
  imports: [
    TableModule,
    SplitButtonModule,
    RouterModule
  ],
  templateUrl: './project.html',
  styleUrl: './project.css'
})
export class Project {
  readonly store = inject(Store);
  readonly route = inject(ActivatedRoute);
  projectId = this.route.snapshot.paramMap.get('id');
  actedUponTaskId: string | null = null;
  tasks: Partial<Task>[] = [];
  tasks$ = this.store.select(TasksState.getState).pipe(
    filter(state => has('tasks', state)),
    map(({ tasks }) => tasks),
  );
  tasksSubscription!: Subscription;
  loading: boolean = true;
  taskActions: MenuItem[] = [
    {
      label: 'Edit',
      command: () => {
        console.log('Edit command executed', this.actedUponTaskId);
        // this.edit();
      }
    },
    {
      label: 'Delete',
      command: () => {
        console.log('Delete command executed', this.actedUponTaskId);
        // this.delete();
      }
    }
  ];

  constructor(private router: Router) {
    const userId = localStorage.getItem('user_id');
    if (userId && this.projectId) {
      this.store.dispatch(new SetProject(this.projectId));
      this.tasksSubscription = this.tasks$.subscribe((tasks) => {
        if (tasks.length > 0) {
          this.loading = false;
          this.tasks = tasks;
        }
      });
    } else {
      console.warn(userId ? 'No user ID found in local storage.' : 'No project ID found in route parameters.');
    }
    // Reset actedUponTaskId on navigation
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        // Adjust this path to match your route structure
        if (event.urlAfterRedirects === `/project/${this.projectId}`) {
          this.actedUponTaskId = null;
        }
      }
    });
  }

  reviewTask(taskId: string) {
    this.router.navigate(['project', this.projectId, 'review', taskId]);
  }
}
