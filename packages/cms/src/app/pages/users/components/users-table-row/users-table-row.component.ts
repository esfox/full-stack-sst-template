import { CommonModule, DatePipe } from '@angular/common';
import { Component, Input } from '@angular/core';
import { BaseDataTableRowComponent } from '../../../../components/base-data-table-row/base-data-table-row.component';
import { UserType } from '../../../../types/users.types';

@Component({
  selector: 'app-users-table-row',
  standalone: true,
  imports: [CommonModule, DatePipe],
  templateUrl: './users-table-row.component.html',
  styleUrl: './users-table-row.component.scss',
})
export class UsersTableRowComponent extends BaseDataTableRowComponent {
  @Input() user!: UserType;
}
