---
to: packages/cms/src/app/app.routes.ts
inject: true
after: DashboardComponent
skip_if: <%= h.inflection.camelize(tableName) %>Component
---
<% const dasherizedName = h.inflection.dasherize(tableName) %><% _%>
<% const pascalizedName = h.inflection.camelize(tableName) %><% _%>
import { <%= pascalizedName %>Component } from './pages/<%= dasherizedName %>/<%= dasherizedName %>.component';<% _%>
