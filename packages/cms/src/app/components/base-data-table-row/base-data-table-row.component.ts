import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  Output,
  TemplateRef,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { DropdownMenuComponent, DropdownMenuItem } from '../dropdown-menu/dropdown-menu.component';

@Component({
  selector: 'app-base-data-table-row',
  standalone: true,
  imports: [CommonModule, DropdownMenuComponent],
  template: '',
})
export class BaseDataTableRowComponent {
  @ViewChild('content', { static: true }) template!: TemplateRef<unknown>;

  @Input('alt-bg') altBg: boolean = false;

  @Output('edit') onEdit = new EventEmitter();
  @Output('delete') onDelete = new EventEmitter();

  isShowingExpandRow = false;

  actionMenu: DropdownMenuItem[] = [
    {
      label: 'Details',
      icon: 'fa-solid fa-circle-info',
      onClick: () => this.toggleExpand(),
    },
    {
      label: 'Edit',
      icon: 'fa-solid fa-pen',
      onClick: () => this.onEdit.emit(),
    },
    {
      label: 'Delete',
      icon: 'fa-solid fa-trash',
      class: 'text-error hover:text-error',
      onClick: () => this.onDelete.emit(),
    },
  ];

  constructor(private viewContainerRef: ViewContainerRef) {}

  ngOnInit() {
    if (this.template) {
      this.viewContainerRef.createEmbeddedView(this.template);
    }
  }

  toggleExpand() {
    this.isShowingExpandRow = !this.isShowingExpandRow;
  }
}
