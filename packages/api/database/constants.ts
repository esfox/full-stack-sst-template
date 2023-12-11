export enum TableName {
  Roles = 'roles',
  Users = 'users',
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
  GoogleId = 'google_id',
  GooglePictureUrl = 'google_picture_url',
  CreatedAt = 'created_at',
  UpdatedAt = 'updated_at',
  DeletedAt = 'deleted_at',
}
