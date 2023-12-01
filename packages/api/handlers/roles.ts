import { StatusCodes } from 'http-status-codes';
import { z } from 'zod';
import { RoleField } from '../database/constants';
import { createHandler } from '../helpers/handler.helper';
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
