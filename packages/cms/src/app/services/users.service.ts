import { Injectable } from '@angular/core';
import { UserFormDataType, UserType } from '../types/users.types';
import { ApiService } from './api.service';
import { UserField } from '../constants/users.constants';

@Injectable({
  providedIn: 'root',
})
export class UsersService extends ApiService<UserType, UserFormDataType> {
  constructor() {
    super();
    super.setBasePath('/users');
  }

  protected override mapFormData(data: UserFormDataType): unknown {
    return {
      [UserField.Email]: data.email,
      [UserField.Username]: data.username,
      [UserField.FirstName]: data.firstName,
      [UserField.LastName]: data.lastName,
    };
  }
}
