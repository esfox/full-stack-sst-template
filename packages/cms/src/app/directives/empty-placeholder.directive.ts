import { AfterViewInit, Directive, ElementRef, Input } from '@angular/core';

@Directive({
  selector: '[app-empty-placeholder]',
  standalone: true,
})
export class EmptyPlaceholderDirective implements AfterViewInit {
  @Input('app-empty-placeholder') placeholder = '';

  private element: HTMLElement;

  constructor(element: ElementRef<HTMLElement>) {
    this.element = element.nativeElement;
  }

  ngAfterViewInit() {
    if (this.element.innerText === '') {
      this.element.innerText = this.placeholder;
    }
  }
}
