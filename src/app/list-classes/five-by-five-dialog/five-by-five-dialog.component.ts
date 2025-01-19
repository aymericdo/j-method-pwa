import { Component } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ConfirmationDeletionDialogComponent } from '../confirmation-deletion-dialog/confirmation-deletion-dialog.component';
import { CourseService } from 'src/app/course.service';

@Component({
  selector: 'app-five-by-five-dialog',
  templateUrl: './five-by-five-dialog.component.html',
  styleUrls: ['./five-by-five-dialog.component.scss'],
})
export class FiveByFiveDialogComponent {
  coursesNumber = 5;
  submitting = false;

  constructor(
    private dialog: MatDialog,
    private dialogRef: MatDialogRef<FiveByFiveDialogComponent>,
    private courseService: CourseService,
  ) {}

  handleClick(): void {
    if (!this.coursesNumber) { return; }

    const daySchedulerDialogRef = this.dialog.open(ConfirmationDeletionDialogComponent, {
      data: {
        title: `Tu veux vraiment réviser ${this.coursesNumber} cours ?`,
      },
    });

    daySchedulerDialogRef.afterClosed().subscribe((result: boolean) => {
      if (result) {
        this.submitting = true;
        this.handlePostFiveByFive();
      }
    });
  }

  private handlePostFiveByFive(): void {
    this.courseService.postFiveByFive(this.coursesNumber)
      .subscribe((courses) => {
        this.submitting = false;
        this.dialogRef.close();
      });
  }
}
