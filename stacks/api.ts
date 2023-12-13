import { Api, Auth, Config, type StackContext } from 'sst/constructs';
import { Secrets } from './secrets';

const apiHandlersPath = 'packages/api/handlers';

/* In the meantime, while there is no domain yet, the site URL
  is hard-coded here to be used for the CORS settings and auth redirect. */
const siteUrl = 'http://localhost:4200';
// const siteUrl = 'https://d2n4r35so6zs4r.cloudfront.net';

export function API({ stack }: StackContext) {
  const { DB_CONNECTION, GOOGLE_CLIENT_ID } = Secrets(stack);

  /* In the meantime, while there is no domain yet, the origins
    to be included here should be explicitly written. */
  const CMS_URL = new Config.Parameter(stack, 'CMS_URL', { value: siteUrl });

  const api = new Api(stack, 'API', {
    routes: {
      'GET /docs': `${apiHandlersPath}/docs.handler`,
      'GET /swagger.json': `${apiHandlersPath}/docs.handler`,

      'GET /roles': `${apiHandlersPath}/roles.list`,
      'GET /roles/{id}': `${apiHandlersPath}/roles.get`,
      'POST /roles': `${apiHandlersPath}/roles.post`,
      'PATCH /roles/{id}': `${apiHandlersPath}/roles.patch`,
      'DELETE /roles/{id}': `${apiHandlersPath}/roles.destroy`,
      'DELETE /roles/{id}/archive': `${apiHandlersPath}/roles.archive`,

      'GET /me': `${apiHandlersPath}/users.me`,
      'GET /users': `${apiHandlersPath}/users.list`,
      'GET /users/{id}': `${apiHandlersPath}/users.get`,
      'POST /users': `${apiHandlersPath}/users.post`,
      'PATCH /users/{id}': `${apiHandlersPath}/users.patch`,
      'DELETE /users/{id}': `${apiHandlersPath}/users.destroy`,
      'DELETE /users/{id}/archive': `${apiHandlersPath}/users.archive`,
    },
    cors: {
      allowCredentials: true,
      allowHeaders: ['content-type'],
      allowMethods: ['GET', 'DELETE', 'POST', 'PUT', 'PATCH', 'OPTIONS'],
      allowOrigins: ['http://localhost:4200' /* siteUrl */],
    },
  });

  api.bind([DB_CONNECTION, GOOGLE_CLIENT_ID, CMS_URL]);

  stack.addOutputs({
    ApiEndpoint: api.url,
  });

  const auth = new Auth(stack, 'auth', {
    authenticator: {
      handler: `${apiHandlersPath}/auth.handler`,
    },
  });

  auth.attach(stack, {
    api,
    prefix: '/auth',
  });

  return { api };
}
