import { CommonModule, Location } from '@angular/common';
import { Component, OnInit, computed, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';
import { UsersService } from './services/users.service';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, MainLayoutComponent, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  usersService = inject(UsersService);
  authService = inject(AuthService);
  location = inject(Location);

  isLoading = computed(
    () => this.usersService.isLoadingCurrentUser() || this.authService.isLoggingOut()
  );

  publicRoutes = ['/login'];

  async ngOnInit() {
    const currentRoute = this.location.path();
    if (this.publicRoutes.includes(currentRoute)) {
      return;
    }

    const { error } = await this.usersService.getCurrentUser();
    if (error) {
      // TODO: handle error
      return;
    }
  }
}
