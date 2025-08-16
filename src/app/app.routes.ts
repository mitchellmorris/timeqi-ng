import { Routes } from '@angular/router';
import { Login } from './pages/login/login';
import { Organizations } from './pages/organizations/organizations';
import { Organization } from './pages/organization/organization';
import { Project } from './pages/project/project';
import { authGuard } from './providers/auth/auth-guard';
import { Task } from './pages/task/task';
import { EditTask } from './pages/task/edit-task/edit-task';
import { TimeOff } from './pages/project/settings/time-off/time-off';
import { projectResolver } from './pages/project/projectResolvers';
import { Settings as ProjectSettings } from './pages/project/settings/settings';
import { General as ProjectGeneralSetting } from './pages/project/settings/general/general';
import { Settings as OrganizationSettings } from './pages/organization/settings/settings';
import { organizationResolver } from './pages/organization/organizationResolvers';
import { General as OrgGeneralSettings } from './pages/organization/settings/general/general';
import { Scheduling as OrgScheduling } from './pages/organization/settings/scheduling/scheduling';

export const routes: Routes = [
  {
    path: 'login',
    component: Login,
    data: { showSidebar: false }
  },
  {
    path: '',
    component: Organizations,
    canActivate: [authGuard]
  },
  {
    path: 'organization/:id',
    component: Organization,
    canActivate: [authGuard],
    resolve: {
      organizationState: organizationResolver
    },
  },
  {
    path: 'organization/:id/settings',
    component: OrganizationSettings,
    canActivate: [authGuard],
    resolve: {
      organizationState: organizationResolver
    },
    children: [{
      path: '',
      component: OrgGeneralSettings
    },{
      path: 'scheduling',
      component: OrgScheduling
    }],
  },
  {
    path: 'project/:id',
    component: Project,
    canActivate: [authGuard],
    resolve: {
      projectsState: projectResolver
    },
    children: [{
      path: 'review/:taskId',
      component: Task
    },{
      path: 'edit/:taskId',
      component: EditTask
    }]
  },
  {
    path: 'project/:id/settings',
    component: ProjectSettings,
    canActivate: [authGuard],
    resolve: {
      projectsState: projectResolver
    },
    children: [{
      path: '',
      component: ProjectGeneralSetting
    },{
      path: 'time-off',
      component: TimeOff
    }]
  }
];
