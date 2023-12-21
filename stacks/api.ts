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
      'GET /permissions': `${apiHandlersPath}/permissions.list`,
      'GET /permissions/{id}': `${apiHandlersPath}/permissions.get`,
      'POST /permissions': `${apiHandlersPath}/permissions.post`,
      'PATCH /permissions/{id}': `${apiHandlersPath}/permissions.patch`,
      'DELETE /permissions/{id}': `${apiHandlersPath}/permissions.destroy`,
      'DELETE /permissions/{id}/archive': `${apiHandlersPath}/permissions.archive`,

      'GET /roles': `${apiHandlersPath}/roles.list`,
      'GET /roles/{id}': `${apiHandlersPath}/roles.get`,
      'POST /roles': `${apiHandlersPath}/roles.post`,
      'PATCH /roles/{id}': `${apiHandlersPath}/roles.patch`,
      'DELETE /roles/{id}': `${apiHandlersPath}/roles.destroy`,
      'DELETE /roles/{id}/archive': `${apiHandlersPath}/roles.archive`,
      'GET /roles/{id}/permissions': `${apiHandlersPath}/roles.getPermissions`,
      'PUT /roles/{id}/permissions': `${apiHandlersPath}/roles.setPermissions`,
      'DELETE /roles/{id}/permissions': `${apiHandlersPath}/roles.removePermissions`,

      'GET /me': `${apiHandlersPath}/users.me`,
      'GET /users': `${apiHandlersPath}/users.list`,
      'GET /users/{id}': `${apiHandlersPath}/users.get`,
      'POST /users': `${apiHandlersPath}/users.post`,
      'PATCH /users/{id}': `${apiHandlersPath}/users.patch`,
      'DELETE /users/{id}': `${apiHandlersPath}/users.destroy`,
      'DELETE /users/{id}/archive': `${apiHandlersPath}/users.archive`,
      'GET /users/{id}/roles': `${apiHandlersPath}/users.getRoles`,
      'PUT /users/{id}/roles': `${apiHandlersPath}/users.setRoles`,

      'POST /logout': `${apiHandlersPath}/auth.logout`,

      'GET /docs': `${apiHandlersPath}/docs.handler`,
      'GET /swagger.json': `${apiHandlersPath}/docs.handler`,
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
