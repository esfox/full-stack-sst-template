import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MainLayoutComponent } from '../../layouts/main-layout/main-layout.component';
import { UsersService } from '../../services/users.service';
import { UsersTableRowComponent } from './components/users-table-row/users-table-row.component';
import { UserFormComponent } from './components/user-form/user-form.component';
import { UserType } from '../../types/users.types';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, UsersTableRowComponent, MainLayoutComponent, UserFormComponent],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss',
})
export class UsersComponent implements OnInit {
  @ViewChild(UserFormComponent) userFormComponent!: UserFormComponent;

  users = this.usersService.records;
  isLoading = this.usersService.isLoading;

  constructor(private usersService: UsersService) {}

  async ngOnInit() {
    await this.usersService.get();
  }

  addUser() {
    this.userFormComponent.open();
  }

  editUser(user: UserType) {
    this.userFormComponent.open(user);
  }
}
