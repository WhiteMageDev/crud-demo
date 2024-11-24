import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-data-table',
  templateUrl: './data-table.component.html',
  styleUrl: './data-table.component.css'
})
export class DataTableComponent implements OnInit {
  @Input() records: any[] = [];
  @Input() columns: any[] = [];
  displayedColumns: string[] = [];
  selectedRows = new Set<any>();

  @Output() recordDeleteEvent = new EventEmitter<number>();
  @Output() recordUpdateEvent = new EventEmitter<number>();

  @Output() selectedRowsChanged = new EventEmitter<any[]>();

  ngOnInit(): void {
    this.displayedColumns = ['select', ...this.columns.map(c => c.columnDef), 'actions'];
  }

  onRecordDelete(recordId: number): void {
    this.recordDeleteEvent.emit(recordId);

  }

  onRecordUpdate(recordId: number): void {
    this.recordUpdateEvent.emit(recordId);
  }

  toggleAll(event: any) {
    if (event.checked) {
      this.records.forEach(row => this.selectedRows.add(row));
    } else {
      this.selectedRows.clear();
    }
    this.emitSelectedRows();
  }

  toggleRow(row: any, checked: boolean) {
    if (checked) {
      this.selectedRows.add(row);
    } else {
      this.selectedRows.delete(row);
    }
    this.emitSelectedRows();
  }

  isSelected(row: any): boolean {
    return this.selectedRows.has(row);
  }

  isAllSelected(): boolean {
    return this.selectedRows.size === this.records.length;
  }

  isIndeterminate(): boolean {
    return this.selectedRows.size > 0 && this.selectedRows.size < this.records.length;
  }

  private emitSelectedRows() {
    this.selectedRowsChanged.emit(Array.from(this.selectedRows));
  }

  clearSelection() {
    this.selectedRows.clear();
    this.emitSelectedRows();
  }
}
