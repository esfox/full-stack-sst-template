import { CommonModule } from '@angular/common';
import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  TemplateRef,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';

@Component({
  selector: 'app-base-data-table-row',
  standalone: true,
  imports: [CommonModule],
  template: '',
})
export class BaseDataTableRowComponent {
  @ViewChild('content', { static: true }) template!: TemplateRef<unknown>;
  @ViewChild('menu') menu!: ElementRef<HTMLDetailsElement>;

  @Input('alt-bg') altBg: boolean = false;

  @Output('edit') onEdit = new EventEmitter();
  @Output('delete') onDelete = new EventEmitter();

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
