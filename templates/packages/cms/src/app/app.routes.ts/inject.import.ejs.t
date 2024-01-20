---
to: packages/cms/src/app/app.routes.ts
inject: true
after: import
skip_if: <%= h.inflection.camelize(tableName) %>Component
---
<% const dasherizedName = h.inflection.dasherize(tableName) %><% _%>
<% const dasherizedSingularName = h.inflection.dasherize(dasherizedName) %><% _%>
<% const pascalizedName = h.inflection.camelize(tableName) %><% _%>
<% const pascalizedSingularName = h.inflection.singularize(pascalizedName) %><% _%>
import { <%= pascalizedSingularName %>FormComponent } from './pages/<%= dasherizedName %>/components/<%= dasherizedSingularName %>-form/<%= dasherizedSingularName %>-form.component';<% _%>
import { <%= pascalizedName %>TableComponent } from './pages/<%= dasherizedName %>/components/<%= dasherizedName %>-table/<%= dasherizedName %>-table.component';<% _%>
import { <%= pascalizedName %>Component } from './pages/<%= dasherizedName %>/<%= dasherizedName %>.component';<% _%>
