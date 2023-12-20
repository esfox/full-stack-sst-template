export enum TableName {
  RolesPermissions = 'roles_permissions',
  Permissions = 'permissions',
  Roles = 'roles',
  Users = 'users',
}

export enum RolePermissionField {
  Id = 'id',
  RoleId = 'role_id',
  PermissionId = 'permission_id',
  CreatedAt = 'created_at',
  UpdatedAt = 'updated_at',
  DeletedAt = 'deleted_at',
}

export enum PermissionField {
  Id = 'id',
  Name = 'name',
  CreatedAt = 'created_at',
  UpdatedAt = 'updated_at',
  DeletedAt = 'deleted_at',
}

export enum RoleField {
  Id = 'id',
  Name = 'name',
  CreatedAt = 'created_at',
  UpdatedAt = 'updated_at',
  DeletedAt = 'deleted_at',
}

export enum UserField {
  Id = 'id',
  Email = 'email',
  PasswordHash = 'password_hash',
  Username = 'username',
  FirstName = 'first_name',
  LastName = 'last_name',
  CreatedAt = 'created_at',
  UpdatedAt = 'updated_at',
  DeletedAt = 'deleted_at',
  GoogleId = 'google_id',
  GooglePictureUrl = 'google_picture_url',
}
