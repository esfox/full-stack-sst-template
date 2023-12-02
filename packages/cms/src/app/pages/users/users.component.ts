import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild, computed, effect } from '@angular/core';
import {
  BaseResourceComponent,
  injectionTokens,
} from '../../components/base-resource/base-resource.component';
import { DialogComponent } from '../../components/dialog/dialog.component';
import { PromptDialogComponent } from '../../components/prompt-dialog/prompt-dialog.component';
import { MainLayoutComponent } from '../../layouts/main-layout/main-layout.component';
import { UsersService } from '../../services/users.service';
import { UserType } from '../../types/users.types';
import { UserFormComponent } from './components/user-form/user-form.component';
import { UsersTableRowComponent } from './components/users-table-row/users-table-row.component';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [
    CommonModule,
    UsersTableRowComponent,
    MainLayoutComponent,
    DialogComponent,
    PromptDialogComponent,
    UserFormComponent,
  ],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss',
  providers: [
    { provide: injectionTokens.service, useClass: UsersService },
    { provide: injectionTokens.getId, useValue: (record: UserType) => record.id },
  ],
})
export class UsersComponent extends BaseResourceComponent<UserType> implements OnInit {
  @ViewChild(UserFormComponent) userFormComponent!: UserFormComponent;

  recordFormDialogTitle = computed(() => `${this.recordToSave() ? 'Edit' : 'Create'} User`);
  recordToDeleteEmail = computed(() => this.recordToDelete()?.email);

  constructor() {
    super();

    effect(() => {
      const recordToSave = this.recordToSave();
      if (recordToSave) {
        this.userFormComponent.setValues<UserType>({
          email: recordToSave.email,
          username: recordToSave?.username,
          firstName: recordToSave?.firstName ?? '',
          lastName: recordToSave?.lastName ?? '',
        });
      } else {
        this.userFormComponent.reset();
      }
    });
  }
}
