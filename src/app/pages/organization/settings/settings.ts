import { Component, inject, DestroyRef } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { TabsModule } from 'primeng/tabs';
import { getTabIndexByUrlByLastSegment$ } from '../../../providers/utils/routerUtils';

@Component({
  selector: 'app-settings',
  imports: [
    RouterModule,
    TabsModule
  ],
  templateUrl: './settings.html',
  styleUrl: './settings.css'
})
export class Settings {
  readonly route = inject(ActivatedRoute);
  tabs = [
      { route: "../settings", label: 'General', icon: 'pi pi-cog' },
      { route: "scheduling", label: 'Scheduling', icon: 'pi pi-calendar' },
  ];
  tab = 0;

  constructor(
    private router: Router,
    private destroyRef: DestroyRef
  ) {
    getTabIndexByUrlByLastSegment$(this.router, this.tabs, this.destroyRef)
      .subscribe(index => {
        this.tab = index;
      });
  }
}
