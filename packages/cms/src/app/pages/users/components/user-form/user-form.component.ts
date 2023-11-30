import { CommonModule } from '@angular/common';
import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { UserField } from '../../../../constants/users.constants';
import { DialogPreventEscDirective } from '../../../../directives/dialog-prevent-esc.directive';
import { UserFormDataType, UserType } from '../../../../types/users.types';

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [CommonModule, FormsModule, DialogPreventEscDirective],
  templateUrl: './user-form.component.html',
  styleUrl: './user-form.component.scss',
})
export class UserFormComponent {
  @ViewChild('modal') modal!: ElementRef<HTMLDialogElement>;
  @ViewChild('form') form!: NgForm;

  @Input('loading') isLoading = false;

  @Output('save') onSave = new EventEmitter<UserFormDataType>();

  isEditing = false;

  save() {
    this.onSave.emit(this.form.value);
  }

  show(defaultData?: Partial<UserType>) {
    this.form.reset();

    if (defaultData && defaultData.id) {
      this.isEditing = true;
      this.form.setValue({
        email: defaultData[UserField.Email] ?? '',
        username: defaultData[UserField.Username] ?? '',
        firstName: defaultData[UserField.FirstName] ?? '',
        lastName: defaultData[UserField.LastName] ?? '',
      });
    } else {
      this.isEditing = false;
    }

    this.modal.nativeElement.showModal();
  }

  hide() {
    this.form.reset();
    this.modal.nativeElement.close();
  }
}
