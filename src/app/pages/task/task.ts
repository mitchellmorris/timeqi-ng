import { Component, effect, inject, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Store } from '@ngxs/store';
import { ButtonModule } from 'primeng/button';
import { SetTask } from '../../store/tasks/tasks.actions';
import { PartialEntry } from '@betavc/timeqi-sh';
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
  templateUrl: './task.html',
  styleUrl: './task.css'
})
export class Task implements OnDestroy {
  readonly store = inject(Store);
  readonly route = inject(ActivatedRoute);
  readonly stateUtils = inject(StateUtils);
  readonly routerUtils = inject(RouterUtils);
  taskId = this.route.snapshot.paramMap.get('taskId');
  // entries: PartialEntry[] = [];
  entries$ = this.stateUtils.getState$(EntriesState.getState, 'entries');
  entries = toSignal(this.entries$, { initialValue: [] as PartialEntry[] });
  loading: boolean = true;
  tabs = [
      { route: "../task", label: 'Review', icon: 'pi pi-eye' },
      { route: "edit", label: 'Edit', icon: 'pi pi-pen-to-square' },
      { route: "scheduling", label: 'Scheduling', icon: 'pi pi-calendar' },
  ];
  tab$ = this.routerUtils.getTabIndexByUrlByLastSegment$(this.tabs);
  tab = toSignal(this.tab$, {initialValue: 0});
  constructor(public router: Router) {
    effect(() => {
      if (this.entries().length > 0) {
        this.loading = false;
      }
    });
    this.route.data.subscribe(data => {
      console.log(data);
    });
    const userId = localStorage.getItem('user_id');
    if (!!userId && !!this.taskId) {
      console.warn(userId ? 'No user ID found in local storage.' : 'No task ID found in route parameters.');
    }
  }
  ngOnDestroy() {
    this.store.dispatch(new SetTask(null)); // Clear task state on component destruction
  }
}

