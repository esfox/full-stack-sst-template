import { sql } from 'kysely';

/** @param {import('kysely').Kysely<unknown>} db */
export async function up(db) {
  await sql`
    ALTER TABLE users ADD google_id VARCHAR(255) UNIQUE;
    ALTER TABLE users ADD google_picture_url TEXT;
    CREATE UNIQUE INDEX "users_google_id_index" ON users("google_id");
  `.execute(db);
}

/** @param {import('kysely').Kysely<unknown>} db */
export async function down(db) {
  await sql`
    ALTER TABLE users DROP COLUMN google_id;
    ALTER TABLE users DROP COLUMN google_picture_url;
    DROP INDEX IF EXISTS "users_google_id_index";
  `.execute(db);
}
