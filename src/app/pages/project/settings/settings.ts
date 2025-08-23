import { Component, inject, DestroyRef } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { TabsModule } from 'primeng/tabs';
import { RouterUtils } from '../../../providers/utils/routerUtils';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-settings',
  imports: [
    RouterModule,
    TabsModule,
  ],
  providers: [
    RouterUtils
  ],
  templateUrl: './settings.html',
  styleUrl: './settings.css'
})
export class Settings {
  readonly routerUtils = inject(RouterUtils);
  tabs = [
      { route: "../settings", label: 'General', icon: 'pi pi-cog' },
      { route: "scheduling", label: 'Scheduling', icon: 'pi pi-calendar' },
  ];
  tab$ = this.routerUtils.getTabIndexByUrlByLastSegment$(this.tabs);
  tab = toSignal(this.tab$, {initialValue: 0});
}
