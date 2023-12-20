import { StatusCodes } from 'http-status-codes';
import { useSession } from 'sst/node/auth';
import { z } from 'zod';
import { UserSessionField } from '../constants';
import { UserField } from '../database/constants';
import { createHandler } from '../helpers/handler.helper';
import { usersService } from '../services/users.service';
import {
  createArchiveHandler,
  createDestroyHandler,
  createGetHandler,
  createListHandler,
  createPatchHandler,
  createPostHandler,
} from './common';

export const list = createListHandler(usersService);
export const get = createGetHandler(usersService);
export const post = createPostHandler(
  usersService,
  z.object({
    [UserField.Email]: z.string().email().trim(),
    [UserField.Username]: z.string().trim().optional(),
    [UserField.FirstName]: z.string().trim().optional(),
    [UserField.LastName]: z.string().trim().optional(),
  })
);
export const patch = createPatchHandler(
  usersService,
  z.object({
    [UserField.Email]: z.string().email().trim().optional(),
    [UserField.Username]: z.string().trim().optional(),
    [UserField.FirstName]: z.string().trim().optional(),
    [UserField.LastName]: z.string().trim().optional(),
  })
);
export const destroy = createDestroyHandler(usersService);
export const archive = createArchiveHandler(usersService);

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
