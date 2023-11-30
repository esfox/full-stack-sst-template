import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserType } from '../../../../types/users.types';
import { UserField } from '../../../../constants/users.constants';

@Component({
  selector: 'app-user-delete-prompt',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-delete-prompt.component.html',
  styleUrl: './user-delete-prompt.component.scss',
})
export class UserDeletePromptComponent implements AfterViewInit, OnDestroy {
  @ViewChild('modal') modal!: ElementRef<HTMLDialogElement>;

  @Input('loading') isLoading = false;

  @Output('delete') onDelete = new EventEmitter();

  userEmail = '';

  ngAfterViewInit() {
    /* Prevent closing on pressing `esc` */
    this.modal.nativeElement.addEventListener('cancel', this.preventCloseOnEsc);
  }

  ngOnDestroy() {
    this.modal.nativeElement.removeEventListener('cancel', this.preventCloseOnEsc);
  }

  private preventCloseOnEsc(event: Event) {
    event.preventDefault();
  }

  show(userToDelete: UserType) {
    this.userEmail = userToDelete[UserField.Email];
    this.modal.nativeElement.showModal();
  }

  hide() {
    this.modal.nativeElement.close();
  }
}
