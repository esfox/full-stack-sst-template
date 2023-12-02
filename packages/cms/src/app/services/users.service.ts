import { Injectable } from '@angular/core';
import { UserType } from '../types/users.types';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root',
})
export class UsersService extends ApiService<UserType> {
  constructor() {
    super({
      basePath: '/users',
      dataMapping: [
        { apiField: 'id', mappedField: 'id' },
        { apiField: 'email', mappedField: 'email' },
        { apiField: 'username', mappedField: 'username' },
        { apiField: 'first_name', mappedField: 'firstName' },
        { apiField: 'last_name', mappedField: 'lastName' },
        { apiField: 'created_at', mappedField: 'createdAt' },
        { apiField: 'updated_at', mappedField: 'updatedAt' },
        { apiField: 'deleted_at', mappedField: 'deletedAt' },
      ],
    });
  }
}
