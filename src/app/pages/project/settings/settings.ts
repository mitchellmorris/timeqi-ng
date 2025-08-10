import { Component, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, NavigationEnd, Router, RouterModule } from '@angular/router';
import { TabsModule } from 'primeng/tabs';
import { filter, map } from 'rxjs';

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
      { route: "time-off", label: 'Time Off', icon: 'pi pi-calendar' },
  ];
  tab = 0;

  constructor(private router: Router) {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      map((event: NavigationEnd) => event.url),
      takeUntilDestroyed(),
    )
    .subscribe(url => {
      const lastSegment = url.split('?')[0].split('/').pop() || null;
      const tabs = ['settings', 'time-off'];
      this.tab = tabs.indexOf(lastSegment ?? '') !== -1 ? tabs.indexOf(lastSegment ?? '') : 0;
    });
  }
}
