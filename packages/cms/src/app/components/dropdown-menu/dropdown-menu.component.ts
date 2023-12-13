import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, Input, ViewChild } from '@angular/core';
import { RouterLink } from '@angular/router';

export type DropdownMenuItem = {
  label: string;
  class?: string;
  icon?: string;
  link?: string;
  onClick?: () => void;
};

@Component({
  selector: 'app-dropdown-menu',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './dropdown-menu.component.html',
  styleUrl: './dropdown-menu.component.scss',
})
export class DropdownMenuComponent implements AfterViewInit {
  @ViewChild('dropdown') dropdown!: ElementRef<HTMLDetailsElement>;

  @Input('class') class!: string;
  @Input('toggle-class') toggleClass!: string;
  @Input('items') menuItems!: DropdownMenuItem[];

  ngAfterViewInit() {
    document.addEventListener('click', this.onDocumentClick);
    document.addEventListener('keyup', this.onKeyUp);
  }

  ngOnDestroy() {
    document.removeEventListener('click', this.onDocumentClick);
    document.removeEventListener('keyup', this.onKeyUp);
  }

  onDocumentClick = (event: MouseEvent) => {
    /* "close on click outside" for the <details> element */
    if (!this.dropdown.nativeElement.contains(event.target as Node)) {
      this.toggleMenu(false);
    }
  };

  onKeyUp = (event: KeyboardEvent) => {
    /* close <details> the element when pressing 'esc' */
    if (event.key === 'Escape') {
      if (this.dropdown.nativeElement) {
        this.toggleMenu(false);
      }
    }
  };

  handleItemClick(menuItem: DropdownMenuItem) {
    this.toggleMenu();

    if (menuItem.link) {
      return;
    }

    if (menuItem.onClick) {
      menuItem.onClick();
    }
  }

  toggleMenu(isOpened?: boolean) {
    this.dropdown.nativeElement.open = isOpened ?? !this.dropdown.nativeElement.open;
  }
}
