---
to: packages/cms/src/app/pages/<%= h.inflection.dasherize(tableName) %>/components/<%= h.inflection.transform(tableName, [ 'dasherize', 'singularize' ]) %>-form/<%= h.inflection.transform(tableName, [ 'dasherize', 'singularize' ]) %>-form.component.ts
---
<% const dasherizedSingularName = h.inflection.transform(tableName, [ 'dasherize', 'singularize' ]) %><% _%>
<% const pascalizedSingularName = h.inflection.transform(tableName, [ 'camelize', 'singularize' ]) %><% _%>
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BaseFormComponent } from '../../../../components/base-form/base-form.component';

@Component({
  selector: 'app-<%= dasherizedSingularName %>-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './<%= dasherizedSingularName %>-form.component.html',
  styleUrl: './<%= dasherizedSingularName %>-form.component.scss',
})
export class <%= pascalizedSingularName %>FormComponent extends BaseFormComponent {}
