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
import { ResourceService } from './resource.service';

@Injectable({
  providedIn: 'root',
})
export class <%= pascalizedName %>Service extends ResourceService<<%= pascalizedSingularName %>Type> {
  constructor() {
    const apiService = new ApiService<<%= pascalizedSingularName %>Type>({
      basePath: '/<%= dasherizedName %>',
      dataMapping: [
        <% for (const column of columns) { %>
          { apiField: '<%= column.name %>', mappedField: '<%= h.inflection.camelize(column.name, true) %>' },<%_ _%>
        <% } %>
      ],
    });

    super(apiService);
  }
}
