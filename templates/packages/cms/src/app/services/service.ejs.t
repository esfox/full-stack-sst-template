---
to: packages/cms/src/app/services/<%= h.inflection.dasherize(tableName) %>.service.ts
---
<% const dasherizedName = h.inflection.dasherize(tableName) %><% _%>
<% const pascalizedName = h.inflection.camelize(tableName) %><% _%>
<% const pascalizedSingularName = h.inflection.singularize(pascalizedName) %><% _%>
<%_ _%>
import { Injectable } from '@angular/core';
import { <%= pascalizedSingularName %>Type } from '../types';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root',
})
export class <%= pascalizedName %>Service extends ApiService<<%= pascalizedSingularName %>Type> {
  constructor() {
    super({
      basePath: '/<%= dasherizedName %>',
      dataMapping: [
        <% for (const column of columns) { %>
          { apiField: '<%= column.name %>', mappedField: '<%= h.inflection.camelize(column.name, true) %>' },<%_ _%>
        <% } %>
      ],
    });
  }
}
