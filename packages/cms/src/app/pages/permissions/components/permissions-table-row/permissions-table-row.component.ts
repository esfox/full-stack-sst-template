import { CommonModule, DatePipe } from '@angular/common';
import { Component, Input } from '@angular/core';
import { BaseDataTableRowComponent } from '../../../../components/base-data-table-row/base-data-table-row.component';
import { DropdownMenuComponent } from '../../../../components/dropdown-menu/dropdown-menu.component';
import { PermissionType } from '../../../../types';

@Component({
  selector: 'app-permissions-table-row',
  standalone: true,
  imports: [CommonModule, DatePipe, DropdownMenuComponent],
  templateUrl: './permissions-table-row.component.html',
  styleUrl: './permissions-table-row.component.scss',
})
export class PermissionsTableRowComponent extends BaseDataTableRowComponent {
  @Input() permission!: PermissionType;
}
