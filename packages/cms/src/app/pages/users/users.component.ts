import { CommonModule } from '@angular/common';
import { Component, OnInit, computed, inject } from '@angular/core';
import {
  BaseResourceComponent,
  injectionTokens,
} from '../../components/base-resource/base-resource.component';
import { DialogComponent } from '../../components/dialog/dialog.component';
import { PromptDialogComponent } from '../../components/prompt-dialog/prompt-dialog.component';
import { MainLayoutComponent } from '../../layouts/main-layout/main-layout.component';
import { RolesService } from '../../services/roles.service';
import { UsersService } from '../../services/users.service';
import { UserType } from '../../types';
import { UserFormComponent } from './components/user-form/user-form.component';
import { UsersTableRowComponent } from './components/users-table-row/users-table-row.component';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [
    CommonModule,
    MainLayoutComponent,
    UsersTableRowComponent,
    UserFormComponent,
    DialogComponent,
    PromptDialogComponent,
  ],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss',
  providers: [
    { provide: injectionTokens.service, useExisting: UsersService },
    { provide: injectionTokens.getId, useValue: (user: UserType) => user.id },
  ],
})
export class UsersComponent extends BaseResourceComponent<UserType> implements OnInit {
  rolesService = inject(RolesService);

  recordFormDialogTitle = computed(() => `${this.recordToSave() ? 'Edit' : 'Create'} User`);
  recordToDeleteEmail = computed(() => this.recordToDelete()?.email);

  async saveWithPermissions(data: { role: Partial<RoleType>; permissions: PermissionType[] }) {
    const { role, permissions } = data;
    const recordToSave = this.recordToSave();

    try {
      await this.rolesService.saveWithPermissions({
        permissions,
        role,
        roleId: recordToSave?.id,
      });
    } catch (error) {
      //  TODO: handle error
      console.error(error);
      return;
    }

    this.recordFormDialog.hide();
    this.recordForm.reset();
    this.service.get();
  }

  override async showRecordForm(user?: Partial<UserType> | undefined) {
    super.showRecordForm(user);
    if (this.rolesService.records().length !== 0) {
      return;
    }

    try {
      await this.rolesService.get();
    } catch (error) {
      //  TODO: handle error
      console.error(error);
      return;
    }
  }
}
