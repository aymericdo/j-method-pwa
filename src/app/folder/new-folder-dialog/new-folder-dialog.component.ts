import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-new-folder-dialog',
  templateUrl: './new-folder-dialog.component.html',
})
export class NewFolderDialogComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { folders: string[], newFolder: string },
    private dialogRef: MatDialogRef<NewFolderDialogComponent>,
  ) { }

  handleClick(): void {
    this.dialogRef.close(true);
  }
}
