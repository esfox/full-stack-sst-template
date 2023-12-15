import { PermissionField, RolePermissionField, TableName } from '../database/constants';
import { type RolesPermissions } from '../database/schema';
import { SqlService } from '../services/sql.service';

export class RolesPermissionsService extends SqlService<RolesPermissions> {
  constructor() {
    super({
      table: TableName.RolesPermissions,
      updatedAtColumn: RolePermissionField.UpdatedAt,
      deletedAtColumn: RolePermissionField.DeletedAt,
    });
  }

  private parsePermissionIds(permissionIds: string | string[]) {
    return Array.isArray(permissionIds) ? permissionIds : [permissionIds];
  }

  async getPermissionsByRole(roleId: string) {
    let query = this.database
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

    const records = await query.execute();
    return records;
  }

  async deleteByIds(roleId: string, permissionIds: string | string[]) {
    const permissionIdsArray = this.parsePermissionIds(permissionIds);

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
