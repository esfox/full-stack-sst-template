import { Injectable, signal } from '@angular/core';
import { UserType } from '../types';
import { ApiService, RecordResponse } from './api.service';

@Injectable({
  providedIn: 'root',
})
export class UsersService extends ApiService<UserType> {
  currentUser = signal<UserType | undefined>(undefined);

  constructor() {
    super({
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
  }

  async getCurrentUser() {
    this.isLoading.set(true);

    try {
      const response = await this.fetch('/me');
      const { record }: RecordResponse = await response.json();
      const data = this.mapFromApi(record);
      this.currentUser.set(data);
      this.isLoading.set(false);
    } catch (error) {
      //  TODO: handle error
      console.error(error);
    }
  }
}
