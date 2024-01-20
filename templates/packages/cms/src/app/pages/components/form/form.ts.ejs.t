---
to: packages/cms/src/app/pages/<%= h.inflection.dasherize(tableName) %>/components/<%= h.inflection.transform(tableName, [ 'dasherize', 'singularize' ]) %>-form/<%= h.inflection.transform(tableName, [ 'dasherize', 'singularize' ]) %>-form.component.ts
---
<% const pascalizedName = h.inflection.camelize(tableName) %><% _%>
<% const pascalizedSingularName = h.inflection.singularize(pascalizedName) %><% _%>
<% const dasherizedName = h.inflection.dasherize(tableName) %><% _%>
<% const dasherizedSingularName = h.inflection.singularize(dasherizedName) %><% _%>
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  BaseFormComponent,
  injectionTokens,
} from '../../../../components/base-form/base-form.component';
import { NavbarComponent } from '../../../../components/navbar/navbar.component';
import { <%= pascalizedName %>Service } from '../../../../services/<%= dasherizedName %>.service';
import { <%= pascalizedSingularName %>Type } from '../../../../types';

@Component({
  selector: 'app-<%= dasherizedSingularName %>-form',
  standalone: true,
  imports: [CommonModule, NavbarComponent, FormsModule],
  templateUrl: './<%= dasherizedSingularName %>-form.component.html',
  styleUrl: './<%= dasherizedSingularName %>-form.component.scss',
  providers: [{ provide: injectionTokens.service, useExisting: <%= pascalizedName %>Service }],
})
export class <%= pascalizedSingularName %>FormComponent extends BaseFormComponent<<%= pascalizedSingularName %>Type> {}
