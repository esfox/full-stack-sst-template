---
to: packages/cms/src/app/app.routes.ts
inject: true
skip_if: 'component: <%= h.inflection.camelize(tableName) %>Component'
before: '];'
---
<% const dasherizedName = h.inflection.dasherize(tableName) %><% _%>
<% const pascalizedName = h.inflection.camelize(tableName) %><% _%>
{
  path: '<%= dasherizedName %>',
  component: <%= pascalizedName %>Component,
  data: {
    label: '<%= pascalizedName %>',
    icon: 'fa fa-circle-exclamation', // TODO: Change the icon
  },
},
