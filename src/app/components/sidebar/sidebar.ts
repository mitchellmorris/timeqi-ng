import { Component, inject, OnInit, ChangeDetectorRef, NgZone } from '@angular/core';
import { Store } from '@ngxs/store';
import { MenuItem } from 'primeng/api';
import { MenuModule } from 'primeng/menu';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { combineLatest, filter } from 'rxjs';
import { ProjectsStateModel, OrganizationsStateModel } from '@betavc/timeqi-sh';

@Component({
  selector: 'app-sidebar',
  imports: [
    MenuModule
  ],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css'
})
export class Sidebar implements OnInit {
  readonly store = inject(Store);
  readonly zone = inject(NgZone);
  private organizationId: string | null = null;
  organizations$ = this.store.select(state => state.organizations).pipe(
    filter(({ organization }) => !!organization && organization._id !== this.organizationId),
    takeUntilDestroyed()
  );
  projects$ = this.store.select(state => state.projects).pipe(
    takeUntilDestroyed()
  );
  menuItems: MenuItem[] = [];
  constructor(private cdRef: ChangeDetectorRef) {}

  ngOnInit() {
    combineLatest([this.organizations$, this.projects$])
      .subscribe(([{ organization, organizations }, { project, projects }]: [OrganizationsStateModel, ProjectsStateModel]) => {
        // Redefine to register with zone
        this.menuItems = [{
          separator: true
        }];
        if (!!organization) {
          this.organizationId = organization._id;
          const orgItems: MenuItem[] = [];
          if (projects.length > 1) {
            orgItems.push({
              label: "Projects",
              icon: 'pi pi-folder',
              routerLink: ['organization', organization._id]
            });
          }
          orgItems.push({
            label: "Settings",
            icon: 'pi pi-cog',
            routerLink: ['organization', organization._id, 'settings']
          });
          this.menuItems.splice(1, 0, {
            label: organization.name,
            items: orgItems
          }, {
            separator: true
          });
          if (!!project || projects.length === 1) {
            const _project = project || projects[0];
            this.menuItems.splice(3, 0, {
              label: `Project: ${_project.name}`,
              items: [{
                label: "Tasks",
                icon: 'pi pi-list',
                routerLink: ['project', _project._id]
              }, {
                label: "Settings",
                icon: 'pi pi-cog',
                routerLink: ['project', _project._id, 'settings']
              }],
            });
          } 
        }
      });
  }
}
