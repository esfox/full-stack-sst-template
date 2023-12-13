import { CommonModule } from '@angular/common';
import { Component, OnInit, computed, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { routes } from '../../app.routes';
import { UsersService } from '../../services/users.service';
import {
  DropdownMenuComponent,
  DropdownMenuItem as DropdownMenuItem,
} from '../dropdown-menu/dropdown-menu.component';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, DropdownMenuComponent],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
})
export class SidebarComponent implements OnInit {
  usersService = inject(UsersService);

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
      onClick: () => alert('todo: implement logout'),
    },
  ];

  async ngOnInit() {
    await this.usersService.getCurrentUser();
  }
}
