---
to: packages/cms/src/app/app.routes.ts
inject: true
skip_if: 'component: <%= h.inflection.camelize(tableName) %>Component'
before: '];'
---
<% const dasherizedName = h.inflection.dasherize(tableName) %><% _%>
<% const pascalizedName = h.inflection.camelize(tableName) %><% _%>
<% const pascalizedSingularName = h.inflection.singularize(pascalizedName) %><% _%>
{
  path: '<%= dasherizedName %>',
  component: <%= pascalizedName %>Component,
  children: [
    {
      path: '',
      component: <%= pascalizedName %>TableComponent,
    },
    {
      path: 'add',
      component: <%= pascalizedSingularName %>FormComponent,
      data: {
        navTitle: 'Add <%= pascalizedSingularName %>',
      },
    },
    {
      path: 'edit/:id',
      component: <%= pascalizedSingularName %>FormComponent,
      data: {
        navTitle: 'Edit <%= pascalizedSingularName %>',
      },
    },
  ],
  data: {
    label: '<%= pascalizedName %>',
    icon: 'fa fa-circle-exclamation', // TODO: Change the icon
  },
},
