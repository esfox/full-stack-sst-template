export type UserType = {
  id: string;
  email: string;
  username?: string;
  firstName?: string;
  lastName?: string;
  createdAt: string;
  updatedAt?: string;
  deletedAt?: string;
};

export type RoleType = {
  id: string;
  name: string;
  createdAt: string;
  updatedAt?: string;
  deletedAt?: string;
};
