import { UserField } from '../constants/users.constants';

export type UserType = {
  [UserField.Id]: string;
  [UserField.Email]: string;
  [UserField.PasswordHash]: string;
  [UserField.Username]?: string;
  [UserField.FirstName]?: string;
  [UserField.LastName]?: string;
  [UserField.CreatedAt]: string;
  [UserField.UpdatedAt]?: string;
  [UserField.DeletedAt]?: string;
};
