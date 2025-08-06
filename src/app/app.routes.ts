import { Routes } from '@angular/router';
import { Login } from './pages/login/login';
import { Organizations } from './pages/organizations/organizations';
import { Organization } from './pages/organization/organization';
import { Project } from './pages/project/project';
import { authGuard } from './providers/auth/auth-guard';

export const routes: Routes = [
  {
    path: 'login',
    component: Login,
  },
  {
    path: 'organizations',
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
    canActivate: [authGuard]
  }
];
