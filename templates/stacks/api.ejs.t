---
to: stacks/api.ts
---
import { Api, type StackContext } from 'sst/constructs';
import { Secrets } from './secrets';

const apiHandlersPath = 'packages/api/handlers';

export function API({ stack }: StackContext) {
  const { DB_CONNECTION } = Secrets(stack);

  const api = new Api(stack, 'API', {
    routes: {
      'GET /docs': `${apiHandlersPath}/docs.handler`,
      'GET /swagger.json': `${apiHandlersPath}/docs.handler`,

      <% for (const table of allTables) { %><% _%>
        <% const dasherizedName = h.inflection.dasherize(table.tableName) %><% _%>
        'GET /<%= dasherizedName %>': `${apiHandlersPath}/<%= dasherizedName %>.list`,
        'GET /<%= dasherizedName %>/{id}': `${apiHandlersPath}/<%= dasherizedName %>.get`,
        'POST /<%= dasherizedName %>': `${apiHandlersPath}/<%= dasherizedName %>.post`,
        'PATCH /<%= dasherizedName %>/{id}': `${apiHandlersPath}/<%= dasherizedName %>.patch`,
        'DELETE /<%= dasherizedName %>/{id}': `${apiHandlersPath}/<%= dasherizedName %>.destroy`,
        'DELETE /<%= dasherizedName %>/{id}/archive': `${apiHandlersPath}/<%= dasherizedName %>.archive`,

      <% } %>
    },
  });

  api.bind([DB_CONNECTION]);

  stack.addOutputs({
    ApiEndpoint: api.url,
  });

  return { api };
}
