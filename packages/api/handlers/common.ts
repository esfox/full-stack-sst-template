import { StatusCodes } from 'http-status-codes';
import { ZodSchema, z } from 'zod';
import { createHandler } from '../helpers/handler.helper';
import { SqlService } from '../services/sql.service';

export const createListHandler = (service: SqlService) =>
  createHandler({
    handler: async () => {
      const { records, totalRecords } = await service.findAll();
      return { statusCode: StatusCodes.OK, body: { records, totalRecords } };
    },
  });

export const createGetHandler = (service: SqlService) =>
  createHandler({
    validationSchema: { pathParameters: z.object({ id: z.string().uuid() }) },
    handler: async ({ pathParameters }) => {
      const id = pathParameters.id;
      const record = await service.findOne({ id });
      return { statusCode: StatusCodes.OK, body: { record } };
    },
  });

export const createPostHandler = (service: SqlService, bodyValidationSchema: ZodSchema) =>
  createHandler({
    validationSchema: {
      body: bodyValidationSchema,
    },
    handler: async ({ body }) => {
      const record = await service.create({ data: body });

      return {
        statusCode: StatusCodes.CREATED,
        body: { record },
      };
    },
  });

export const createPatchHandler = (service: SqlService, bodyValidationSchema: ZodSchema) =>
  createHandler({
    validationSchema: {
      body: bodyValidationSchema,
      pathParameters: z.object({ id: z.string().uuid() }),
    },
    handler: async ({ body, pathParameters }) => {
      const id = pathParameters.id;
      const record = await service.update({ id, data: body });

      return {
        statusCode: StatusCodes.OK,
        body: { record },
      };
    },
  });

export const createDestroyHandler = (service: SqlService) =>
  createHandler({
    validationSchema: {
      pathParameters: z.object({ id: z.string().uuid() }),
    },
    handler: async ({ pathParameters }) => {
      const id = pathParameters.id;
      const record = await service.delete({ id });

      return {
        statusCode: StatusCodes.OK,
        body: { record },
      };
    },
  });

export const createArchiveHandler = (service: SqlService) =>
  createHandler({
    validationSchema: {
      pathParameters: z.object({ id: z.string().uuid() }),
    },
    handler: async ({ pathParameters }) => {
      const id = pathParameters.id;
      const record = await service.delete({ id, softDelete: true });

      return {
        statusCode: StatusCodes.OK,
        body: { record },
      };
    },
  });
