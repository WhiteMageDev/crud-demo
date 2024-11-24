import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-file-upload-dialog',
  templateUrl: './file-upload-dialog.component.html',
  styleUrl: './file-upload-dialog.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FileUploadDialog {
  readonly dialogRef = inject(MatDialogRef<FileUploadDialog>);
  readonly data = inject(MAT_DIALOG_DATA);

  file: File | null = null;
  errorMessage: string | null = null;
  isValid: boolean = false;

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;

    if (input?.files?.length) {
      const selectedFile = input.files[0];

      if (this.isValidFile(selectedFile)) {
        this.file = selectedFile;
        this.isValid = true;
        this.errorMessage = null;
      } else {
        this.file = null;
        this.errorMessage = 'Invalid file format. Please select a valid file.';
        this.isValid = false;
      }

    }

  }

  isValidFile(file: File): boolean {
    const validFormats = ['text/csv'];
    return validFormats.includes(file.type);
  }
  onConfirm(): void {
    this.dialogRef.close({ confirmed: true, file: this.file });
  }

  onReturn(): void {
    this.dialogRef.close({ confirmed: false, file: null });
  }
}
