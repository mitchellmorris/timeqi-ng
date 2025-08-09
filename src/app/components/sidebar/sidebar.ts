import { Component, inject, OnInit, ChangeDetectorRef, NgZone } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { MenuItem } from 'primeng/api';
import { MenuModule } from 'primeng/menu';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { combineLatest, filter, Observable } from 'rxjs';
import { Project, ProjectsStateModel } from '../../schemas/project';
import { Organization, OrganizationsStateModel } from '../../schemas/organization';
import { OrganizationsState } from '../../store/organizations/organizations.state';
import { ProjectsState } from '../../store/projects/projects.state';
import { Organizations } from '../../store/organizations/organizations';

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
  // @Select(OrganizationsState) organizations$!: Observable<OrganizationsStateModel>;
  // @Select(ProjectsState) projects$!: Observable<ProjectsStateModel>;
  organizations$ = this.store.select(state => state.organizations).pipe(
    takeUntilDestroyed()
  );
  projects$ = this.store.select(state => state.projects).pipe(
    takeUntilDestroyed()
  );
  menuItems: MenuItem[] = [];
  constructor(private cdRef: ChangeDetectorRef) {}

  ngOnInit() {
    combineLatest([this.organizations$, this.projects$]).subscribe(([{ organization, organizations }, { project, projects }]: [OrganizationsStateModel, ProjectsStateModel]) => {
      this.menuItems = [{
        separator: true
      }];
      if (!!organization) {
        const orgItems = [];
        if (projects.length > 1) {
          orgItems.push({
            label: "Projects",
            icon: 'pi pi-folder',
            routerLink: ['organization', organization._id]
          });
        }
        // Insert menuItem at index 1
        this.menuItems.push({
            label: organization.name,
            items: orgItems
        });
      }
      this.menuItems.push({
        separator: true
      });
      if (!!project) {
          this.menuItems.push({
            label: `Project: ${project.name}`,
            items: [{
              label: "Tasks",
              icon: 'pi pi-list',
              routerLink: ['project', project._id]
            }, {
              label: "Time Off",
              icon: 'pi pi-calendar',
              routerLink: ['project', project._id, 'time-off']
            }],
          });
      }
    });
  }
}
