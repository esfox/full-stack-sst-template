import { Injectable } from '@angular/core';
import { PermissionType } from '../types';
import { ApiService } from './api.service';
import { ResourceService } from './resource.service';

@Injectable({
  providedIn: 'root',
})
export class PermissionsService extends ResourceService<PermissionType> {
  constructor() {
    const apiService = new ApiService<PermissionType>({
      basePath: '/permissions',
      dataMapping: [
        { apiField: 'id', mappedField: 'id' },
        { apiField: 'name', mappedField: 'name' },
        { apiField: 'created_at', mappedField: 'createdAt' },
        { apiField: 'updated_at', mappedField: 'updatedAt' },
        { apiField: 'deleted_at', mappedField: 'deletedAt' },
      ],
    });

    super(apiService);
  }
}
