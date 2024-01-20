---
to: packages/cms/src/app/pages/<%= h.inflection.dasherize(tableName) %>/components/<%= h.inflection.dasherize(tableName) %>-table/<%= h.inflection.dasherize(tableName) %>-table.component.ts
---
<% const pascalizedName = h.inflection.camelize(tableName) %><% _%>
<% const pascalizedSingularName = h.inflection.singularize(pascalizedName) %><% _%>
<% const dasherizedName = h.inflection.dasherize(tableName) %><% _%>
<% const dasherizedSingularName = h.inflection.singularize(dasherizedName) %><% _%>
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import {
  BaseDataTableComponent,
  injectionTokens,
} from '../../../../components/base-data-table/base-data-table.component';
import { NavbarComponent } from '../../../../components/navbar/navbar.component';
import { PromptDialogComponent } from '../../../../components/prompt-dialog/prompt-dialog.component';
import { <%= pascalizedName %>Service } from '../../../../services/<%= dasherizedName %>.service';
import { <%= pascalizedSingularName %>Type } from '../../../../types';
import { <%= pascalizedName %>TableRowComponent } from '../<%= dasherizedName %>-table-row/<%= dasherizedName %>-table-row.component';

@Component({
  selector: 'app-<%= dasherizedName %>-table',
  standalone: true,
  imports: [
    CommonModule,
    NavbarComponent,
    RouterLink,
    RouterLinkActive,
    <%= pascalizedName %>TableRowComponent,
    PromptDialogComponent,
  ],
  templateUrl: './<%= dasherizedName %>-table.component.html',
  styleUrl: './<%= dasherizedName %>-table.component.scss',
  providers: [{ provide: injectionTokens.service, useExisting: <%= pascalizedName %>Service }],
})
export class <%= pascalizedName %>TableComponent extends BaseDataTableComponent<<%= pascalizedSingularName %>Type> {}
