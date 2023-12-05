import { Injectable } from '@angular/core';
import { RoleType } from '../types';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root',
})
export class RolesService extends ApiService<RoleType> {
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
}
