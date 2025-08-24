import { Component, inject, computed } from '@angular/core';
import { Store } from '@ngxs/store';
import { MenuItem } from 'primeng/api';
import { MenuModule } from 'primeng/menu';
import { toSignal } from '@angular/core/rxjs-interop';
import { combineLatest } from 'rxjs';
import { ProjectsStateModel, OrganizationsStateModel, TasksStateModel } from '@betavc/timeqi-sh';
import { StateUtils } from '../../providers/utils/state';

@Component({
  selector: 'app-sidebar',
  imports: [
    MenuModule
  ],
  providers: [
    StateUtils
  ],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css'
})
export class Sidebar {
  readonly store = inject(Store);
  readonly stateUtils = inject(StateUtils);
  organizations$ = this.stateUtils.getState$(state => state.organizations);
  projects$ = this.stateUtils.getState$(state => state.projects);
  tasks$ = this.stateUtils.getState$(state => state.tasks);
  states$ = combineLatest([
    this.organizations$, 
    this.projects$,
    this.tasks$
  ]);
  states = toSignal(this.states$, { initialValue: null });
  menuItems = computed(() => {
    const [
      { organization, organizations }, 
      { project, projects },
      { task, tasks }
    ] = this.states() as [OrganizationsStateModel, ProjectsStateModel, TasksStateModel];
    if (!this.states()) {
      return [];
    }
    const menuItems: MenuItem[] = [];
    if (!!organization) {
      menuItems.splice(0, 0, {
        separator: true
      });
      // Submenu for organization
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
      // Add Organization with submenu
      menuItems.splice(1, 0, {
        label: organization.name,
        items: orgItems
      });
      if (!!project) {
        menuItems.splice(2, 0, {
          separator: true
        });
        menuItems.splice(3, 0, {
          label: `Project: ${project.name}`,
          items: [{
            label: "Tasks",
            icon: 'pi pi-list-check',
            routerLink: ['project', project._id]
          }, {
            label: "Settings",
            icon: 'pi pi-cog',
            routerLink: ['project', project._id, 'settings']
          }],
        });
        if (!!task) {
          menuItems.splice(4, 0, {
            separator: true
          });
          menuItems.splice(5, 0, {
            label: `Task: ${task.name}`,
            items: [{
                label: "Entries",
                icon: 'pi pi-list',
                routerLink: ['task', task._id]
              }, {
                label: "Settings",
                icon: 'pi pi-cog',
                routerLink: ['task', task._id, 'settings']
              }],
          });
        }
      } 
    }
    return menuItems;
  });
}
