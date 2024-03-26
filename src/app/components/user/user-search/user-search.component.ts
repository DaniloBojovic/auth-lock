import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-user-search',
  template: `<form (submit)="onSearch($event)" class="search-form">
    <input
      type="text"
      [(ngModel)]="searchTerm"
      name="searchTerm"
      placeholder="Search users"
      class="search-input"
    />
    <button type="submit" class="search-button">Search</button>
  </form>`,
  styles: [
    `
      .search-form {
        display: flex;
        justify-content: center;
        margin-bottom: 20px;
      }
      .search-input {
        width: 200px;
        padding: 10px;
        border: 1px solid #ccc;
        border-radius: 4px;
      }
      .search-button {
        margin-left: 10px;
        padding: 10px 20px;
        border: none;
        background-color: #4caf50;
        color: white;
        cursor: pointer;
      }
      .search-button:hover {
        background-color: #45a049;
      }
    `,
  ],
})
export class UserSearchComponent {
  @Output() search = new EventEmitter<string>();
  @Input() searchTerm: string = '';

  onSearch(event: Event) {
    event.preventDefault();
    this.search.emit(this.searchTerm);
  }
}
