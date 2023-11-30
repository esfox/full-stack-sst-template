import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { UserField } from '../../../../constants/users.constants';
import { UsersService } from '../../../../services/users.service';
import { UserFormDataType, UserType } from '../../../../types/users.types';

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './user-form.component.html',
  styleUrl: './user-form.component.scss',
})
export class UserFormComponent {
  @ViewChild('modal') modal!: ElementRef<HTMLDialogElement>;
  @ViewChild('form') form!: NgForm;

  isSaving = this.usersService.isSaving;
  savedUser = this.usersService.savedRecord;

  editUserId: string | undefined = undefined;

  static mode = {
    Create: 'create',
    Edit: 'edit',
  };

  constructor(private usersService: UsersService) {}

  async save() {
    const values: UserFormDataType = this.form.value;
    if (this.editUserId) {
      await this.usersService.edit(this.editUserId, values);
    } else {
      await this.usersService.create(values);
    }

    if (this.savedUser()) {
      this.form.reset();
      this.modal.nativeElement.close();
    }
  }

  open(defaultData?: Partial<UserType>) {
    this.form.reset();

    if (defaultData && defaultData.id) {
      this.editUserId = defaultData.id;
      this.form.setValue({
        email: defaultData[UserField.Email] ?? '',
        username: defaultData[UserField.Username] ?? '',
        firstName: defaultData[UserField.FirstName] ?? '',
        lastName: defaultData[UserField.LastName] ?? '',
      });
    } else {
      this.editUserId = undefined;
    }

    this.modal.nativeElement.showModal();
  }
}
