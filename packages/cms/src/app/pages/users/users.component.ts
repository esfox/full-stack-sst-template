import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { DialogComponent } from '../../components/dialog/dialog.component';
import { PromptDialogComponent } from '../../components/prompt-dialog/prompt-dialog.component';
import { UserField } from '../../constants/users.constants';
import { MainLayoutComponent } from '../../layouts/main-layout/main-layout.component';
import { UsersService } from '../../services/users.service';
import { UserFormDataType, UserType } from '../../types/users.types';
import { UserFormComponent } from './components/user-form/user-form.component';
import { UsersTableRowComponent } from './components/users-table-row/users-table-row.component';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [
    CommonModule,
    UsersTableRowComponent,
    MainLayoutComponent,
    DialogComponent,
    PromptDialogComponent,
    UserFormComponent,
  ],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss',
})
export class UsersComponent implements OnInit {
  @ViewChild('userFormDialog') userFormDialog!: DialogComponent;
  @ViewChild('deletePromptDialog') deletePromptDialog!: PromptDialogComponent;
  @ViewChild(UserFormComponent) userFormComponent!: UserFormComponent;

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

  get userToDeleteEmail() {
    return this.userToDelete?.[UserField.Email] ?? '';
  }

  showUserForm(user?: UserType) {
    this.userToEdit = user;
    this.userFormDialog.show();

    if (user) {
      this.userFormComponent.setValues<UserFormDataType>({
        email: user[UserField.Email],
        username: user[UserField.Username],
        firstName: user[UserField.FirstName],
        lastName: user[UserField.LastName],
      });
    } else {
      this.userFormComponent.reset();
    }
  }

  promptDeleteUser(user: UserType) {
    this.userToDelete = user;
    this.deletePromptDialog.show();
  }

  async saveUser(data: UserFormDataType) {
    if (this.userToEdit) {
      await this.usersService.edit(this.userToEdit?.[UserField.Id], data);
    } else {
      await this.usersService.create(data);
    }

    if (this.usersService.savedRecord()) {
      this.userFormDialog.hide();
    }
  }

  async deleteUser() {
    const userId = this.userToDelete?.[UserField.Id];
    if (userId) {
      await this.usersService.delete(userId);
      this.deletePromptDialog.hide();
    }
  }
}
