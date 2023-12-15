---
to: stacks/api.ts
inject: true
after: 'routes: {'
skip_if: 'GET /<%= h.inflection.dasherize(tableName) %>'
---
<% const dasherizedName = h.inflection.dasherize(tableName) %><% _%>
'GET /<%= dasherizedName %>': `${apiHandlersPath}/<%= dasherizedName %>.list`,
'GET /<%= dasherizedName %>/{id}': `${apiHandlersPath}/<%= dasherizedName %>.get`,
'POST /<%= dasherizedName %>': `${apiHandlersPath}/<%= dasherizedName %>.post`,
'PATCH /<%= dasherizedName %>/{id}': `${apiHandlersPath}/<%= dasherizedName %>.patch`,
'DELETE /<%= dasherizedName %>/{id}': `${apiHandlersPath}/<%= dasherizedName %>.destroy`,
'DELETE /<%= dasherizedName %>/{id}/archive': `${apiHandlersPath}/<%= dasherizedName %>.archive`,

