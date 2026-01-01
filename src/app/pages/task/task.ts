import { Component, inject, OnDestroy } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Store } from '@ngxs/store';
import { ButtonModule } from 'primeng/button';
import { TabsModule } from 'primeng/tabs';
import { toSignal } from '@angular/core/rxjs-interop';
import { StateUtils } from '../../providers/utils/state';
import { RouterUtils } from '../../providers/utils/routerUtils';
import { ProjectLens } from '../../components/project-lens/project-lens';

@Component({
  selector: 'app-task',
  imports: [
    RouterModule,
    ButtonModule,
    TabsModule,
    ProjectLens,
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
  readonly routerUtils = inject(RouterUtils);
  taskId = this.route.snapshot.paramMap.get('taskId');
  tabs = [
      { route: "./", label: 'Review', icon: 'pi pi-eye' },
      { route: "edit", label: 'Edit', icon: 'pi pi-pencil' },
      { route: "scheduling", label: 'Scheduling', icon: 'pi pi-calendar' },
  ];
  tab$ = this.routerUtils.getTabIndexByUrlByLastSegment$(this.tabs);
  tab = toSignal(this.tab$, {initialValue: 0});
}
