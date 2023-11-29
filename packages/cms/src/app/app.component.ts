import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, MainLayoutComponent, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'cms';

  ngOnInit() {
    document.addEventListener('click', this.onDocumentClick);
    document.addEventListener('keyup', this.onKeyUp);
  }

  ngOnDestroy() {
    document.removeEventListener('click', this.onDocumentClick);
    document.removeEventListener('keyup', this.onKeyUp);
  }

  onDocumentClick = (event: MouseEvent) => {
    /* "close on click outside" for <details> elements */
    if (this.openedDetailsElement && !this.openedDetailsElement.contains(event.target as Node)) {
      this.openedDetailsElement.open = false;
    }
  };

  onKeyUp = (event: KeyboardEvent) => {
    /* close <details> elements when pressing 'esc' */
    if (event.key === 'Escape') {
      if (this.openedDetailsElement) {
        this.openedDetailsElement.open = false;
      }
    }
  };

  private get openedDetailsElement() {
    return document.querySelector('details[open]') as HTMLDetailsElement;
  }
}
