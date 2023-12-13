import { Route } from '@angular/router';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { RolesComponent } from './pages/roles/roles.component';
import { UsersComponent } from './pages/users/users.component';
import { LoginComponent } from './pages/login/login.component';

type RouteData = { data?: { label?: string; icon?: string } };

export const routes: (Omit<Route, 'data'> & RouteData)[] = [
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: '',
    component: DashboardComponent,
    data: {
      label: 'Dashboard',
      icon: 'fa fa-gauge',
    },
  },
  {
    path: 'users',
    component: UsersComponent,
    data: {
      label: 'Users',
      icon: 'fa fa-users',
    },
  },
  {
    path: 'roles',
    component: RolesComponent,
    data: {
      label: 'Roles',
      icon: 'fa fa-user-gear',
    },
  },
];
