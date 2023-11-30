import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { UserField } from '../../constants/users.constants';
import { MainLayoutComponent } from '../../layouts/main-layout/main-layout.component';
import { UsersService } from '../../services/users.service';
import { UserFormDataType, UserType } from '../../types/users.types';
import { UserDeletePromptComponent } from './components/user-delete-prompt/user-delete-prompt.component';
import { UserFormComponent } from './components/user-form/user-form.component';
import { UsersTableRowComponent } from './components/users-table-row/users-table-row.component';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [
    CommonModule,
    UsersTableRowComponent,
    MainLayoutComponent,
    UserFormComponent,
    UserDeletePromptComponent,
  ],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss',
})
export class UsersComponent implements OnInit {
  @ViewChild(UserFormComponent) userFormComponent!: UserFormComponent;
  @ViewChild(UserDeletePromptComponent) userDeletePromptComponent!: UserDeletePromptComponent;

  userToEdit: UserType | undefined;
  userToDelete: UserType | undefined;

  users = this.usersService.records;
  isLoading = this.usersService.isLoading;
  isSaving = this.usersService.isSaving;
  isDeleting = this.usersService.isDeleting;

  constructor(private usersService: UsersService) {}

  async ngOnInit() {
    await this.usersService.get();
  }

  addUser() {
    this.userFormComponent.show();
  }

  editUser(user: UserType) {
    this.userToEdit = user;
    this.userFormComponent.show(user);
  }

  promptDeleteUser(user: UserType) {
    this.userToDelete = user;
    this.userDeletePromptComponent.show(user);
  }

  async saveUser(data: UserFormDataType) {
    if (this.userToEdit) {
      await this.usersService.edit(this.userToEdit?.[UserField.Id], data);
    } else {
      await this.usersService.create(data);
    }

    if (this.usersService.savedRecord()) {
      this.userFormComponent.hide();
    }
  }

  async deleteUser() {
    const userId = this.userToDelete?.[UserField.Id];
    if (userId) {
      await this.usersService.delete(userId);
      this.userDeletePromptComponent.hide();
    }
  }
}
