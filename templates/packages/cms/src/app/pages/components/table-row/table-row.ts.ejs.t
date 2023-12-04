---
to: packages/cms/src/app/pages/<%= h.inflection.dasherize(tableName) %>/components/<%= h.inflection.dasherize(tableName) %>-table-row/<%= h.inflection.dasherize(tableName) %>-table-row.component.ts
---
<% const dasherizedName = h.inflection.dasherize(tableName) %><% _%>
<% const pascalizedName = h.inflection.camelize(tableName) %><% _%>
<% const pascalizedSingularName = h.inflection.singularize(pascalizedName) %><% _%>
<% const camelizedSingularName = h.inflection.singularize(h.inflection.camelize(tableName, true)) %><% _%>
import { CommonModule, DatePipe } from '@angular/common';
import { Component, Input } from '@angular/core';
import { BaseDataTableRowComponent } from '../../../../components/base-data-table-row/base-data-table-row.component';
import { <%= pascalizedSingularName %>Type } from '../../../../types';

@Component({
  selector: 'app-<%= dasherizedName %>-table-row',
  standalone: true,
  imports: [CommonModule, DatePipe],
  templateUrl: './<%= dasherizedName %>-table-row.component.html',
  styleUrl: './<%= dasherizedName %>-table-row.component.scss',
})
export class <%= pascalizedName %>TableRowComponent extends BaseDataTableRowComponent {
  @Input() <%= camelizedSingularName %>!: <%= pascalizedSingularName %>Type;
}
