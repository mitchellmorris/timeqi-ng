import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TabsModule } from 'primeng/tabs';
import { RouterUtils } from '../../../providers/utils/routerUtils';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-organization-settings',
  imports: [
    RouterModule,
    TabsModule
  ],
  providers: [
    RouterUtils
  ],
  templateUrl: './organization-settings.html',
  styleUrl: './organization-settings.css'
})
export class OrganizationSettings {
  readonly routerUtils = inject(RouterUtils);
  tabs = [
      { route: "../settings", label: 'General', icon: 'pi pi-cog' },
      { route: "scheduling", label: 'Scheduling', icon: 'pi pi-calendar' },
  ];
  tab$ = this.routerUtils.getTabIndexByUrlByLastSegment$(this.tabs);
  tab = toSignal(this.tab$, {initialValue: 0});
}

