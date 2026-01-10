import { Component, inject, Signal } from '@angular/core';
import { InstanceTask } from '@betavc/timeqi-sh';
import { Store } from '@ngxs/store';
import { TasksState } from '../../../store/tasks/tasks.state';
import { TableModule } from 'primeng/table';
import { SplitButtonModule } from 'primeng/splitbutton';
import { Router, RouterModule } from '@angular/router';
import { Dialog } from 'primeng/dialog';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-project-tasks',
  imports: [
    TableModule,
    SplitButtonModule,
    RouterModule,
    Dialog,
  ],
  templateUrl: './project-tasks.html',
  styleUrl: './project-tasks.css'
})
export class ProjectTasks {
  readonly store = inject(Store);
  readonly router = inject(Router);
  tasks: Signal<InstanceTask[]> = this.store.selectSignal(TasksState.getTasks);
  activeTaskId: string | null = null;
  taskActions: MenuItem[] = [
    {
      label: 'Edit',
      command: () => {
        this.router.navigate(['task', this.activeTaskId, 'edit']);
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
      }
    }
  ];

}
