---
to: packages/cms/src/app/types.ts
inject: true
append: true
skip_if: <%= h.inflection.transform(tableName, [ 'camelize', 'singularize' ]) %>Type
---

<% const pascalizedName = h.inflection.camelize(tableName) %>
export type <%= h.inflection.singularize(pascalizedName) %>Type = {
  <% for (const column of columns) { %>
    <%= h.inflection.camelize(column.name, true) %><%= column.isNullable ? '?' : '' %>: <%= column.type %>;<% _%>
  <% } %>
};
