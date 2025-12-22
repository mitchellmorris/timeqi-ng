import { Component, inject, Signal } from '@angular/core';
import { TasksState } from '../../store/tasks/tasks.state';
import { filter } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { TableModule } from 'primeng/table';
import { SplitButtonModule } from 'primeng/splitbutton';
import { MenuItem } from 'primeng/api';
import { RouterModule } from '@angular/router';
import { Dialog } from 'primeng/dialog';
import { toSignal } from '@angular/core/rxjs-interop';
import { StateUtils } from '../../providers/utils/state';
import { Store } from '@ngxs/store';
import { InstanceTask, Task } from '@betavc/timeqi-sh';
import { Projection } from '../../providers/projection/projection';

@Component({
  selector: 'app-project',
  imports: [
    TableModule,
    SplitButtonModule,
    RouterModule,
    Dialog,
  ],
  providers: [
    StateUtils
  ],
  templateUrl: './project.html',
  styleUrl: './project.css'
})
export class Project {
  readonly store = inject(Store);
  readonly route = inject(ActivatedRoute);
  readonly router = inject(Router);
  readonly stateUtils = inject(StateUtils);
  projectId = this.route.snapshot.paramMap.get('projectId');
  activeTaskId: string | null = null;
  // projection$ = this.stateUtils.getState$(ProjectsState.getProjectProjection, 'project');
  // projection = toSignal(this.projection$, { initialValue: [] });
  tasks: Signal<InstanceTask[]> = this.store.selectSignal(TasksState.getTasks);
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
  
  constructor(
    readonly projection: Projection
  ) {}
}

