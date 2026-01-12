import { Component, inject, } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Projection } from '../../providers/projection/projection';
import { TabsModule } from 'primeng/tabs';
import { Store } from '@ngxs/store';
import { RouterUtils } from '../../providers/utils/routerUtils';
import { toSignal } from '@angular/core/rxjs-interop';
import { ProjectLens } from '../../components/project-lens/project-lens';

@Component({
  selector: 'app-project',
  imports: [
    RouterModule,
    TabsModule,
    ProjectLens,
  ],
  templateUrl: './project.html',
  styleUrl: './project.css'
})
export class Project {
  readonly store = inject(Store);
  readonly route = inject(ActivatedRoute);
  readonly routerUtils = inject(RouterUtils);
  taskId = this.route.snapshot.paramMap.get('taskId');
  tabs = [
      { route: "./", label: 'Tasks', icon: 'pi pi-eye' },
      { route: "edit", label: 'Edit', icon: 'pi pi-pencil' },
      { route: "scheduling", label: 'Scheduling', icon: 'pi pi-calendar' },
      { route: "add-task", label: 'Add Task', icon: 'pi pi-plus' },
  ];
  tab$ = this.routerUtils.getTabIndexByUrlByLastSegment$(this.tabs);
  tab = toSignal(this.tab$, {initialValue: 0});
  constructor(
    readonly projection: Projection
  ) {}
}

