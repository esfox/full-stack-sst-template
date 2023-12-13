import { StatusCodes } from 'http-status-codes';
import { useSession } from 'sst/node/auth';
import { z } from 'zod';
import { UserField } from '../database/constants';
import { createHandler } from '../helpers/handler.helper';
import { usersService } from '../services/users.service';
import { UserSessionField } from '../constants';

export const me = createHandler({
  handler: async () => {
    const { properties } = useSession();
    if (!(UserSessionField.UserId in properties) || !properties[UserSessionField.UserId]) {
      return {
        statusCode: StatusCodes.UNAUTHORIZED,
      };
    }

    const user = await usersService.findOne({ id: properties.userId });

    return {
      statusCode: StatusCodes.OK,
      body: { record: user },
    };
  },
});

export const list = createHandler({
  handler: async () => {
    const { records, totalRecords } = await usersService.findAll();

    return {
      statusCode: StatusCodes.OK,
      body: { records, totalRecords },
    };
  },
});

export const get = createHandler({
  validationSchema: {
    pathParameters: z.object({ [UserField.Id]: z.string().uuid() }),
  },
  handler: async ({ pathParameters }) => {
    const id = pathParameters[UserField.Id];
    const record = await usersService.findOne({ id });

    return {
      statusCode: StatusCodes.OK,
      body: { record },
    };
  },
});

export const post = createHandler({
  validationSchema: {
    body: z.object({
      [UserField.Email]: z.string().email().trim(),
      [UserField.Username]: z.string().trim().optional(),
      [UserField.FirstName]: z.string().trim().optional(),
      [UserField.LastName]: z.string().trim().optional(),
    }),
  },
  handler: async ({ body }) => {
    const record = await usersService.create({ data: body });

    return {
      statusCode: StatusCodes.CREATED,
      body: { record },
    };
  },
});

export const patch = createHandler({
  validationSchema: {
    body: z.object({
      [UserField.Email]: z.string().email().trim().optional(),
      [UserField.Username]: z.string().trim().optional(),
      [UserField.FirstName]: z.string().trim().optional(),
      [UserField.LastName]: z.string().trim().optional(),
    }),
    pathParameters: z.object({ [UserField.Id]: z.string().uuid() }),
  },
  handler: async ({ body, pathParameters }) => {
    const id = pathParameters[UserField.Id];
    const record = await usersService.update({ id, data: body });

    return {
      statusCode: StatusCodes.OK,
      body: { record },
    };
  },
});

export const destroy = createHandler({
  validationSchema: {
    pathParameters: z.object({ [UserField.Id]: z.string().uuid() }),
  },
  handler: async ({ pathParameters }) => {
    const id = pathParameters[UserField.Id];
    const record = await usersService.delete({ id });

    return {
      statusCode: StatusCodes.OK,
      body: { record },
    };
  },
});

export const archive = createHandler({
  validationSchema: {
    pathParameters: z.object({ [UserField.Id]: z.string().uuid() }),
  },
  handler: async ({ pathParameters }) => {
    const id = pathParameters[UserField.Id];
    const record = await usersService.delete({ id, softDelete: true });

    return {
      statusCode: StatusCodes.OK,
      body: { record },
    };
  },
});
