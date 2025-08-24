import { Routes } from '@angular/router';
import { Login } from './pages/login/login';
import { Organizations } from './pages/organizations/organizations';
import { Organization } from './pages/organization/organization';
import { Project } from './pages/project/project';
import { authGuard } from './providers/auth/auth-guard';
import { Task } from './pages/task/task';
import { EditTask } from './pages/task/edit-task/edit-task';
import { Scheduling } from './pages/project/project-settings/project-scheduling/project-scheduling';
import { projectResolver } from './pages/project/projectResolvers';
import { taskResolver } from './pages/task/taskResolver'
import { Settings as ProjectSettings } from './pages/project/project-settings/project-settings';
import { General as ProjectGeneralSettings } from './pages/project/project-settings/edit-project/edit-project';
import { Settings as OrganizationSettings } from './pages/organization/organization-settings/organization-settings';
import { organizationResolver } from './pages/organization/organizationResolvers';
import { General as OrgGeneralSettings } from './pages/organization/organization-settings/edit-organization/edit-organization';
import { Scheduling as OrgScheduling } from './pages/organization/organization-settings/organization-scheduling/organization-scheduling';
import { ReviewTask } from './pages/task/review-task/review-task';

export const routes: Routes = [
  {
    path: '',
    component: Organizations,
    canActivate: [authGuard]
  },
  {
    path: 'login',
    component: Login,
    data: { showSidebar: false }
  },
  {
    path: 'organization/:organizationId',
    component: Organization,
    canActivate: [authGuard],
    resolve: {
      organizationState: organizationResolver
    },
  },
  {
    path: 'organization/:organizationId/settings',
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
    path: 'project/:projectId',
    component: Project,
    canActivate: [authGuard],
    resolve: {
      projectsState: projectResolver
    }
  },
  {
    path: 'project/:projectId/settings',
    component: ProjectSettings,
    canActivate: [authGuard],
    resolve: {
      projectsState: projectResolver
    },
    children: [{
        path: '',
        component: ProjectGeneralSettings
      },{
        path: 'scheduling',
        component: Scheduling
      }]
  },
  {
    path: 'task/:taskId',
    component: Task,
    canActivate: [authGuard],
    resolve: {
      taskState: taskResolver
    },
    children: [{
        path: '',
        component: ReviewTask,
      }, {
        path: 'edit',
        component: EditTask
      }]
  }
];
