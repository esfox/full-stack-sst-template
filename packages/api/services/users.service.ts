import { TableName, UserField } from '../database/constants';
import { type Users } from '../database/schema';
import { SqlService } from './sql.service';

export class UsersService extends SqlService<Users> {
  constructor() {
    super({
      table: TableName.Users,
      updatedAtColumn: UserField.UpdatedAt,
      deletedAtColumn: UserField.DeletedAt,
    });
  }

  async findByEmail(email: string) {
    let query = this.database
      .selectFrom(TableName.Users)
      .selectAll()
      .where(UserField.Email, '=', email)
      .limit(1);

    query = this.withoutSoftDeletes(query);

    const record = await query.executeTakeFirst();
    return record;
  }
}

export const usersService = new UsersService();
