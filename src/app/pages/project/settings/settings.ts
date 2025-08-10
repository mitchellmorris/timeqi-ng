import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { TabsModule } from 'primeng/tabs';

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
  projectId = this.route.snapshot.paramMap.get('id');
  tabs = [
      { route: "", label: 'General', icon: 'pi pi-cog' },
      { route: "time-off", label: 'Time Off', icon: 'pi pi-calendar' }
  ];
}
