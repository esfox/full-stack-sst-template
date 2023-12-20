import { z } from 'zod';
import { PermissionField } from '../database/constants';
import { permissionsService } from '../services/permissions.service';
import {
  createArchiveHandler,
  createDestroyHandler,
  createGetHandler,
  createListHandler,
  createPatchHandler,
  createPostHandler,
} from './common';

export const list = createListHandler(permissionsService);
export const get = createGetHandler(permissionsService);
export const post = createPostHandler(
  permissionsService,
  z.object({
    [PermissionField.Name]: z.string().trim(),
  })
);
export const patch = createPatchHandler(
  permissionsService,
  z.object({
    [PermissionField.Name]: z.string().trim().optional(),
  })
);
export const destroy = createDestroyHandler(permissionsService);
export const archive = createArchiveHandler(permissionsService);
