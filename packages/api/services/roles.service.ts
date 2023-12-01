import { TableName, RoleField } from '../database/constants';
import { type Roles } from '../database/schema';
import { SqlService } from '../services/sql.service';

export class RolesService extends SqlService<Roles> {
  constructor() {
    super({
      table: TableName.Roles,
      updatedAtColumn: RoleField.UpdatedAt,
      deletedAtColumn: RoleField.DeletedAt,
    });
  }
}

export const rolesService = new RolesService();
