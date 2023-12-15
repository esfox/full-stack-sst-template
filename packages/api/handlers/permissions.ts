import { StatusCodes } from 'http-status-codes';
import { z } from 'zod';
import { PermissionField } from '../database/constants';
import { createHandler } from '../helpers/handler.helper';
import { permissionsService } from '../services/permissions.service';

export const list = createHandler({
  handler: async () => {
    const { records, totalRecords } = await permissionsService.findAll();

    return {
      statusCode: StatusCodes.OK,
      body: { records, totalRecords },
    };
  },
});

export const get = createHandler({
  validationSchema: {
    pathParameters: z.object({ [PermissionField.Id]: z.string().uuid() }),
  },
  handler: async ({ pathParameters }) => {
    const id = pathParameters[PermissionField.Id];
    const record = await permissionsService.findOne({ id });

    return {
      statusCode: StatusCodes.OK,
      body: { record },
    };
  },
});

export const post = createHandler({
  validationSchema: {
    body: z.object({
      [PermissionField.Name]: z.string().trim(),
    }),
  },
  handler: async ({ body }) => {
    const record = await permissionsService.create({ data: body });

    return {
      statusCode: StatusCodes.CREATED,
      body: { record },
    };
  },
});

export const patch = createHandler({
  validationSchema: {
    body: z.object({
      [PermissionField.Name]: z.string().trim(),
    }),
    pathParameters: z.object({ [PermissionField.Id]: z.string().uuid() }),
  },
  handler: async ({ body, pathParameters }) => {
    const id = pathParameters[PermissionField.Id];
    const record = await permissionsService.update({ id, data: body });

    return {
      statusCode: StatusCodes.OK,
      body: { record },
    };
  },
});

export const destroy = createHandler({
  validationSchema: {
    pathParameters: z.object({ [PermissionField.Id]: z.string().uuid() }),
  },
  handler: async ({ pathParameters }) => {
    const id = pathParameters[PermissionField.Id];
    const record = await permissionsService.delete({ id });

    return {
      statusCode: StatusCodes.OK,
      body: { record },
    };
  },
});

export const archive = createHandler({
  validationSchema: {
    pathParameters: z.object({ [PermissionField.Id]: z.string().uuid() }),
  },
  handler: async ({ pathParameters }) => {
    const id = pathParameters[PermissionField.Id];
    const record = await permissionsService.delete({ id, softDelete: true });

    return {
      statusCode: StatusCodes.OK,
      body: { record },
    };
  },
});
