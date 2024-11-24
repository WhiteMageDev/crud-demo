import { Component, model, OnInit, ViewChild } from '@angular/core';
import { Record } from '../add-record/record.model';
import { RecordManager } from '../../services/record-manager.service';
import { PageEvent } from '@angular/material/paginator';
import { DataTableComponent } from '../data-table/data-table.component';
import { MatButtonToggleChange } from '@angular/material/button-toggle';
import { DialogService } from '../../services/dialog.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

export enum Condition {
  Less = 1,
  Greater = 2,
  Equal = 3,
}

@Component({
  selector: 'app-all-records',
  templateUrl: './all-records.component.html',
  styleUrl: './all-records.component.css'
})

export class AllRecordsComponent implements OnInit {

  @ViewChild('dataTableComponent') dataTableComponent!: DataTableComponent;

  ngOnInit(): void {
    this.getRecordPage(this.currentPage, this.pageSize);
    this.selectedValues = [Condition.Equal];
  }

  constructor(
    private recordManager: RecordManager,
    private dialogService: DialogService,
    private router: Router,
    private snackBar: MatSnackBar) { }

  dataSource: any[] = [];

  totalRecords: number = 0;
  totalPages: number = 0;
  currentPage: number = 0;
  pageSize: number = 5;

  selectedRows: any[] = [];
  queryField: string = '';
  ageField: string = '';
  ageConditionField: string = '';
  queryCheck = model(false);
  ageCheck = model(false);

  currentQuery: string = '';
  currentAge: string = '';
  currentAgeConditions: string = '';

  getBySearch: boolean = false;

  selectedValues: Condition[] = [];
  Condition = Condition;
  columns = [
    {
      columnDef: 'position',
      header: '#',
      cell: (element: Record) => `${element.id}`,
    },
    {
      columnDef: 'name',
      header: 'Name',
      cell: (element: Record) => `${element.firstName} ${element.lastName}`,
    },
    {
      columnDef: 'gender',
      header: 'Gender',
      cell: (element: Record) => `${element.gender}`,
    },
    {
      columnDef: 'age',
      header: 'Age',
      cell: (element: Record) => this.calculateAge(element.dateOfBirth),
    },
    {
      columnDef: 'email',
      header: 'Email',
      cell: (element: Record) => `${element.email}`,
    },
  ];

  openDeleteDialog() {
    if (this.selectedRows.length <= 0) return;

    this.dialogService.openConfirmationDialog()
      .subscribe((confirmed) => {
        if (confirmed)
          this.onDeleteRecords();
      });
  }

  openFileUploadDialog() {
    this.dialogService.openFileUploadDialog()
      .subscribe((result) => {
        if (result.confirmed && result.file) {
          console.log('Dialog result:', result);
          this.recordManager.uploadFile(result.file).subscribe({
            next: (v) => {
              this.snackBar.open('File uploaded successfully!', 'Close', {
                duration: 3000
              });
            },
            error: (e) => {
              this.snackBar.open('Error uploading file. Please try again.', 'Close', {
                duration: 3000,
              });
            },
            complete: () => console.info('complete')
          });
        } else {
          console.log('Action was canceled');
        }
      });
  }

  paginatorReset() {
    this.currentPage = 0;
    this.pageSize = 5;
  }

  getRecordPage(page: number, size: number): void {
    this.recordManager.getRecords(page, size).subscribe(response => {
      this.dataSource = response.content;
      this.totalRecords = response.totalElements;
      this.totalPages = response.totalPages;
    });
  }

  onPageChange(event: PageEvent): void {
    this.clearSelection();
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    if (this.getBySearch) {
      this.getRecordPageWithSearchParams(
        this.currentQuery,
        this.currentAge,
        this.currentAgeConditions,
        this.currentPage,
        this.pageSize);
    }
    else {
      this.getRecordPage(this.currentPage, this.pageSize);
    }
  }

  onRecordDeleted(recordId: number): void {
    this.recordManager.deleteRecord(recordId).subscribe(
      {
        next: () => {
          this.getRecordPage(this.currentPage, this.pageSize);
        },
        error: (err: HttpErrorResponse) => {
          console.error(err);
        }
      }
    );
  }

  onRecordUpdate(recordId: number): void {
    this.router.navigate(['/add-record'], { state: { recordId } });
  }

  onDeleteRecords(): void {
    if (this.selectedRows.length > 0) {
      let ids = this.selectedRows.map(row => row.id);
      this.recordManager.deleteRecords(ids).subscribe({
        next: () => {
          this.getRecordPage(this.currentPage, this.pageSize);
        },
        error: (error) => console.error(error)
      });
      this.clearSelection();
      this.searchParamsReset();
    }
  }

  onSelectedRowsChanged(selectedRows: any[]) {
    this.selectedRows = selectedRows;
  }

  clearSelection() {
    this.dataTableComponent.clearSelection();
  }

  searchParamsReset() {
    this.currentQuery = '';
    this.currentAge = '';
    this.currentAgeConditions = '';
  }

  searchFormSubmit(): void {

    this.paginatorReset();
    this.searchParamsReset();
    this.clearSelection();
    if (!this.queryCheck() && !this.ageCheck()) {
      this.getBySearch = false;
      this.getRecordPage(this.currentPage, this.pageSize);
      return;
    }

    if (this.queryCheck()) {
      this.getBySearch = true;
      this.currentQuery = this.queryField.trim();
    }

    if (this.ageCheck()) {
      this.getBySearch = true;
      this.currentAge = this.ageField.trim();
      this.selectedValues.sort((a, b) => a - b)
      this.selectedValues.forEach(element => {
        this.currentAgeConditions += this.conditionToString(element);
      });
    }
    this.getRecordPageWithSearchParams(
      this.currentQuery,
      this.currentAge,
      this.currentAgeConditions,
      this.currentPage,
      this.pageSize);
  }

  getRecordPageWithSearchParams(argQuery: string, argAge: string, argAgeParams: string, page: number, size: number) {
    this.recordManager.getRecordsQuery(argQuery, argAge, argAgeParams, page, size).subscribe(response => {

      this.dataSource = response.content;
      this.totalRecords = response.totalElements;
      this.totalPages = response.totalPages;
    });
  }

  onAgeConditionsChange(event: MatButtonToggleChange) {
    let remove = false;
    const length = this.selectedValues.length;
    if (length == 2) {
      const hasLess = this.selectedValues.includes(Condition.Less);
      const hasGreater = this.selectedValues.includes(Condition.Greater);

      if (hasLess && hasGreater) {
        remove = true;
      }
    }
    else if (length == 3) remove = true;

    if (remove) {
      this.selectedValues.pop();
      event.source.buttonToggleGroup.value = this.selectedValues;
    }
  }

  calculateAge(dateOfBirth: Date): string {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);

    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();
    const dayDifference = today.getDate() - birthDate.getDate();

    if (monthDifference < 0 || (monthDifference === 0 && dayDifference < 0)) {
      age--;
    }

    return age.toString();
  }

  conditionToString(value: Condition): string {
    switch (value) {
      case Condition.Less:
        return "Less";
      case Condition.Equal:
        return "Equal";
      case Condition.Greater:
        return "Greater";
      default:
        return "";
    }
  }

}
