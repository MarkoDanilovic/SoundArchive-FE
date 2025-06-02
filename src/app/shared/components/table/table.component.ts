import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {PageEvent} from "@angular/material/paginator";

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent {
  @Input() displayedColumns: string[] = [];
  @Input() displayedLabels: string[] = [];
  @Input() dataSource: any[] = [];
  @Input() actions: string[] = [];
  @Input() pagination: any;

  @Output() action = new EventEmitter<{ type: string, item: any }>();
  @Output() pageChange = new EventEmitter<number>();

  getNestedValue(obj: any, path: string): any {
    return path.split('.').reduce((acc, part) => acc && acc[part], obj);
  }

  onAction(type: string, item: any) {
    this.action.emit({ type, item });
  }

  onPageChange(event: any) {
    this.pageChange.emit(event.pageIndex + 1);
  }
}
