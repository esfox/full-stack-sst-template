import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { UsersService } from '../../../../services/users.service';
import { NewUserType } from '../../../../types/users.types';

@Component({
  selector: 'app-add-user',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-user.component.html',
  styleUrl: './add-user.component.scss',
})
export class AddUserComponent {
  @ViewChild('modal') modal!: ElementRef<HTMLDialogElement>;

  isSaving = this.usersService.isSaving;
  savedUser = this.usersService.savedRecord;

  constructor(private usersService: UsersService) {}

  async save(form: NgForm) {
    const values: NewUserType = form.value;
    await this.usersService.create(values);

    if (this.savedUser()) {
      form.reset();
      this.modal.nativeElement.close();
    }
  }

  openModal() {
    this.modal.nativeElement.showModal();
  }
}
