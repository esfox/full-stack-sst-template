import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BaseFormComponent } from '../../../../components/base-form/base-form.component';

@Component({
  selector: 'app-permission-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './permission-form.component.html',
  styleUrl: './permission-form.component.scss',
})
export class PermissionFormComponent extends BaseFormComponent {}
