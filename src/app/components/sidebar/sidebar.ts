import { Component, inject, computed } from '@angular/core';
import { Store } from '@ngxs/store';
import { MenuItem } from 'primeng/api';
import { MenuModule } from 'primeng/menu';
import { toSignal } from '@angular/core/rxjs-interop';
import { combineLatest } from 'rxjs';
import { ProjectsStateModel, OrganizationsStateModel } from '@betavc/timeqi-sh';
import { StateUtils } from '../../providers/utils/state';

@Component({
  selector: 'app-sidebar',
  imports: [
    MenuModule
  ],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css'
})
export class Sidebar {
  readonly store = inject(Store);
  readonly stateUtils = inject(StateUtils);
  organizations$ = this.stateUtils.getState$(state => state.organizations);
  projects$ = this.stateUtils.getState$(state => state.projects);
  states$ = combineLatest([
    this.organizations$, 
    this.projects$
  ]);
  states = toSignal(this.states$, { initialValue: null });
  menuItems = computed(() => {
    const [
      { organization, organizations }, 
      { project, projects }
    ] = this.states() as [OrganizationsStateModel, ProjectsStateModel];
    if (!this.states()) {
      return [];
    }
    const menuItems: MenuItem[] = [{
      separator: true
    }];
    if (!!organization) {
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
      menuItems.splice(1, 0, {
        label: organization.name,
        items: orgItems
      }, {
        separator: true
      });
      if (!!project || projects.length === 1) {
        const _project = project || projects[0];
        menuItems.splice(3, 0, {
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
    return menuItems;
  });
}
