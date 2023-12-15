/* eslint-disable no-param-reassign */
import middy from '@middy/core';
import bodyParser from '@middy/http-json-body-parser';
import { type APIGatewayProxyEventV2, type APIGatewayProxyStructuredResultV2 } from 'aws-lambda';
import { StatusCodes } from 'http-status-codes';
import { ApiHandler } from 'sst/node/api';
import { useSession } from 'sst/node/auth';
import { z, type ZodSchema } from 'zod';
import { UserSessionField } from '../constants';

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
};

type ApiResponse = Omit<APIGatewayProxyStructuredResultV2, 'body'> & {
  body?: { [key: string]: unknown } | string | unknown;
};

export function createHandler<B, Q, H, P>({
  validationSchema,
  handler,
  serializeBody = true,
  needsAuthorization: needAuthentication = true,
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
  if (needAuthentication) {
    // @ts-ignore we need to keep the typing of `handler` while still being able to wrap it in `ApiHandler`
    newHandler = ApiHandler(async event => {
      let authorized = false;
      try {
        const session = useSession();
        const isUserSession = session.type === 'user';
        const hasUserId = UserSessionField.UserId in session.properties;
        authorized = isUserSession && hasUserId;
      } catch (error) {
        /* handle error */
        console.error(error);
      }

      if (!authorized) {
        return { statusCode: StatusCodes.UNAUTHORIZED };
      }

      return handler(event as HandlerEvent<B, Q, H, P>);
    });
  }

  return middy(newHandler)
    .use(bodyParser({ disableContentTypeError: true }))
    .use({ before, after });
}
