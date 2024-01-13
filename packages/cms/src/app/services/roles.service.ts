import { Injectable, inject, signal } from '@angular/core';
import { PermissionType, RoleType } from '../types';
import { ApiService, RecordsResponse } from './api.service';
import { PermissionsService } from './permissions.service';
import { ResourceService } from './resource.service';

@Injectable({
  providedIn: 'root',
})
export class RolesService extends ResourceService<RoleType> {
  private permissionsService = inject(PermissionsService);

  rolePermissionsMap: { [roleId: string]: PermissionType[] } = {};

  isLoadingPermissions = signal(false);
  isSavingWithPermissions = signal(false);

  constructor() {
    const apiService = new ApiService<RoleType>({
      basePath: '/roles',
      dataMapping: [
        { apiField: 'id', mappedField: 'id' },
        { apiField: 'name', mappedField: 'name' },
        { apiField: 'created_at', mappedField: 'createdAt' },
        { apiField: 'updated_at', mappedField: 'updatedAt' },
        { apiField: 'deleted_at', mappedField: 'deletedAt' },
      ],
    });

    super(apiService);

    this.apiService = apiService;
  }

  override async initEditRecordForm(recordId?: string | undefined) {
    const initResult = await super.initEditRecordForm(recordId);

    if (this.permissionsService.records()?.length) {
      return initResult;
    }

    await this.permissionsService.loadRecords();

    return initResult;
  }

  private getRolePermissionsUrl(roleId: string) {
    return `${this.apiService.url}/${roleId}/permissions`;
  }

  async getPermissions(roleId: string) {
    let permissions = this.rolePermissionsMap[roleId];
    if (permissions) {
      return permissions;
    }

    this.isLoadingPermissions.set(true);

    const response = await this.apiService.fetch(this.getRolePermissionsUrl(roleId));
    const { records }: RecordsResponse = await response.json();

    this.isLoadingPermissions.set(false);

    const permissionRecords = records;
    if (!permissionRecords) {
      return;
    }

    permissions = permissionRecords.map(record =>
      this.permissionsService.apiService.mapFromApi(record)
    );

    if (!this.rolePermissionsMap[roleId]) {
      this.rolePermissionsMap[roleId] = permissions;
    }

    return permissions;
  }

  async saveWithPermissions(data: { role: Partial<RoleType>; permissions: PermissionType[] }) {
    this.saveRecordError.set(undefined);

    let roleIdToEdit;
    if (this.recordToEdit()) {
      roleIdToEdit = this.getRecordId(this.recordToEdit());
    }

    const { role, permissions } = data;

    this.isSavingWithPermissions.set(true);

    const savedRoleResult = await this.apiService.save(role, roleIdToEdit);
    if (!savedRoleResult.response.ok || !savedRoleResult.data) {
      this.isSavingWithPermissions.set(false);
      return { error: savedRoleResult.response };
    }

    const savedRoleId = savedRoleResult.data.id;
    const permissionIds = permissions.map(permission => permission.id);
    await this.apiService.fetchWithBody(
      this.getRolePermissionsUrl(savedRoleId),
      'PUT',
      permissionIds
    );

    this.isSavingWithPermissions.set(false);
    delete this.rolePermissionsMap[savedRoleId];

    return { data: savedRoleResult.data };
  }
}
