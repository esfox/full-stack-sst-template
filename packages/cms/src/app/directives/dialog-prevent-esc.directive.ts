import { AfterViewInit, Directive, ElementRef, OnDestroy } from '@angular/core';

/* Prevent closing on pressing `esc` */
@Directive({
  selector: '[app-dialog-prevent-esc]',
  standalone: true,
})
export class DialogPreventEscDirective implements AfterViewInit, OnDestroy {
  private dialog!: HTMLDialogElement;

  constructor(dialog: ElementRef<HTMLDialogElement>) {
    this.dialog = dialog.nativeElement;
  }

  ngAfterViewInit() {
    this.dialog.addEventListener('cancel', this.preventCloseOnEsc);
  }

  ngOnDestroy() {
    this.dialog.removeEventListener('cancel', this.preventCloseOnEsc);
  }

  private preventCloseOnEsc(event: Event) {
    event.preventDefault();
  }
}
