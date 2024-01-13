import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import {
  BaseDataTableComponent,
  injectionTokens,
} from '../../../../components/base-data-table/base-data-table.component';
import { NavbarComponent } from '../../../../components/navbar/navbar.component';
import { PromptDialogComponent } from '../../../../components/prompt-dialog/prompt-dialog.component';
import { UsersService } from '../../../../services/users.service';
import { UserType } from '../../../../types';
import { UsersTableRowComponent } from '../users-table-row/users-table-row.component';

@Component({
  selector: 'app-users-table',
  standalone: true,
  imports: [
    CommonModule,
    NavbarComponent,
    RouterLink,
    RouterLinkActive,
    UsersTableRowComponent,
    PromptDialogComponent,
  ],
  templateUrl: './users-table.component.html',
  styleUrl: './users-table.component.scss',
  providers: [{ provide: injectionTokens.service, useExisting: UsersService }],
})
export class UsersTableComponent extends BaseDataTableComponent<UserType> {
  override recordToDeleteLabel = () => this.recordToDelete?.email;
}
