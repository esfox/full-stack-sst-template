import { PermissionField, RoleField, RolePermissionField, TableName, UserField } from './constants';

export interface Permissions {
  [PermissionField.Id]: string;
  [PermissionField.Name]: string;
  [PermissionField.CreatedAt]: string;
  [PermissionField.UpdatedAt]?: string | null;
  [PermissionField.DeletedAt]?: string | null;
}

export interface Roles {
  [RoleField.Id]: string;
  [RoleField.Name]: string;
  [RoleField.CreatedAt]: string;
  [RoleField.UpdatedAt]?: string | null;
  [RoleField.DeletedAt]?: string | null;
}

export interface RolesPermissions {
  [RolePermissionField.Id]: string;
  [RolePermissionField.RoleId]: string;
  [RolePermissionField.PermissionId]: string;
  [RolePermissionField.CreatedAt]: string;
  [RolePermissionField.UpdatedAt]?: string | null;
  [RolePermissionField.DeletedAt]?: string | null;
}

export interface Users {
  [UserField.Id]: string;
  [UserField.Email]: string;
  [UserField.PasswordHash]?: string | null;
  [UserField.Username]?: string | null;
  [UserField.FirstName]?: string | null;
  [UserField.LastName]?: string | null;
  [UserField.CreatedAt]: string;
  [UserField.UpdatedAt]?: string | null;
  [UserField.DeletedAt]?: string | null;
  [UserField.GoogleId]?: string | null;
  [UserField.GooglePictureUrl]?: string | null;
}

export interface Database {
  [TableName.Permissions]: Permissions;
  [TableName.Roles]: Roles;
  [TableName.RolesPermissions]: RolesPermissions;
  [TableName.Users]: Users;
}
