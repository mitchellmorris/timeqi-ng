import { Routes } from '@angular/router';
import { Login } from './pages/login/login';
import { Organizations } from './pages/organizations/organizations';
import { Organization } from './pages/organization/organization';
import { Project } from './pages/project/project';
import { authGuard } from './providers/auth/auth-guard';
import { Task } from './pages/task/task';

export const routes: Routes = [
  {
    path: 'login',
    component: Login,
  },
  {
    path: '',
    component: Organizations,
    canActivate: [authGuard]
  },
  {
    path: 'organization/:id',
    component: Organization,
    canActivate: [authGuard]
  },
  {
    path: 'project/:id',
    component: Project,
    canActivate: [authGuard],
    children: [{
      path: 'review/:taskId',
      component: Task,
      canActivate: [authGuard]
    }]
  }
];
