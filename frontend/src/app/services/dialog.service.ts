import { inject, Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialog } from '../dialogues/confirmation-dialog/confirmation-dialog.component';
import { Observable } from 'rxjs';
import { FileUploadDialog } from '../dialogues/file-upload-dialog/file-upload-dialog.component';

@Injectable({
  providedIn: 'root'
})
export class DialogService {

  readonly dialog = inject(MatDialog);

  confirmationDialogConfig = {
    title: 'Confirm deletion',
    message: 'Are you sure you want to delete this item?',
    returnBtn: 'Cancel',
    confirmBtn: 'Delete'
  };
  fileUploadDialogConfig = {
    title: 'Upload file',
    message: 'Please select a CSV file to upload.',
    returnBtn: 'Cancel',
    confirmBtn: 'Upload'
  };

  openConfirmationDialog(): Observable<boolean> {
    const dialogRef = this.dialog.open(ConfirmationDialog, {
      enterAnimationDuration: '200ms',
      exitAnimationDuration: '200ms',
      data: this.confirmationDialogConfig
    });
    return dialogRef.afterClosed();
  }

  openFileUploadDialog(): Observable<{ confirmed: boolean, file: File | null }> {
    const dialogRef = this.dialog.open(FileUploadDialog, {
      enterAnimationDuration: '200ms',
      exitAnimationDuration: '200ms',
      data: this.fileUploadDialogConfig,
      disableClose: true
    });
    return dialogRef.afterClosed();
  }
}
