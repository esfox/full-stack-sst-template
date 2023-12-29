/* eslint-disable no-console */
import { execSync } from 'child_process';
import dotenv from 'dotenv';
import { writeFileSync } from 'fs';
import { titleize } from 'inflection';
import { Kysely, PostgresDialect, sql } from 'kysely';
import pg from 'pg';
import prompts from 'prompts';

dotenv.config();

type PermissionType = { id: string; name: string; created_at: string };

const permissionsConstantsPath = './packages/api/constants/permissions.ts';
const standardPermissions = ['Read', 'Add', 'Edit', 'Delete'];

export const db = new Kysely<unknown>({
  dialect: new PostgresDialect({
    pool: new pg.Pool({
      connectionString: process.env.DB_CONNECTION,
    }),
  }),
});

async function promptResource() {
  const { resource } = await prompts({
    type: 'text',
    name: 'resource',
    message: 'Name of the resource or module to create permissions for',
  });

  return resource as string;
}

function createPermissionsArray(resource: string) {
  const permissions: string[] = [];
  standardPermissions.forEach(prefix => {
    const titleizedResource = titleize(resource);
    permissions.push(`${prefix} ${titleizedResource}`);
  });

  return permissions;
}

async function getPermissionsData(permissionNames: string[]) {
  const { rows } = await sql`
    SELECT * FROM permissions
    WHERE name IN (${sql.raw(permissionNames.map(name => `'${name}'`).join(','))})
  `.execute(db);

  return rows as PermissionType[];
}

async function insertPermissionsData(permissions: string[]) {
  const { rows } = await sql`
    INSERT INTO permissions (name)
    VALUES ${sql.raw(permissions.map(permission => `('${permission}')`).join(','))}
    ON CONFLICT (name) DO NOTHING
  `.execute(db);

  return rows;
}

async function createPermissionConstants() {
  const queryResult = await sql`SELECT * FROM permissions`.execute(db);
  const permissions = queryResult.rows as PermissionType[];
  const sortedPermissions = permissions.sort(
    (a, b) => new Date(a.created_at) - new Date(b.created_at)
  );

  let enumCode = 'export enum Permission {\n';
  const enumMembers: string[] = [];
  sortedPermissions.forEach(permission => {
    enumMembers.push(`'${permission.name.replace(/\s/g, '')}' = '${permission.id}'`);
  });

  enumCode += `${enumMembers.join(',\n')}\n}`;

  writeFileSync(permissionsConstantsPath, enumCode, 'utf8');
  execSync(`prettier --write '${permissionsConstantsPath}'`);
}

// eslint-disable-next-line @typescript-eslint/no-floating-promises
(async () => {
  const resource = await promptResource();
  const permissions = createPermissionsArray(resource);
  await insertPermissionsData(permissions);
  await getPermissionsData(permissions);
  await createPermissionConstants();

  console.log(
    `✔️ Successfully created permissions for ${resource}`,
    `\n🔔 Please check '${permissionsConstantsPath}' for the generated permission constants`
  );

  process.exit();
})();
