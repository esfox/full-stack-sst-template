---
to: packages/cms/src/app/pages/<%= h.inflection.dasherize(tableName) %>/<%= h.inflection.dasherize(tableName) %>.component.ts
---
<% const dasherizedName = h.inflection.dasherize(tableName) %><% _%>
<% const pascalizedName = h.inflection.camelize(tableName) %><% _%>

import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MainLayoutComponent } from '../../layouts/main-layout/main-layout.component';

@Component({
  selector: 'app-<%= dasherizedName %>',
  standalone: true,
  imports: [CommonModule, MainLayoutComponent, RouterOutlet],
  templateUrl: './<%= dasherizedName %>.component.html',
  styleUrl: './<%= dasherizedName %>.component.scss',
})
export class <%= pascalizedName %>Component {}
