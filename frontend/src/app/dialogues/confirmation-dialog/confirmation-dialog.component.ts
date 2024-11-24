import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog',
  templateUrl: './confirmation-dialog.component.html',
  styleUrl: './confirmation-dialog.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfirmationDialog {
  readonly dialogRef = inject(MatDialogRef<ConfirmationDialog>);
  readonly data = inject(MAT_DIALOG_DATA);

    onConfirm(): void {
      this.dialogRef.close(true);
    }
    onReturn(): void {
      this.dialogRef.close(false);
    }
}