import { sql } from 'kysely';

/** @param {import('kysely').Kysely<unknown>} db */
export async function up(db) {
  await sql`
    CREATE TABLE IF NOT EXISTS users_roles (
      "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      "user_id" UUID NOT NULL REFERENCES users (id),
      "role_id" UUID NOT NULL REFERENCES roles (id),
      "created_at" TIMESTAMP NOT NULL DEFAULT NOW(),
      "updated_at" TIMESTAMP,
      "deleted_at" TIMESTAMP,
      UNIQUE ("user_id", "role_id")
    );

    CREATE INDEX "users_roles_user_id_index" ON users_roles("user_id");
    CREATE INDEX "users_roles_role_id_index" ON users_roles("role_id");
    CREATE INDEX "users_roles_created_at_index" ON users_roles("created_at");
    CREATE INDEX "users_roles_updated_at_index" ON users_roles("updated_at");
    CREATE INDEX "users_roles_deleted_at_index" ON users_roles("deleted_at");

    ALTER TABLE users_roles ENABLE ROW LEVEL SECURITY;
  `.execute(db);
}

/** @param {import('kysely').Kysely<unknown>} db */
export async function down(db) {
  await sql`DROP TABLE IF EXISTS users_roles`.execute(db);
}
