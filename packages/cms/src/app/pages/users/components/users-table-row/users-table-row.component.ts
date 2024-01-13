import { CommonModule, DatePipe } from '@angular/common';
import { Component, Input, inject } from '@angular/core';
import { BaseDataTableRowComponent } from '../../../../components/base-data-table-row/base-data-table-row.component';
import { DropdownMenuComponent } from '../../../../components/dropdown-menu/dropdown-menu.component';
import { UsersService } from '../../../../services/users.service';
import { RoleType, UserType } from '../../../../types';

@Component({
  selector: 'app-users-table-row',
  standalone: true,
  imports: [CommonModule, DatePipe, DropdownMenuComponent],
  templateUrl: './users-table-row.component.html',
  styleUrl: './users-table-row.component.scss',
})
export class UsersTableRowComponent extends BaseDataTableRowComponent {
  @Input() user!: UserType;

  usersService = inject(UsersService);

  isLoadingRoles = false;
  userRoles: RoleType[] | undefined = undefined;

  override async toggleExpand() {
    super.toggleExpand();

    if (!this.isShowingExpandRow || this.userRoles) {
      return;
    }

    this.isLoadingRoles = true;
    const { data: roles } = await this.usersService.getRoles(this.user.id);
    this.isLoadingRoles = false;
    if (!roles) {
      return;
    }

    this.userRoles = roles;
  }
}
