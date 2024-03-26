import { Component, EventEmitter, Input, Output } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-paginator',
  templateUrl: './paginator.component.html',
  styleUrls: ['./paginator.component.scss'],
})
export class PaginatorComponent {
  @Input() length!: number;
  @Input() pageIndex!: number;
  @Input() pageSize!: number;
  @Input() pageSizeOptions: number[] = [5, 10, 20];
  @Output() pageChange = new EventEmitter<PageEvent>();

  onPageChange(event: PageEvent) {
    this.pageChange.emit(event);
  }
}
