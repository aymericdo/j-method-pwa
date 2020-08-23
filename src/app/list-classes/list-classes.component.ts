import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatListOption, MatSelectionList, MatSelectionListChange } from '@angular/material/list';
import { CourseService } from '../course.service';
import { forkJoin } from 'rxjs';
import { ConfirmationSignoutDialogComponent } from './confirmation-signout-dialog/confirmation-signout-dialog.component';
import { DaySchedulerDialogComponent } from './day-scheduler-dialog/day-scheduler-dialog.component';
import { NotificationService } from '../notification.service';
import { Router } from '@angular/router';

export type Difficulties = 'easy' | 'tough';

export interface Course {
  _id?: string;
  name: string;
  description: string;
  difficulties: Difficulties;
  date: string;
  ids?: string[];
}

export interface Notification {
  _id?: string;
  course: Course;
  date: string;
  durationBefore: number;
}

@Component({
  selector: 'app-list-classes',
  templateUrl: './list-classes.component.html',
  styleUrls: ['./list-classes.component.scss']
})
export class ListClassesComponent implements OnInit {
  list: Course[] = [];
  selected: Course[] = [];

  constructor(
    private dialog: MatDialog,
    private courseService: CourseService,
    private notificationService: NotificationService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.courseService.getCourses().subscribe((courses: Course[]) => {
      this.list = courses;
    });
  }

  openDialog(dialog: 'scheduler' | 'signout'): void {
    if (dialog === 'scheduler') {
      const daySchedulerDialogRef = this.dialog.open(DaySchedulerDialogComponent, {
        height: '400px',
        width: '600px',
        data: { selected: this.selected },
      });

      daySchedulerDialogRef.afterClosed().subscribe((result: Notification[]) => {
        if (result) {
          this.notificationService.addNotifications(result).subscribe(() => {
            this.router.navigate(['/daily-schedule']);
          });
        }
      });
    } else {
      this.dialog.open(ConfirmationSignoutDialogComponent);
    }
  }

  onSelection(event: MatSelectionListChange, courses: MatSelectionList): void {
    this.selected = courses.selectedOptions.selected.map((s: MatListOption) => s.value);
  }

  isSelected(course: Course): boolean {
    return this.selected.some(s => s._id === course._id);
  }

  unselectAll(): void {
    this.selected = [];
  }

  scheduleCourses(): void {
    console.log(this.selected.map(s => s.ids));
  }

  removeCourses(): void {
    const deleteSelectedCourses$ = this.selected.map((s) => {
      return this.courseService.deleteCourse(s);
    });

    forkJoin(deleteSelectedCourses$).subscribe(() => {
      const batch = gapi.client.newBatch();

      const googleCalendarCourses = this.selected.map(s => s.ids).filter(Boolean);

      if (googleCalendarCourses.length) {
        googleCalendarCourses.forEach((ids) => {
          ids.forEach((id: string) => {
            batch.add(gapi.client.calendar.events.delete({
              calendarId: 'primary',
              eventId: id,
            }));
          });
        });

        batch.then((event) => {
          console.log('all events now dynamically delete!!!');
          console.log(event);
          this.handleSuccess();
        });
      } else {
        this.handleSuccess();
      }
    });
  }

  private handleSuccess(): void {
    const newList = this.list.filter((c: Course) => !this.isSelected(c));
    this.selected = [];
    this.list = newList;
  }

  trackByMethod(index: number, el: Course): string {
    return el._id;
  }
}
