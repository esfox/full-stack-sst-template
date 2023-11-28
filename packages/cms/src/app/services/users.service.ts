import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { UserType } from '../types/users.types';

type GetUsersResponse = { records: UserType[]; totalRecords: number };

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  records = signal<UserType[]>([]);
  totalRecords = signal(0);
  isLoading = signal(false);

  constructor(private http: HttpClient) {}

  get() {
    this.isLoading.set(true);
    this.http.get<GetUsersResponse>('/users').subscribe(result => {
      this.isLoading.set(false);
      this.records.set(result.records);
      this.totalRecords.set(result.totalRecords);
    });
  }
}
