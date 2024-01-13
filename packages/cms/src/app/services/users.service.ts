import { Injectable, inject, signal } from '@angular/core';
import { RoleType, UserType } from '../types';
import { ApiService, RecordResponse, RecordsResponse } from './api.service';
import { ResourceService } from './resource.service';
import { RolesService } from './roles.service';

@Injectable({
  providedIn: 'root',
})
export class UsersService extends ResourceService<UserType> {
  private rolesService = inject(RolesService);

  currentUser = signal<UserType | undefined>(undefined);
  isLoadingCurrentUser = signal(false);
  isLoadingRoles = signal(false);
  isSavingWithRoles = signal(false);

  userRolesMap: { [userId: string]: RoleType[] } = {};

  constructor() {
    const apiService = new ApiService<UserType>({
      basePath: '/users',
      dataMapping: [
        { apiField: 'id', mappedField: 'id' },
        { apiField: 'email', mappedField: 'email' },
        { apiField: 'username', mappedField: 'username' },
        { apiField: 'first_name', mappedField: 'firstName' },
        { apiField: 'last_name', mappedField: 'lastName' },
        { apiField: 'google_id', mappedField: 'googleId' },
        { apiField: 'google_picture_url', mappedField: 'googlePictureUrl' },
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

    if (this.rolesService.records()?.length) {
      return initResult;
    }

    await this.rolesService.loadRecords();

    return initResult;
  }

  private getUserRolesUrl(userId: string) {
    return `${this.apiService.url}/${userId}/roles`;
  }

  async getCurrentUser() {
    this.isLoadingCurrentUser.set(true);

    const response = await this.apiService.fetch('/me');
    if (!response.ok) {
      return { error: response };
    }

    const { record }: RecordResponse = await response.json();
    const data = this.apiService.mapFromApi(record);
    this.currentUser.set(data);
    this.isLoadingCurrentUser.set(false);

    return { data: record };
  }

  async getRoles(userId: string) {
    let roles = this.userRolesMap[userId];
    if (roles) {
      return { data: roles };
    }

    this.isLoadingRoles.set(true);

    const response = await this.apiService.fetch(this.getUserRolesUrl(userId));
    const { records }: RecordsResponse = await response.json();

    this.isLoadingRoles.set(false);

    const roleRecords = records;
    if (!roleRecords) {
      return {};
    }

    roles = roleRecords.map(record => this.rolesService.apiService.mapFromApi(record));
    if (!this.userRolesMap[userId]) {
      this.userRolesMap[userId] = roles;
    }

    return { data: roles };
  }

  async saveWithRoles(data: { user: Partial<UserType>; roles: RoleType[] }) {
    this.saveRecordError.set(undefined);

    let userId;
    if (this.recordToEdit()) {
      userId = this.getRecordId(this.recordToEdit());
    }

    const { user, roles } = data;

    this.isSavingWithRoles.set(true);

    const saveUserResult = await this.apiService.save(user, userId);
    if (!saveUserResult.response.ok || !saveUserResult.data) {
      this.isSavingWithRoles.set(false);
      return { error: saveUserResult.response };
    }

    const savedUserId = saveUserResult.data.id;
    const roleIds = roles.map(role => role.id);
    await this.apiService.fetchWithBody(this.getUserRolesUrl(savedUserId), 'PUT', roleIds);

    this.isSavingWithRoles.set(false);
    delete this.userRolesMap[savedUserId];

    return { data: saveUserResult.data };
  }
}
