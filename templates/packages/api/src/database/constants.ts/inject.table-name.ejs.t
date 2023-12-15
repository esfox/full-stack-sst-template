---
to: packages/api/database/constants.ts
inject: true
after: 'TableName {'
skip_if: <%= h.inflection.camelize(tableName) %>
---
<%= h.inflection.camelize(tableName) %> = '<%= tableName %>',
