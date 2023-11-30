import { CommonModule, DatePipe } from '@angular/common';
import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  TemplateRef,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { UserField } from '../../../../constants/users.constants';
import { UserType } from '../../../../types/users.types';

@Component({
  selector: 'app-users-table-row',
  standalone: true,
  imports: [CommonModule, DatePipe],
  templateUrl: './users-table-row.component.html',
  styleUrl: './users-table-row.component.scss',
})
export class UsersTableRowComponent implements OnInit {
  @ViewChild('content', { static: true }) template!: TemplateRef<unknown>;
  @ViewChild('menu') menu!: ElementRef<HTMLDetailsElement>;

  @Input() user!: UserType;
  @Input('alt-bg') altBg: boolean = false;

  @Output('edit') onEdit = new EventEmitter();
  @Output('delete') onDelete = new EventEmitter();

  email = () => this.user[UserField.Email];
  username = () => this.user[UserField.Username];
  firstName = () => this.user[UserField.FirstName];
  lastName = () => this.user[UserField.LastName];
  id = () => this.user[UserField.Id];
  createdAt = () => this.user[UserField.CreatedAt];
  lastUpdatedAt = () => this.user[UserField.UpdatedAt];

  isShowingExpandRow = false;

  constructor(private viewContainerRef: ViewContainerRef) {}

  ngOnInit() {
    if (this.template) {
      this.viewContainerRef.createEmbeddedView(this.template);
    }
  }

  toggleMenu() {
    this.menu.nativeElement.open = !this.menu.nativeElement.open;
  }

  toggleExpand() {
    this.isShowingExpandRow = !this.isShowingExpandRow;
  }
}
