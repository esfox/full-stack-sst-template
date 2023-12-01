import { sql } from 'kysely';

/** @param {import('kysely').Kysely<unknown>} db */
export async function up(db) {
  await sql`
    CREATE TABLE IF NOT EXISTS roles (
      "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      "name" VARCHAR(255) UNIQUE NOT NULL,
      "created_at" TIMESTAMP NOT NULL DEFAULT NOW(),
      "updated_at" TIMESTAMP,
      "deleted_at" TIMESTAMP
    );

    CREATE UNIQUE INDEX "roles_name_index" ON roles("name");
    CREATE INDEX "roles_created_at_index" ON roles("created_at");
    CREATE INDEX "roles_updated_at_index" ON roles("updated_at");
    CREATE INDEX "roles_deleted_at_index" ON roles("deleted_at");

    ALTER TABLE roles ENABLE ROW LEVEL SECURITY;
  `.execute(db);
}

/** @param {import('kysely').Kysely<unknown>} db */
export async function down(db) {
  await sql`DROP TABLE IF EXISTS roles`.execute(db);
}
