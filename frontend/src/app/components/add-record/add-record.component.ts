import { Component, OnInit } from '@angular/core';
import { provideNativeDateAdapter } from '@angular/material/core';
import { Record } from './record.model';
import { FormBuilder, FormGroup, FormGroupDirective, Validators } from '@angular/forms';
import { RecordManager } from '../../services/record-manager.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';

const regexName = '^[A-Za-z]+$';
const regexEmail = '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$';
@Component({
  selector: 'app-add-record',
  templateUrl: './add-record.component.html',
  styleUrl: './add-record.component.css',
  providers: [provideNativeDateAdapter()],
})
export class AddRecordComponent implements OnInit {
  requiredErrorMessage = 'This field is required';
  invalidNameErrorMessage = 'Must be a valid Name';
  invalidEmailErrorMessage = 'Must be a valid email address';
  invalidDateErrorMessage = 'Must be a valid date';
  formTitle = '';

  updateAction: Boolean = false;

  recordId: number = -1;
  record!: Record;
  recordForm: FormGroup;
  get formControls() { return this.recordForm.controls; }

  submitted = false;

  constructor(private recordService: RecordManager, private fb: FormBuilder, private router: Router) {
    this.recordForm = this.fb.group({
      firstName: [null, [Validators.required, Validators.pattern(regexName)]],
      lastName: [null, [Validators.required, Validators.pattern(regexName)]],
      email: [null, [Validators.required, Validators.pattern(regexEmail)]],
      dateOfBirth: [null, Validators.required],
      gender: [null, Validators.required]
    });
  }

  ngOnInit(): void {
    if (history.state && history.state.recordId) {
      this.recordId = history.state.recordId;
      this.loadRecord(this.recordId);
      this.updateAction = true;
      this.formTitle = 'Update record';
    } else {
      this.formTitle = 'Add new record';
      this.updateAction = false;
    }
  }
  loadRecord(id: number): void {
    this.recordService.getRecordById(id).subscribe(record => {
      this.record = record;
      this.recordForm.patchValue({
        firstName: record.firstName,
        lastName: record.lastName,
        email: record.email,
        dateOfBirth: record.dateOfBirth,
        gender: record.gender
      });
    });
  }

  onSubmit(recordForm: FormGroup, formDirective: FormGroupDirective) {
    this.submitted = true;
    if (this.recordForm.invalid) {
      return;
    }

    const record: Record = {
      id: 0,
      firstName: recordForm.controls['firstName'].value,
      lastName: recordForm.controls['lastName'].value,
      dateOfBirth: recordForm.controls['dateOfBirth'].value,
      email: recordForm.controls['email'].value,
      gender: recordForm.controls['gender'].value,
    };

    if (this.updateAction) {
      record.id = this.record.id;
      this.recordService.updateRecord(record).subscribe(
        {
          next: (res: Record) => {
            console.log(res);
            this.router.navigate(['/']);
          },
          error: (err: HttpErrorResponse) => {
            console.log(err);
            console.log(err.message);
          }
        }
      );
    }
    else {
      this.recordService.saveRecord(record).subscribe(
        {
          next: (res: Record) => {
            console.log(res);
            this.router.navigate(['/']);
          },
          error: (err: HttpErrorResponse) => {
            console.log(err);
            console.log(err.message);
          }
        }
      );
    }
  }
  onCancel(): void {
    this.recordForm.reset();
    //this.router.navigate(['/']);
    window.location.href = '/';
  }
  isInvalidAndTouchedOrSubmitted(controlName: string): boolean {
    const control = this.recordForm.controls[controlName];
    return control.invalid && (control.touched || control.dirty) || (this.submitted && control.invalid);
  }
}
