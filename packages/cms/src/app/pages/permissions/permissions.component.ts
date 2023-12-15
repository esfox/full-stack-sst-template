import { CommonModule } from '@angular/common';
import { Component, OnInit, computed } from '@angular/core';
import {
  BaseResourceComponent,
  injectionTokens,
} from '../../components/base-resource/base-resource.component';
import { DialogComponent } from '../../components/dialog/dialog.component';
import { PromptDialogComponent } from '../../components/prompt-dialog/prompt-dialog.component';
import { MainLayoutComponent } from '../../layouts/main-layout/main-layout.component';
import { PermissionsService } from '../../services/permissions.service';
import { PermissionType } from '../../types';
import { PermissionFormComponent } from './components/permission-form/permission-form.component';
import { PermissionsTableRowComponent } from './components/permissions-table-row/permissions-table-row.component';

@Component({
  selector: 'app-permissions',
  standalone: true,
  imports: [
    CommonModule,
    MainLayoutComponent,
    PermissionsTableRowComponent,
    PermissionFormComponent,
    DialogComponent,
    PromptDialogComponent,
  ],
  templateUrl: './permissions.component.html',
  styleUrl: './permissions.component.scss',
  providers: [
    { provide: injectionTokens.service, useClass: PermissionsService },
    { provide: injectionTokens.getId, useValue: (permission: PermissionType) => permission.id },
  ],
})
export class PermissionsComponent extends BaseResourceComponent<PermissionType> implements OnInit {
  recordFormDialogTitle = computed(() => `${this.recordToSave() ? 'Edit' : 'Create'} Permission`);
  recordToDeleteIdentifier = computed(() => this.recordToDelete()?.id); // TODO: Change as needed
}
