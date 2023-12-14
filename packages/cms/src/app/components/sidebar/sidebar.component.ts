import { CommonModule } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { routes } from '../../app.routes';
import { AuthService } from '../../services/auth.service';
import { UsersService } from '../../services/users.service';
import { DropdownMenuComponent, DropdownMenuItem } from '../dropdown-menu/dropdown-menu.component';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, DropdownMenuComponent],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
})
export class SidebarComponent {
  usersService = inject(UsersService);
  authService = inject(AuthService);
  router = inject(Router);

  menu = routes
    .filter(route => route.data)
    .map(route => ({
      path: `/${route.path}`,
      label: route.data?.label,
      icon: route.data?.icon,
    }));

  currentUser = this.usersService.currentUser;

  currentUserName = computed(() => {
    const user = this.currentUser();
    if (!user) {
      return '';
    }

    const { username, firstName, email } = user;
    return username ?? firstName ?? email;
  });

  currentUserPicture = computed(() => this.currentUser()?.googlePictureUrl);

  currentUserMenu: DropdownMenuItem[] = [
    {
      label: 'View Profile',
      icon: 'fa-regular fa-id-card',
      onClick: () => alert('todo: make profile page'),
    },
    {
      label: 'Logout',
      class: 'text-error hover:text-error',
      icon: 'fa-solid fa-right-from-bracket',
      onClick: () => this.authService.logout(),
    },
  ];
}
