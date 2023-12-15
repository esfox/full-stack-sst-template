import { TableName, PermissionField } from '../database/constants';
import { type Permissions } from '../database/schema';
import { SqlService } from '../services/sql.service';

export class PermissionsService extends SqlService<Permissions> {
  constructor() {
    super({
      table: TableName.Permissions,
      updatedAtColumn: PermissionField.UpdatedAt,
      deletedAtColumn: PermissionField.DeletedAt,
    });
  }
}

export const permissionsService = new PermissionsService();
