import { sql } from 'kysely';

/** @param {import('kysely').Kysely<unknown>} db */
export async function up(db) {
  await sql`
    CREATE TABLE IF NOT EXISTS aircrafts (
      "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      "name" VARCHAR(255) NOT NULL,
      "type" VARCHAR(255) NOT NULL,
      "registry" VARCHAR(255) NOT NULL,
      "created_at" TIMESTAMP NOT NULL DEFAULT NOW(),
      "updated_at" TIMESTAMP,
      "deleted_at" TIMESTAMP
    );

    CREATE INDEX "aircrafts_name_index" ON aircrafts("name");
    CREATE INDEX "aircrafts_created_at_index" ON aircrafts("created_at");
    CREATE INDEX "aircrafts_updated_at_index" ON aircrafts("updated_at");
    CREATE INDEX "aircrafts_deleted_at_index" ON aircrafts("deleted_at");

    ALTER TABLE aircrafts ENABLE ROW LEVEL SECURITY;
  `.execute(db);
}

/** @param {import('kysely').Kysely<unknown>} db */
export async function down(db) {
  await sql`DROP TABLE IF EXISTS aircrafts;`.execute(db);
}
