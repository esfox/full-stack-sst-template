---
to: packages/cms/src/app/pages/<%= h.inflection.dasherize(tableName) %>/<%= h.inflection.dasherize(tableName) %>.component.ts
---
<% const dasherizedName = h.inflection.dasherize(tableName) %><% _%>
<% const dasherizedSingularName = h.inflection.singularize(dasherizedName) %><% _%>
<% const pascalizedName = h.inflection.camelize(tableName) %><% _%>
<% const pascalizedSingularName = h.inflection.singularize(pascalizedName) %><% _%>
<% const camelizedSingularName = h.inflection.singularize(h.inflection.camelize(tableName, true)) %><% _%>
import { CommonModule } from '@angular/common';
import { Component, OnInit, computed } from '@angular/core';
import {
  BaseResourceComponent,
  injectionTokens,
} from '../../components/base-resource/base-resource.component';
import { DialogComponent } from '../../components/dialog/dialog.component';
import { PromptDialogComponent } from '../../components/prompt-dialog/prompt-dialog.component';
import { MainLayoutComponent } from '../../layouts/main-layout/main-layout.component';
import { <%= pascalizedName %>Service } from '../../services/<%= dasherizedName %>.service';
import { <%= pascalizedSingularName %>Type } from '../../types';
import { <%= pascalizedSingularName %>FormComponent } from './components/<%= dasherizedSingularName %>-form/<%= dasherizedSingularName %>-form.component';
import { <%= pascalizedName %>TableRowComponent } from './components/<%= dasherizedName %>-table-row/<%= dasherizedName %>-table-row.component';

@Component({
  selector: 'app-<%= dasherizedName %>',
  standalone: true,
  imports: [
    CommonModule,
    MainLayoutComponent,
    <%= pascalizedName %>TableRowComponent,
    <%= pascalizedSingularName %>FormComponent,
    DialogComponent,
    PromptDialogComponent,
  ],
  templateUrl: './<%= dasherizedName %>.component.html',
  styleUrl: './<%= dasherizedName %>.component.scss',
  providers: [
    { provide: injectionTokens.service, useClass: <%= pascalizedName %>Service },
    { provide: injectionTokens.getId, useValue: (<%= camelizedSingularName %>: <%= pascalizedSingularName %>Type) => <%= camelizedSingularName %>.<%= primaryKey %> },
  ],
})
export class <%= pascalizedName %>Component extends BaseResourceComponent<<%= pascalizedSingularName %>Type> implements OnInit {
  recordFormDialogTitle = computed(() => `${this.recordToSave() ? 'Edit' : 'Create'} <%= pascalizedSingularName %>`);
  recordToDeleteIdentifier = computed(() => this.recordToDelete()?.<%= primaryKey %>); // TODO: Change as needed
}
