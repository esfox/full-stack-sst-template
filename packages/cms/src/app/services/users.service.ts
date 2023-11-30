import { Injectable, signal } from '@angular/core';
import { UserField } from '../constants/users.constants';
import { UserFormDataType, UserType } from '../types/users.types';
import { ApiService } from './api.service';

type GetUsersResponse = { records: UserType[]; totalRecords: number };

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  records = signal<UserType[]>([]);
  totalRecords = signal(0);
  isLoading = signal(false);
  isSaving = signal(false);
  savedRecord = signal<UserType | undefined>(undefined);

  constructor(private api: ApiService) {
    this.api.basePath = '/users';
  }

  async get() {
    this.isLoading.set(true);
    try {
      const response = await this.api.get<GetUsersResponse>('/');
      this.isLoading.set(false);
      this.records.set(response.records);
      this.totalRecords.set(response.totalRecords);
    } catch (error) {
      //  TODO: handle error
      console.error(error);
    }
  }

  async create(data: UserFormDataType) {
    this.isSaving.set(true);
    try {
      const response = await this.api.post<UserType>('/', this.mapData(data));
      this.isSaving.set(false);
      this.savedRecord.set(response);
      this.get();
    } catch (error) {
      //  TODO: handle error
      console.error(error);
    }
  }

  async edit(id: string, data: UserFormDataType) {
    this.isSaving.set(true);
    try {
      const response = await this.api.patch<UserType>(`/${id}`, this.mapData(data));
      this.isSaving.set(false);
      this.savedRecord.set(response);
      this.get();
    } catch (error) {
      // TODO: handle error
      console.error(error);
    }
  }

  private mapData(data: UserFormDataType): Partial<UserType> {
    return {
      [UserField.Email]: data.email,
      [UserField.Username]: data.username,
      [UserField.FirstName]: data.firstName,
      [UserField.LastName]: data.lastName,
    };
  }
}
