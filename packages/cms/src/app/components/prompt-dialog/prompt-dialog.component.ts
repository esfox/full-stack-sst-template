import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { DialogPreventEscDirective } from '../../directives/dialog-prevent-esc.directive';
import { EmptyPlaceholderDirective } from '../../directives/empty-placeholder.directive';
import { DialogComponent } from '../dialog/dialog.component';

@Component({
  selector: 'app-prompt-dialog',
  standalone: true,
  imports: [CommonModule, DialogComponent, DialogPreventEscDirective, EmptyPlaceholderDirective],
  templateUrl: './prompt-dialog.component.html',
  styleUrl: './prompt-dialog.component.scss',
})
export class PromptDialogComponent {
  @ViewChild('dialog') dialog!: DialogComponent;

  @Input() disabled = false;
  @Input('title') title = 'Confirm';
  @Input('danger-confirm') isDangerConfirm = false;

  @Output('confirm') onConfirm = new EventEmitter();

  get shown() {
    return this.dialog.shown;
  }

  show() {
    this.dialog.show();
  }

  hide() {
    this.dialog.hide();
  }
}
