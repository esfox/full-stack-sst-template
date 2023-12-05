import { CommonModule, DatePipe } from '@angular/common';
import { Component, Input } from '@angular/core';
import { BaseDataTableRowComponent } from '../../../../components/base-data-table-row/base-data-table-row.component';
import { RoleType } from '../../../../types';

@Component({
  selector: 'app-roles-table-row',
  standalone: true,
  imports: [CommonModule, DatePipe],
  templateUrl: './roles-table-row.component.html',
  styleUrl: './roles-table-row.component.scss',
})
export class RolesTableRowComponent extends BaseDataTableRowComponent {
  @Input() role!: RoleType;
}
