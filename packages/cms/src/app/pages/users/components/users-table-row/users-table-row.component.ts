import { CommonModule, DatePipe } from '@angular/common';
import { Component, Input } from '@angular/core';
import { BaseDataTableRowComponent } from '../../../../components/base-data-table-row/base-data-table-row.component';
import { DropdownMenuComponent } from '../../../../components/dropdown-menu/dropdown-menu.component';
import { UserType } from '../../../../types';

@Component({
  selector: 'app-users-table-row',
  standalone: true,
  imports: [CommonModule, DatePipe, DropdownMenuComponent],
  templateUrl: './users-table-row.component.html',
  styleUrl: './users-table-row.component.scss',
})
export class UsersTableRowComponent extends BaseDataTableRowComponent {
  @Input() user!: UserType;
}
