import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { DialogPreventEscDirective } from '../../directives/dialog-prevent-esc.directive';

@Component({
  selector: 'app-dialog',
  standalone: true,
  imports: [CommonModule, DialogPreventEscDirective],
  templateUrl: './dialog.component.html',
  styleUrl: './dialog.component.scss',
})
export class DialogComponent {
  @ViewChild('dialog') dialog!: ElementRef<HTMLDialogElement>;

  show() {
    this.dialog.nativeElement.showModal();
  }

  hide() {
    this.dialog.nativeElement.close();
  }
}
