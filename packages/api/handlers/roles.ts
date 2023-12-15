import { StatusCodes } from 'http-status-codes';
import { DatabaseError } from 'pg';
import { z } from 'zod';
import { PostgresErrorCode } from '../constants';
import { RoleField, RolePermissionField } from '../database/constants';
import { createHandler } from '../helpers/handler.helper';
import { rolesPermissionsService } from '../services/roles-permissions.service';
import { rolesService } from '../services/roles.service';

export const list = createHandler({
  handler: async () => {
    const { records, totalRecords } = await rolesService.findAll();

    return {
      statusCode: StatusCodes.OK,
      body: { records, totalRecords },
    };
  },
});

export const get = createHandler({
  validationSchema: {
    pathParameters: z.object({ [RoleField.Id]: z.string().uuid() }),
  },
  handler: async ({ pathParameters }) => {
    const id = pathParameters[RoleField.Id];
    const record = await rolesService.findOne({ id });

    return {
      statusCode: StatusCodes.OK,
      body: { record },
    };
  },
});

export const post = createHandler({
  validationSchema: {
    body: z.object({
      [RoleField.Name]: z.string().trim(),
    }),
  },
  handler: async ({ body }) => {
    const record = await rolesService.create({ data: body });

    return {
      statusCode: StatusCodes.CREATED,
      body: { record },
    };
  },
});

export const patch = createHandler({
  validationSchema: {
    body: z.object({
      [RoleField.Name]: z.string().trim(),
    }),
    pathParameters: z.object({ [RoleField.Id]: z.string().uuid() }),
  },
  handler: async ({ body, pathParameters }) => {
    const id = pathParameters[RoleField.Id];
    const record = await rolesService.update({ id, data: body });

    return {
      statusCode: StatusCodes.OK,
      body: { record },
    };
  },
});

export const destroy = createHandler({
  validationSchema: {
    pathParameters: z.object({ [RoleField.Id]: z.string().uuid() }),
  },
  handler: async ({ pathParameters }) => {
    const id = pathParameters[RoleField.Id];
    const record = await rolesService.delete({ id });

    return {
      statusCode: StatusCodes.OK,
      body: { record },
    };
  },
});

export const archive = createHandler({
  validationSchema: {
    pathParameters: z.object({ [RoleField.Id]: z.string().uuid() }),
  },
  handler: async ({ pathParameters }) => {
    const id = pathParameters[RoleField.Id];
    const record = await rolesService.delete({ id, softDelete: true });

    return {
      statusCode: StatusCodes.OK,
      body: { record },
    };
  },
});

export const getPermissions = createHandler({
  validationSchema: {
    pathParameters: z.object({ [RoleField.Id]: z.string().uuid() }),
  },
  handler: async ({ pathParameters }) => {
    const id = pathParameters[RoleField.Id];
    const records = await rolesPermissionsService.getPermissionsByRole(id);

    return {
      statusCode: StatusCodes.OK,
      body: { records },
    };
  },
});

export const addPermissions = createHandler({
  validationSchema: {
    pathParameters: z.object({ [RoleField.Id]: z.string().uuid() }),
    body: z.string().uuid().array(),
  },
  handler: async ({ pathParameters, body }) => {
    const roleId = pathParameters[RoleField.Id];
    const permissionIds = body;

    const rolePermissionsData = permissionIds.map(permissionId => ({
      [RolePermissionField.RoleId]: roleId,
      [RolePermissionField.PermissionId]: permissionId,
    }));

    try {
      const records = await rolesPermissionsService.create({ data: rolePermissionsData });
      return {
        statusCode: StatusCodes.CREATED,
        body: { records },
      };
    } catch (error) {
      if (!(error instanceof DatabaseError)) {
        throw error;
      }

      switch (error.code) {
        case PostgresErrorCode.ForeignKeyViolation:
        case PostgresErrorCode.UniqueViolation:
          return { statusCode: StatusCodes.BAD_REQUEST };

        default:
          console.error(error);
          return { statusCode: StatusCodes.INTERNAL_SERVER_ERROR };
      }
    }
  },
});

export const removePermissions = createHandler({
  validationSchema: {
    pathParameters: z.object({ [RoleField.Id]: z.string().uuid() }),
    queryStringParameters: z.object({
      permissionIds: z.union([z.string().uuid().array(), z.string().uuid()]),
    }),
  },
  handler: async ({ pathParameters, queryStringParameters }) => {
    const roleId = pathParameters[RoleField.Id];
    const permissionIds = queryStringParameters.permissionIds;

    const records = await rolesPermissionsService.deleteByIds(roleId, permissionIds);
    return {
      statusCode: StatusCodes.OK,
      body: { records },
    };
  },
});
