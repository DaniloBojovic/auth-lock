import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-sort-button',
  template: `<button (click)="toggleSortOrder()" class="sort-button">
    {{ sortOrder === 'asc' ? '&#9660; descending' : '&#9650; ascending' }}
  </button>`,
  styles: [
    `
      .sort-button {
        padding: 10px;
        border: none;
        background-color: #4caf50;
        color: white;
        cursor: pointer;
      }
    `,
  ],
})
export class SortButtonComponent {
  @Input() sortOrder: string = 'asc';
  @Output() sortOrderChange = new EventEmitter<string>();

  toggleSortOrder() {
    this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
    this.sortOrderChange.emit(this.sortOrder);
  }
}
