import { z } from 'zod';
import { Permission } from '../constants/permissions';
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

export const list = createListHandler(permissionsService, Permission.ReadPermissions);
export const get = createGetHandler(permissionsService, Permission.ReadPermissions);
export const post = createPostHandler(
  permissionsService,
  z.object({
    [PermissionField.Name]: z.string().trim(),
  }),
  Permission.AddPermissions
);
export const patch = createPatchHandler(
  permissionsService,
  z.object({
    [PermissionField.Name]: z.string().trim().optional(),
  }),
  Permission.EditPermissions
);
export const destroy = createDestroyHandler(permissionsService, Permission.DeletePermissions);
export const archive = createArchiveHandler(permissionsService, Permission.DeletePermissions);
