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
  }

  ngOnDestroy() {
    document.removeEventListener('click', this.onDocumentClick);
  }

  onDocumentClick(event: MouseEvent) {
    /* "close on click outside" for <details> elements */
    const openedDetails = document.querySelector('details[open]') as HTMLDetailsElement;
    if (openedDetails && !openedDetails.contains(event.target as Node)) {
      openedDetails.open = false;
    }
  }
}
