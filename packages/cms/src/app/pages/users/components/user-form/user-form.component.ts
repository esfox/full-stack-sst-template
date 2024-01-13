import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  BaseFormComponent,
  injectionTokens,
} from '../../../../components/base-form/base-form.component';
import { NavbarComponent } from '../../../../components/navbar/navbar.component';
import { RolesService } from '../../../../services/roles.service';
import { UsersService } from '../../../../services/users.service';
import { RoleType, UserType } from '../../../../types';

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [CommonModule, NavbarComponent, FormsModule],
  templateUrl: './user-form.component.html',
  styleUrl: './user-form.component.scss',
  providers: [{ provide: injectionTokens.service, useExisting: UsersService }],
})
export class UserFormComponent extends BaseFormComponent<UserType> {
  rolesService = inject(RolesService);
  usersService = inject(UsersService);

  isLoadingRoleOptions = this.rolesService.isLoadingRecords;
  isLoadingRoles = this.usersService.isLoadingRoles;
  selectedRoles: RoleType[] = [];

  override isSaving = this.usersService.isSavingWithRoles;

  override async setValues() {
    super.setValues();

    const user = this.recordToEdit();
    if (!user || !user.id) {
      return;
    }

    this.selectedRoles = [];

    const { data } = await this.usersService.getRoles(user.id);
    if (!data) {
      return;
    }

    this.selectedRoles = [...data];
  }

  override async save() {
    const { error } = await this.usersService.saveWithRoles({
      user: this.form.value,
      roles: Array.from(this.selectedRoles),
    });

    if (!error) {
      this.location.back();
      await this.service.loadRecords();
    }

    if (error?.status === 403) {
      this.error = 'Not allowed to save';
    }
  }

  getRoleOptions() {
    const roles = this.rolesService.records();
    if (!roles) {
      return [];
    }

    const roleOptions = [];
    for (const role of roles) {
      if (!this.selectedRoles.some(selected => selected.id === role.id)) {
        roleOptions.push(role);
      }
    }

    return roleOptions;
  }

  addRole(event: Event) {
    const select = event.target as HTMLSelectElement;
    const permissionId = select.value;
    for (const permission of this.getRoleOptions()) {
      if (permission.id === permissionId) {
        this.selectedRoles.push(permission);
        break;
      }
    }

    select.value = '';
  }

  removeRole(role: RoleType) {
    const newSelected = [];
    for (const selected of this.selectedRoles) {
      if (selected.id !== role.id) {
        newSelected.push(selected);
      }
    }

    this.selectedRoles = newSelected;
  }
}
