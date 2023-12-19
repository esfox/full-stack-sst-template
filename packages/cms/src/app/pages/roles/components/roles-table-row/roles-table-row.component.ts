import { CommonModule, DatePipe } from '@angular/common';
import { Component, Input, inject } from '@angular/core';
import { BaseDataTableRowComponent } from '../../../../components/base-data-table-row/base-data-table-row.component';
import { DropdownMenuComponent } from '../../../../components/dropdown-menu/dropdown-menu.component';
import { RolesService } from '../../../../services/roles.service';
import { PermissionType, RoleType } from '../../../../types';

@Component({
  selector: 'app-roles-table-row',
  standalone: true,
  imports: [CommonModule, DatePipe, DropdownMenuComponent],
  templateUrl: './roles-table-row.component.html',
  styleUrl: './roles-table-row.component.scss',
})
export class RolesTableRowComponent extends BaseDataTableRowComponent {
  @Input() role!: RoleType;

  rolesService = inject(RolesService);

  isLoadingPermissions = false;
  rolePermissions: PermissionType[] | undefined = undefined;

  override async toggleExpand() {
    super.toggleExpand();

    if (!this.isShowingExpandRow || this.rolePermissions) {
      return;
    }

    this.isLoadingPermissions = true;
    const permissions = await this.rolesService.getPermissions(this.role.id);
    this.isLoadingPermissions = false;
    if (!permissions) {
      return;
    }

    this.rolePermissions = permissions;
  }
}
