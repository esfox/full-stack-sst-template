---
to: packages/api/database/constants.ts
inject: true
after: '}'
skip_if: <%= h.inflection.transform(tableName, [ 'camelize', 'singularize' ]) %>Field
---

export enum <%= h.inflection.transform(tableName, [ 'camelize', 'singularize' ]) %>Field {<% _%>
<% for (const column of columns) { %>
  <%= h.inflection.camelize(column.name) %> = '<%= column.name %>',<%_ _%>
<% } %>
}

