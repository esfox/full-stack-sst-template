import { Injectable, inject, signal } from '@angular/core';
import { PermissionType, RoleType } from '../types';
import { ApiService, RecordsResponse } from './api.service';
import { PermissionsService } from './permissions.service';

@Injectable({
  providedIn: 'root',
})
export class RolesService extends ApiService<RoleType> {
  private permissionsService = inject(PermissionsService);

  rolePermissionsMap: { [roleId: string]: PermissionType[] } = {};

  isSavingWithPermissions = false;

  constructor() {
    super({
      basePath: '/roles',
      dataMapping: [
        { apiField: 'id', mappedField: 'id' },
        { apiField: 'name', mappedField: 'name' },
        { apiField: 'created_at', mappedField: 'createdAt' },
        { apiField: 'updated_at', mappedField: 'updatedAt' },
        { apiField: 'deleted_at', mappedField: 'deletedAt' },
      ],
    });
  }

  private getRolePermissionsUrl(roleId: string) {
    return `${this.url}/${roleId}/permissions`;
  }

  async getPermissions(roleId: string) {
    let permissions = this.rolePermissionsMap[roleId];
    if (permissions) {
      return permissions;
    }

    let permissionRecords;
    try {
      const response = await this.fetch(this.getRolePermissionsUrl(roleId));
      const { records }: RecordsResponse = await response.json();
      permissionRecords = records;
    } catch (error) {
      // TODO: handle error
    }

    if (!permissionRecords) {
      return;
    }

    permissions = permissionRecords.map(record => this.permissionsService.mapFromApi(record));
    if (!this.rolePermissionsMap[roleId]) {
      this.rolePermissionsMap[roleId] = permissions;
    }

    return permissions;
  }

  async saveWithPermissions(data: {
    role: Partial<RoleType>;
    permissions: PermissionType[];
    roleId?: string;
  }) {
    const { role, permissions, roleId } = data;

    this.isSavingWithPermissions = true;

    let savedRole;
    if (roleId) {
      savedRole = await this.edit(roleId, role);
    } else {
      savedRole = await this.create(role);
    }

    const savedRoleId = savedRole.id;
    const permissionIds = permissions.map(permission => permission.id);
    await this.fetchWithBody(this.getRolePermissionsUrl(savedRoleId), 'PUT', permissionIds);

    this.isSavingWithPermissions = false;
    delete this.rolePermissionsMap[savedRoleId];
  }
}
