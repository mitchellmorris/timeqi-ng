import { Component, inject, OnDestroy } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Store } from '@ngxs/store';
import { ButtonModule } from 'primeng/button';
import { TabsModule } from 'primeng/tabs';
import { toSignal } from '@angular/core/rxjs-interop';
import { StateUtils } from '../../../providers/utils/state';
import { RouterUtils } from '../../../providers/utils/routerUtils';

@Component({
  selector: 'app-task-settings',
  imports: [
    RouterModule,
    ButtonModule,
    TabsModule,
  ],
  providers: [
    RouterUtils,
    StateUtils
  ],
  templateUrl: './task-settings.html',
  styleUrl: './task-settings.css'
})
export class TaskSettings {
  readonly store = inject(Store);
  readonly route = inject(ActivatedRoute);
  readonly routerUtils = inject(RouterUtils);
  taskId = this.route.snapshot.paramMap.get('taskId');
  tabs = [
      { route: "../settings", label: 'General', icon: 'pi pi-pen-to-square' },
      // { route: "scheduling", label: 'Scheduling', icon: 'pi pi-calendar' },
  ];
  tab$ = this.routerUtils.getTabIndexByUrlByLastSegment$(this.tabs);
  tab = toSignal(this.tab$, {initialValue: 0});
}
