/* eslint-disable no-param-reassign */
import middy from '@middy/core';
import bodyParser from '@middy/http-json-body-parser';
import { type APIGatewayProxyEventV2, type APIGatewayProxyStructuredResultV2 } from 'aws-lambda';
import { StatusCodes } from 'http-status-codes';
import { ApiHandler } from 'sst/node/api';
import { useSession } from 'sst/node/auth';
import { z, type ZodSchema } from 'zod';
import { UserSessionField } from '../constants';
import { usersRolesService } from '../services/users-roles.service';
import { PermissionField } from '../database/constants';

const commonHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Credentials': true,
  'Content-Type': 'application/json',
};

type HandlerEvent<B, Q, H, P> = Omit<
  APIGatewayProxyEventV2,
  'body' | 'headers' | 'pathParameters' | 'queryStringParameters'
> & {
  body: B;
  headers: H;
  pathParameters: P;
  queryStringParameters: Q;
};

type Handler<B, Q, H, P> = (event: HandlerEvent<B, Q, H, P>) => Promise<ApiResponse>;

type CreateHandlerParams<B, Q, H, P> = {
  validationSchema?: {
    body?: ZodSchema<B>;
    headers?: ZodSchema<H>;
    pathParameters?: ZodSchema<P>;
    queryStringParameters?: ZodSchema<Q>;
  };
  handler: (event: HandlerEvent<B, Q, H, P>) => Promise<ApiResponse>;
  serializeBody?: boolean;
  needsAuthorization?: boolean;
  requiredPermission?: string;
};

type ApiResponse = Omit<APIGatewayProxyStructuredResultV2, 'body'> & {
  body?: { [key: string]: unknown } | string | unknown;
};

export function createHandler<B, Q, H, P>({
  validationSchema,
  handler,
  serializeBody = true,
  needsAuthorization = true,
  requiredPermission,
}: CreateHandlerParams<B, Q, H, P>) {
  const before: middy.MiddlewareFn<APIGatewayProxyEventV2, APIGatewayProxyStructuredResultV2> = ({
    event,
  }) => {
    if (!validationSchema) {
      return;
    }

    if (event.queryStringParameters) {
      const queryParams = event.queryStringParameters as { [key: string]: string | string[] };
      for (const key in queryParams) {
        const value = queryParams[key];
        const hasMultipleValues = key.includes('[]') || value?.includes(',');
        if (value && !Array.isArray(value) && hasMultipleValues) {
          const newValue = value.split(',');
          queryParams[key] = newValue;
        }
      }

      event.queryStringParameters = queryParams as APIGatewayProxyEventV2['queryStringParameters'];
    }

    const validationResult = z.object(validationSchema).safeParse(event);
    if (validationResult.success === false) {
      // eslint-disable-next-line consistent-return
      return {
        headers: commonHeaders,
        statusCode: StatusCodes.BAD_REQUEST,
        body: JSON.stringify(validationResult.error),
      };
    }

    const { body, headers, queryStringParameters, pathParameters } = validationResult.data;
    if (body) {
      event.body = body as APIGatewayProxyEventV2['body'];
    }

    if (headers) {
      event.headers = headers as APIGatewayProxyEventV2['headers'];
    }

    if (queryStringParameters) {
      event.queryStringParameters =
        queryStringParameters as APIGatewayProxyEventV2['queryStringParameters'];
    }

    if (pathParameters) {
      event.pathParameters = pathParameters as APIGatewayProxyEventV2['pathParameters'];
    }
  };

  const after: middy.MiddlewareFn<
    APIGatewayProxyEventV2,
    APIGatewayProxyStructuredResultV2
  > = event => {
    if (!serializeBody || !event.response) {
      return;
    }

    event.response.headers = { ...commonHeaders, ...event.response.headers };

    const { body } = event.response;
    if (typeof body !== 'object') {
      return;
    }

    event.response.body = JSON.stringify(body);
  };

  let newHandler = handler;
  if (needsAuthorization) {
    // @ts-ignore we need to keep the typing of `handler` while still being able to wrap it in `ApiHandler`
    newHandler = getAuthorizedHandler(handler, requiredPermission);
  }

  return middy(newHandler)
    .use(bodyParser({ disableContentTypeError: true }))
    .use({ before, after });
}

function getAuthorizedHandler<B, Q, H, P>(
  handler: Handler<B, Q, H, P>,
  requiredPermission?: string
) {
  // @ts-ignore we need to keep the typing of `handler` while still being able to wrap it in `ApiHandler`
  const newHandler = ApiHandler(async event => {
    let session;
    try {
      session = useSession();
    } catch (error) {
      /* handle error */
      console.error(error);
    }

    if (!session) {
      return { statusCode: StatusCodes.UNAUTHORIZED };
    }

    const isUserSession = session.type === 'user';
    let userId;
    if (isUserSession && UserSessionField.UserId in session.properties) {
      userId = session.properties.userId;
    } else {
      return { statusCode: StatusCodes.UNAUTHORIZED };
    }

    if (!requiredPermission) {
      return handler(event as HandlerEvent<B, Q, H, P>);
    }

    const permissions = await usersRolesService.getUserPermissions(userId);
    const permissionIds = permissions.map(permission => permission[PermissionField.Id]);
    if (!permissionIds.includes(requiredPermission)) {
      return { statusCode: StatusCodes.FORBIDDEN };
    }

    return handler(event as HandlerEvent<B, Q, H, P>);
  });

  return newHandler;
}
