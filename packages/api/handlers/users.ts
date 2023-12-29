import { StatusCodes } from 'http-status-codes';
import { DatabaseError } from 'pg';
import { useSession } from 'sst/node/auth';
import { z } from 'zod';
import { PostgresErrorCode, UserSessionField } from '../constants';
import { Permission } from '../constants/permissions';
import { UserField } from '../database/constants';
import { createHandler } from '../helpers/handler.helper';
import { usersRolesService } from '../services/users-roles.service';
import { usersService } from '../services/users.service';
import {
  createArchiveHandler,
  createDestroyHandler,
  createGetHandler,
  createListHandler,
  createPatchHandler,
  createPostHandler,
} from './common';

export const list = createListHandler(usersService, Permission.ReadUsers);
export const get = createGetHandler(usersService, Permission.ReadUsers);
export const post = createPostHandler(
  usersService,
  z.object({
    [UserField.Email]: z.string().email().trim(),
    [UserField.Username]: z.string().trim().optional(),
    [UserField.FirstName]: z.string().trim().optional(),
    [UserField.LastName]: z.string().trim().optional(),
  }),
  Permission.AddUsers
);
export const patch = createPatchHandler(
  usersService,
  z.object({
    [UserField.Email]: z.string().email().trim().optional(),
    [UserField.Username]: z.string().trim().optional(),
    [UserField.FirstName]: z.string().trim().optional(),
    [UserField.LastName]: z.string().trim().optional(),
  }),
  Permission.EditUsers
);
export const destroy = createDestroyHandler(usersService, Permission.DeleteUsers);
export const archive = createArchiveHandler(usersService, Permission.DeleteUsers);

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

export const getRoles = createHandler({
  requiredPermission: Permission.ReadUsers,
  validationSchema: {
    pathParameters: z.object({ id: z.string().uuid() }),
  },
  handler: async ({ pathParameters }) => {
    const id = pathParameters.id;
    const records = await usersRolesService.getUserRoles(id);

    return {
      statusCode: StatusCodes.OK,
      body: { records },
    };
  },
});

export const setRoles = createHandler({
  requiredPermission: Permission.EditUsers,
  validationSchema: {
    pathParameters: z.object({ id: z.string().uuid() }),
    body: z.string().uuid().array(),
  },
  handler: async ({ pathParameters, body }) => {
    const userId = pathParameters.id;
    const roleIds = body;

    try {
      const records = await usersRolesService.setUserRoles(userId, roleIds);
      return {
        statusCode: StatusCodes.OK,
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
