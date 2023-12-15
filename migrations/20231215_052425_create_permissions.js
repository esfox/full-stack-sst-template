import { sql } from 'kysely';

/** @param {import('kysely').Kysely<unknown>} db */
export async function up(db) {
  await sql`
    CREATE TABLE IF NOT EXISTS permissions (
      "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      "name" VARCHAR(255) UNIQUE NOT NULL,
      "created_at" TIMESTAMP NOT NULL DEFAULT NOW(),
      "updated_at" TIMESTAMP,
      "deleted_at" TIMESTAMP
    );

    CREATE UNIQUE INDEX "permissions_name_index" ON permissions("name");
    CREATE INDEX "permissions_created_at_index" ON permissions("created_at");
    CREATE INDEX "permissions_updated_at_index" ON permissions("updated_at");
    CREATE INDEX "permissions_deleted_at_index" ON permissions("deleted_at");

    ALTER TABLE permissions ENABLE ROW LEVEL SECURITY;
  `.execute(db);
}

/** @param {import('kysely').Kysely<unknown>} db */
export async function down(db) {
  await sql`DROP TABLE IF EXISTS permissions`.execute(db);
}
