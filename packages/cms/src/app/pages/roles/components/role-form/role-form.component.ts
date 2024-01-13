import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  BaseFormComponent,
  injectionTokens,
} from '../../../../components/base-form/base-form.component';
import { NavbarComponent } from '../../../../components/navbar/navbar.component';
import { PermissionsService } from '../../../../services/permissions.service';
import { RolesService } from '../../../../services/roles.service';
import { PermissionType, RoleType } from '../../../../types';

@Component({
  selector: 'app-role-form',
  standalone: true,
  imports: [CommonModule, NavbarComponent, FormsModule],
  templateUrl: './role-form.component.html',
  styleUrl: './role-form.component.scss',
  providers: [{ provide: injectionTokens.service, useExisting: RolesService }],
})
export class RoleFormComponent extends BaseFormComponent<RoleType> {
  rolesService = inject(RolesService);
  permissionsService = inject(PermissionsService);

  selectedPermissions: PermissionType[] = [];
  isLoadingPermissions = this.rolesService.isLoadingPermissions;
  isLoadingPermissionOptions = this.permissionsService.isLoadingRecords;

  override isSaving = this.rolesService.isSavingWithPermissions;

  override async setValues() {
    super.setValues();

    const role = this.recordToEdit();
    if (!role || !role.id) {
      return;
    }

    this.selectedPermissions = [];

    const permissions = await this.rolesService.getPermissions(role.id);
    if (!permissions) {
      return;
    }

    this.selectedPermissions = [...permissions];
  }

  override async save() {
    const { error } = await this.rolesService.saveWithPermissions({
      role: this.form.value,
      permissions: Array.from(this.selectedPermissions),
    });

    if (!error) {
      this.location.back();
      await this.service.loadRecords();
    }

    if (error?.status === 403) {
      this.error = 'Not allowed to save';
    }
  }

  getPermissionOptions() {
    const permissions = this.permissionsService.records();
    if (!permissions) {
      return [];
    }

    const permissionOptions = [];
    for (const permission of permissions) {
      if (!this.selectedPermissions.some(selected => selected.id === permission.id)) {
        permissionOptions.push(permission);
      }
    }

    return permissionOptions;
  }

  addPermission(event: Event) {
    const select = event.target as HTMLSelectElement;
    const permissionId = select.value;
    for (const permission of this.getPermissionOptions()) {
      if (permission.id === permissionId) {
        this.selectedPermissions.push(permission);
        break;
      }
    }

    select.value = '';
  }

  removePermission(permission: PermissionType) {
    const newSelected = [];
    for (const selected of this.selectedPermissions) {
      if (selected.id !== permission.id) {
        newSelected.push(selected);
      }
    }

    this.selectedPermissions = newSelected;
  }
}
