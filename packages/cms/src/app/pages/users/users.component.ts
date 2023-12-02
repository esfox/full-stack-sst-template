import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { DialogComponent } from '../../components/dialog/dialog.component';
import { PromptDialogComponent } from '../../components/prompt-dialog/prompt-dialog.component';
import { MainLayoutComponent } from '../../layouts/main-layout/main-layout.component';
import { UsersService } from '../../services/users.service';
import { UserType } from '../../types/users.types';
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

  userToDeleteEmail!: string;

  users = this.usersService.records;
  isLoading = this.usersService.isLoading;
  isSaving = this.usersService.isSaving;
  isDeleting = this.usersService.isDeleting;

  constructor(private usersService: UsersService) {}

  async ngOnInit() {
    await this.usersService.get();
  }

  showUserForm(user?: UserType) {
    this.userToEdit = user;
    this.userFormDialog.show();

    if (user) {
      this.userFormComponent.setValues<Partial<UserType>>({
        email: user.email,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
      });
    } else {
      this.userFormComponent.reset();
    }
  }

  promptDeleteUser(user: UserType) {
    this.userToDelete = user;
    this.userToDeleteEmail = this.userToDelete.email;
    this.deletePromptDialog.show();
  }

  async saveUser(data: Partial<UserType>) {
    if (this.userToEdit) {
      await this.usersService.edit(this.userToEdit?.id, data);
    } else {
      await this.usersService.create(data);
    }

    if (this.usersService.savedRecord()) {
      this.userFormDialog.hide();
    }
  }

  async deleteUser() {
    const userId = this.userToDelete?.id;
    if (userId) {
      await this.usersService.delete(userId);
      this.deletePromptDialog.hide();
    }
  }
}
