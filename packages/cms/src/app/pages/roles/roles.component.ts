import { CommonModule } from '@angular/common';
import { Component, OnInit, computed } from '@angular/core';
import {
  BaseResourceComponent,
  injectionTokens,
} from '../../components/base-resource/base-resource.component';
import { DialogComponent } from '../../components/dialog/dialog.component';
import { PromptDialogComponent } from '../../components/prompt-dialog/prompt-dialog.component';
import { MainLayoutComponent } from '../../layouts/main-layout/main-layout.component';
import { RolesService } from '../../services/roles.service';
import { RoleType } from '../../types';
import { RoleFormComponent } from './components/role-form/role-form.component';
import { RolesTableRowComponent } from './components/roles-table-row/roles-table-row.component';

@Component({
  selector: 'app-roles',
  standalone: true,
  imports: [
    CommonModule,
    MainLayoutComponent,
    RolesTableRowComponent,
    RoleFormComponent,
    DialogComponent,
    PromptDialogComponent,
  ],
  templateUrl: './roles.component.html',
  styleUrl: './roles.component.scss',
  providers: [
    { provide: injectionTokens.service, useClass: RolesService },
    { provide: injectionTokens.getId, useValue: (role: RoleType) => role.id },
  ],
})
export class RolesComponent extends BaseResourceComponent<RoleType> implements OnInit {
  recordFormDialogTitle = computed(() => `${this.recordToSave() ? 'Edit' : 'Create'} Role`);
  recordToDeleteName = computed(() => this.recordToDelete()?.name);
}
