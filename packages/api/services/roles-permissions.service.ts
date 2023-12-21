import { Transaction } from 'kysely';
import { PermissionField, RolePermissionField, TableName } from '../database/constants';
import { Database, type RolesPermissions } from '../database/schema';
import { SqlService } from '../services/sql.service';

export class RolesPermissionsService extends SqlService<RolesPermissions> {
  constructor() {
    super({
      table: TableName.RolesPermissions,
      updatedAtColumn: RolePermissionField.UpdatedAt,
      deletedAtColumn: RolePermissionField.DeletedAt,
    });
  }

  private getRolePermissionsQuery(roleId: string, transaction?: Transaction<Database>) {
    const source = transaction ?? this.database;
    let query = source
      .selectFrom(TableName.RolesPermissions)
      .where(RolePermissionField.RoleId, '=', roleId)
      .leftJoin(
        TableName.Permissions,
        `${TableName.Permissions}.${PermissionField.Id}`,
        `${TableName.RolesPermissions}.${RolePermissionField.PermissionId}`
      )
      .selectAll(TableName.Permissions)
      .distinct();

    query = this.withoutSoftDeletes(query);

    return query;
  }

  async setRolePermissions(roleId: string, permissionIds: string[]) {
    const values = permissionIds.map(permissionId => ({
      [RolePermissionField.RoleId]: roleId,
      [RolePermissionField.PermissionId]: permissionId,
    }));

    const result = await this.database.transaction().execute(async transaction => {
      const withPermissions = permissionIds.length !== 0;

      let deleteQuery = transaction
        .deleteFrom(TableName.RolesPermissions)
        .where(RolePermissionField.RoleId, '=', roleId)
        .returningAll();

      if (withPermissions) {
        deleteQuery = deleteQuery.where(RolePermissionField.PermissionId, 'not in', permissionIds);
      }

      await deleteQuery.execute();

      if (withPermissions) {
        await transaction
          .insertInto(TableName.RolesPermissions)
          .values(values as any)
          .onConflict(oc =>
            oc.columns([RolePermissionField.RoleId, RolePermissionField.PermissionId]).doNothing()
          )
          .returningAll()
          .execute();
      }

      return this.getRolePermissionsQuery(roleId, transaction).execute();
    });

    return result;
  }

  async getRolePermissions(roleId: string) {
    const records = await this.getRolePermissionsQuery(roleId).execute();
    return records;
  }

  async deleteByIds(roleId: string, permissionIds: string | string[]) {
    const permissionIdsArray = Array.isArray(permissionIds) ? permissionIds : [permissionIds];

    let query = this.database
      .deleteFrom(TableName.RolesPermissions)
      .where(RolePermissionField.RoleId, '=', roleId)
      .where(RolePermissionField.PermissionId, 'in', permissionIdsArray)
      .returningAll();

    query = this.withoutSoftDeletes(query);

    const record = await query.execute();
    return record;
  }
}

export const rolesPermissionsService = new RolesPermissionsService();
