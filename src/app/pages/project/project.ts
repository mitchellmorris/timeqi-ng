import { Component, inject } from '@angular/core';
import { Store } from '@ngxs/store';
import { TasksState } from '../../store/tasks/tasks.state';
import { filter, map, Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { SetProject } from '../../store/projects/projects.actions';
import { Task } from '../../schemas/task';
import { has } from 'ramda';

@Component({
  selector: 'app-project',
  imports: [],
  templateUrl: './project.html',
  styleUrl: './project.css'
})
export class Project {
  readonly store = inject(Store);
  tasks: Partial<Task>[] = [];
  tasks$ = this.store.select(TasksState.getState).pipe(
    filter(state => has('tasks', state)),
    map(({ tasks }) => tasks),
  );
  tasksSubscription!: Subscription;
  loading: boolean = true;

  constructor(
    private route: ActivatedRoute,
  ) {
    const userId = localStorage.getItem('user_id');
    const projectId = this.route.snapshot.paramMap.get('id');
    if (userId && projectId) {
      this.store.dispatch(new SetProject(projectId));
      this.tasksSubscription = this.tasks$.subscribe((tasks) => {
        if (tasks.length > 0) {
          this.loading = false;
          this.tasks = tasks;
        }
      });
    } else {
      console.warn(userId ? 'No user ID found in local storage.' : 'No project ID found in route parameters.');
    }
  }}
