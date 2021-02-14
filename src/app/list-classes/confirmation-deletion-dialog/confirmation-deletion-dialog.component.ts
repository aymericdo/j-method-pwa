import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-confirmation-deletion-dialog',
  templateUrl: './confirmation-deletion-dialog.component.html',
})
export class ConfirmationDeletionDialogComponent {
  title: string;

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: { title: string },
    private dialogRef: MatDialogRef<ConfirmationDeletionDialogComponent>,
  ) { }

  ngOnInit(): void {
    this.title = this.data.title;
  }

  handleClick(): void {
    this.dialogRef.close(true);
  }
}
