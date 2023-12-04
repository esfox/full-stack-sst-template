import { Route } from '@angular/router';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { UsersComponent } from './pages/users/users.component';

type RouteData = { data?: { label?: string; icon?: string } };

export const routes: (Omit<Route, 'data'> & RouteData)[] = [
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
];
