import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UserType } from '../types/users.types';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  constructor(private http: HttpClient) {}

  get() {
    return this.http.get<{ records: UserType[]; totalRecords: number }>('/users');
  }
}
