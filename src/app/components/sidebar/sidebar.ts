import { Component, inject, computed } from '@angular/core';
import { Store } from '@ngxs/store';
import { MenuItem } from 'primeng/api';
import { MenuModule } from 'primeng/menu';
import { StateUtils } from '../../providers/utils/state';
import { OrganizationsState } from '../../store/organizations/organizations.state';
import { ProjectsState } from '../../store/projects/projects.state';
import { TasksState } from '../../store/tasks/tasks.state';

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
  organizations = this.store.selectSignal(OrganizationsState.getState);
  projects = this.store.selectSignal(ProjectsState.getState);
  task = this.store.selectSignal(TasksState.getState);

  private _index = 0;
  get index() {
    return this._index++ - 1;
  }
  menuItems = computed(() => {
    const { organization, organizations } = this.organizations();
    const { project, projects } = this.projects();
    const { task, tasks } = this.task();
    
    const menuItems: MenuItem[] = [];
    if (!!organization) {
      menuItems.splice(0, 0, {
        separator: true
      });
      // Submenu for organization
      const orgItems: MenuItem[] = [];
        orgItems.push({
          label: `Projects (${projects.length})`,
          icon: 'pi pi-briefcase',
          ...projects.length > 1 ? {
            routerLink: ['organization', organization._id],
          } : {
            // TODO: Why is tooltip not showing when there is only one project?
            tooltip: "This is available with more projects.",
            disabled: true
          } 
        });
        orgItems.push({
          label: "Create New Project",
          icon: 'pi pi-briefcase'
        });
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
            label: `Tasks (${tasks.length})`,
            icon: 'pi pi-list-check',
            routerLink: ['project', project._id]
          }, {
            label: "Add Task",
            icon: 'pi pi-plus-circle',
            routerLink: ['project', 'add-task']
          }, {
            label: "Edit Project",
            icon: 'pi pi-pen-to-square',
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
                label: "Edit Task",
                icon: 'pi pi-pencil',
                routerLink: ['task', task._id, 'settings']
              }],
          });
        }
      } 
    }
    menuItems.splice(6, 0, {
      separator: true
    });
    const orgsItems: MenuItem[] = [];
      orgsItems.push({
        label: `Organizations (${organizations.length})`,
        icon: 'pi pi-building',
        ...organizations.length > 1 ? {
          routerLink: ['organizations'],
        } : {
          // TODO: Why is tooltip not showing when there is only one organization?
          tooltip: "This is available with more organizations.",
          disabled: true
        },
        
      });
      orgsItems.push({
        label: "Create Organization",
        icon: 'pi pi-building'
      });
    // Add Organization with submenu
    menuItems.splice(7, 0, {
      label: "Account",
      items: orgsItems
    });
    return menuItems;
  });
}
