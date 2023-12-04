import { CommonModule } from '@angular/common';
import { Component, OnInit, computed } from '@angular/core';
import {
  BaseResourceComponent,
  injectionTokens,
} from '../../components/base-resource/base-resource.component';
import { DialogComponent } from '../../components/dialog/dialog.component';
import { PromptDialogComponent } from '../../components/prompt-dialog/prompt-dialog.component';
import { MainLayoutComponent } from '../../layouts/main-layout/main-layout.component';
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
    { provide: injectionTokens.service, useClass: UsersService },
    { provide: injectionTokens.getId, useValue: (user: UserType) => user.id },
  ],
})
export class UsersComponent extends BaseResourceComponent<UserType> implements OnInit {
  recordFormDialogTitle = computed(() => `${this.recordToSave() ? 'Edit' : 'Create'} User`);
  recordToDeleteEmail = computed(() => this.recordToDelete()?.email);
}
