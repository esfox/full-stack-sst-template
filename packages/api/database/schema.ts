import { TableName, RoleField, UserField } from './constants';

export interface Roles {
  [RoleField.Id]: string;
  [RoleField.Name]: string;
  [RoleField.CreatedAt]: string;
  [RoleField.UpdatedAt]?: string | null;
  [RoleField.DeletedAt]?: string | null;
}

export interface Users {
  [UserField.Id]: string;
  [UserField.Email]: string;
  [UserField.PasswordHash]?: string | null;
  [UserField.Username]?: string | null;
  [UserField.FirstName]?: string | null;
  [UserField.LastName]?: string | null;
  [UserField.GoogleId]?: string | null;
  [UserField.GooglePictureUrl]?: string | null;
  [UserField.CreatedAt]: string;
  [UserField.UpdatedAt]?: string | null;
  [UserField.DeletedAt]?: string | null;
}

export interface Database {
  [TableName.Roles]: Roles;
  [TableName.Users]: Users;
}
