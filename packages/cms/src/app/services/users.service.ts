import { Injectable, signal } from '@angular/core';
import { UserField } from '../constants/users.constants';
import { UserFormDataType, UserType } from '../types/users.types';
import { ApiService } from './api.service';

type GetUsersResponse = { records: UserType[]; totalRecords: number };
type UserRecordResponse = { record: UserType };

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  records = signal<UserType[]>([]);
  totalRecords = signal(0);
  isLoading = signal(false);

  /* Indicates whether a user is being created, edited, or deleted */
  isProcessing = signal(false);

  /* This can be either the created, edited, or deleted user */
  processedRecord = signal<UserType | undefined>(undefined);

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
    this.isProcessing.set(true);
    try {
      const response = await this.api.post<UserType>('/', this.mapData(data));
      this.isProcessing.set(false);
      this.processedRecord.set(response);
      this.get();
    } catch (error) {
      //  TODO: handle error
      console.error(error);
    }
  }

  async edit(id: string, data: UserFormDataType) {
    this.isProcessing.set(true);
    try {
      const { record } = await this.api.patch<UserRecordResponse>(`/${id}`, this.mapData(data));
      this.isProcessing.set(false);
      this.processedRecord.set(record);
      this.get();
    } catch (error) {
      // TODO: handle error
      console.error(error);
    }
  }

  async delete(id: string) {
    this.isProcessing.set(true);
    try {
      const { record } = await this.api.delete<UserRecordResponse>(`/${id}`);
      this.isProcessing.set(false);
      this.processedRecord.set(record);
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
