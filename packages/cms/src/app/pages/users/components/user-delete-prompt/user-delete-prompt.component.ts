import { CommonModule } from '@angular/common';
import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { UserField } from '../../../../constants/users.constants';
import { DialogPreventEscDirective } from '../../../../directives/dialog-prevent-esc.directive';
import { UserType } from '../../../../types/users.types';

@Component({
  selector: 'app-user-delete-prompt',
  standalone: true,
  imports: [CommonModule, DialogPreventEscDirective],
  templateUrl: './user-delete-prompt.component.html',
  styleUrl: './user-delete-prompt.component.scss',
})
export class UserDeletePromptComponent {
  @ViewChild('modal') modal!: ElementRef<HTMLDialogElement>;

  @Input('loading') isLoading = false;

  @Output('delete') onDelete = new EventEmitter();

  userEmail = '';

  show(userToDelete: UserType) {
    this.userEmail = userToDelete[UserField.Email];
    this.modal.nativeElement.showModal();
  }

  hide() {
    this.modal.nativeElement.close();
  }
}
