import { sql } from 'kysely';

/** @param {import('kysely').Kysely<unknown>} db */
export async function up(db) {
  await sql`
    CREATE TABLE IF NOT EXISTS roles_permissions (
      "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      "role_id" UUID NOT NULL REFERENCES roles (id),
      "permission_id" UUID NOT NULL REFERENCES permissions (id),
      "created_at" TIMESTAMP NOT NULL DEFAULT NOW(),
      "updated_at" TIMESTAMP,
      "deleted_at" TIMESTAMP,
      UNIQUE ("role_id", "permission_id")
    );

    CREATE INDEX "roles_permissions_role_id_index" ON roles_permissions("role_id");
    CREATE INDEX "roles_permissions_permission_id_index" ON roles_permissions("permission_id");
    CREATE INDEX "roles_permissions_created_at_index" ON roles_permissions("created_at");
    CREATE INDEX "roles_permissions_updated_at_index" ON roles_permissions("updated_at");
    CREATE INDEX "roles_permissions_deleted_at_index" ON roles_permissions("deleted_at");

    ALTER TABLE roles_permissions ENABLE ROW LEVEL SECURITY;
  `.execute(db);
}

/** @param {import('kysely').Kysely<unknown>} db */
export async function down(db) {
  await sql`DROP TABLE IF EXISTS roles_permissions`.execute(db);
}
