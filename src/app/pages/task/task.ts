import { Component, inject, OnDestroy } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Store } from '@ngxs/store';
import { ButtonModule } from 'primeng/button';
import { SetTask } from '../../store/tasks/tasks.actions';
import { InstanceEntry } from '@betavc/timeqi-sh';
import { TabsModule } from 'primeng/tabs';
import { EntriesState } from '../../store/entries/entries.state';
import { toSignal } from '@angular/core/rxjs-interop';
import { StateUtils } from '../../providers/utils/state';
import { RouterUtils } from '../../providers/utils/routerUtils';


@Component({
  selector: 'app-task',
  imports: [
    RouterModule,
    ButtonModule,
    TabsModule,
  ],
  providers: [
    RouterUtils,
    StateUtils
  ],
  templateUrl: './task.html',
  styleUrl: './task.css'
})
export class Task {
  readonly store = inject(Store);
  readonly route = inject(ActivatedRoute);
  readonly stateUtils = inject(StateUtils);
  entries$ = this.stateUtils.getState$(EntriesState.getState, 'entries');
  entries = toSignal(this.entries$, { initialValue: [] as InstanceEntry[] });
}

