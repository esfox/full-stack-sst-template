import { Transaction } from 'kysely';
import {
  PermissionField,
  RoleField,
  RolePermissionField,
  TableName,
  UserRoleField,
} from '../database/constants';
import { Database, type UsersRoles } from '../database/schema';
import { SqlService } from '../services/sql.service';

export class UsersRolesService extends SqlService<UsersRoles> {
  constructor() {
    super({
      table: TableName.UsersRoles,
      updatedAtColumn: UserRoleField.UpdatedAt,
      deletedAtColumn: UserRoleField.DeletedAt,
    });
  }

  private getUserRolesQuery(userId: string, transaction?: Transaction<Database>) {
    const source = transaction ?? this.database;
    let query = source
      .selectFrom(TableName.UsersRoles)
      .where(UserRoleField.UserId, '=', userId)
      .leftJoin(
        TableName.Roles,
        `${TableName.Roles}.${RoleField.Id}`,
        `${TableName.UsersRoles}.${UserRoleField.RoleId}`
      )
      .selectAll(TableName.Roles)
      .distinct();

    query = this.withoutSoftDeletes(query);

    return query;
  }

  getUserRoles(userId: string) {
    return this.getUserRolesQuery(userId).execute();
  }

  getUserPermissions(userId: string) {
    let query = this.database
      .selectFrom(TableName.UsersRoles)
      .leftJoin(
        TableName.RolesPermissions,
        `${TableName.RolesPermissions}.${RolePermissionField.RoleId}`,
        `${TableName.UsersRoles}.${UserRoleField.RoleId}`
      )
      .leftJoin(
        TableName.Permissions,
        `${TableName.Permissions}.${PermissionField.Id}`,
        `${TableName.RolesPermissions}.${RolePermissionField.PermissionId}`
      )
      .selectAll(TableName.Permissions)
      .where(UserRoleField.UserId, '=', userId)
      .distinctOn(RolePermissionField.PermissionId);

    query = this.withoutSoftDeletes(query);

    return query.execute();
  }

  async setUserRoles(userId: string, roleIds: string[]) {
    const values = roleIds.map(roleId => ({
      [UserRoleField.UserId]: userId,
      [UserRoleField.RoleId]: roleId,
    }));

    const result = await this.database.transaction().execute(async transaction => {
      const withRoles = roleIds.length !== 0;

      let deleteQuery = transaction
        .deleteFrom(TableName.UsersRoles)
        .where(UserRoleField.UserId, '=', userId)
        .returningAll();

      if (withRoles) {
        deleteQuery = deleteQuery.where(UserRoleField.RoleId, 'not in', roleIds);
      }

      await deleteQuery.execute();

      if (withRoles) {
        await transaction
          .insertInto(TableName.UsersRoles)
          .values(values as any)
          .onConflict(oc => oc.columns([UserRoleField.UserId, UserRoleField.RoleId]).doNothing())
          .returningAll()
          .execute();
      }

      return this.getUserRolesQuery(userId, transaction).execute();
    });

    return result;
  }
}

export const usersRolesService = new UsersRolesService();
