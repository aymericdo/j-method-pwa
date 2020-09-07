import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatListOption, MatSelectionList, MatSelectionListChange } from '@angular/material/list';
import { CourseService } from '../course.service';
import { forkJoin, Observable } from 'rxjs';
import { ConfirmationSignoutDialogComponent } from './confirmation-signout-dialog/confirmation-signout-dialog.component';
import { DaySchedulerDialogComponent } from './day-scheduler-dialog/day-scheduler-dialog.component';
import { NotificationService } from '../notification.service';
import { Router } from '@angular/router';
import { selectNotifications, selectCourses, selectSelectedCourses } from '../store/current-session.reducer';
import { Store, select } from '@ngrx/store';
import { setNotifications, setCourses, setSelectedCourses } from '../store/current-session.actions';
import { take } from 'rxjs/operators';
import { AppState } from '../store';
import * as moment from 'moment';

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
  isOnPauseSince: string;
}

@Component({
  selector: 'app-list-classes',
  templateUrl: './list-classes.component.html',
  styleUrls: ['./list-classes.component.scss']
})
export class ListClassesComponent implements OnInit {
  list$: Observable<Course[]>;
  selected$: Observable<Course[]>;
  notifications$: Observable<Notification[]>;

  constructor(
    private dialog: MatDialog,
    private courseService: CourseService,
    private notificationService: NotificationService,
    private router: Router,
    private store: Store<AppState>,
  ) { }

  ngOnInit(): void {
    this.notificationService.getNotifications().subscribe((notifications: Notification[]) => {
      this.store.dispatch(setNotifications({ notifications }));
    });

    this.courseService.getCourses().subscribe((courses: Course[]) => {
      this.store.dispatch(setCourses({ courses }));
    });

    this.list$ = this.store.pipe(select(selectCourses));
    this.notifications$ = this.store.pipe(select(selectNotifications));
    this.selected$ = this.store.pipe(select(selectSelectedCourses));
  }

  openDialog(dialog: 'scheduler' | 'signout'): void {
    if (dialog === 'scheduler') {
      let selected = [];
      this.store.pipe(select(selectSelectedCourses), take(1)).subscribe((sltd => selected = sltd));
      const daySchedulerDialogRef = this.dialog.open(DaySchedulerDialogComponent, {
        height: '400px',
        width: '600px',
        data: { selected },
      });

      daySchedulerDialogRef.afterClosed().subscribe((result: Notification[]) => {
        if (result) {
          this.notificationService.addNotifications(result).subscribe(() => {
            this.unselectAll();
            this.router.navigate(['/daily-schedule']);
          });
        }
      });
    } else {
      this.dialog.open(ConfirmationSignoutDialogComponent);
    }
  }

  onSelection(event: MatSelectionListChange, courses: MatSelectionList): void {
    this.store.dispatch(setSelectedCourses({
      selectedCourses: courses.selectedOptions.selected.map((s: MatListOption) => s.value) as Course[],
    }));
  }

  isSelected(course: Course): boolean {
    let selected = [];
    this.store.pipe(select(selectSelectedCourses), take(1)).subscribe(sltd => selected = sltd);
    return selected && selected.some(s => s._id === course._id);
  }

  isADayRevision(course: Course): boolean {
    const creationDate = moment(course.date);
    const reminders: string[] = [];
    reminders.push(creationDate.add(1, 'day').format('YYYY-MM-DD'));
    if (course.difficulties === 'tough') {
      reminders.push(moment().add(2, 'day').format('YYYY-MM-DD'));
    }
    reminders.push(creationDate.add(5, 'day').format('YYYY-MM-DD'));
    reminders.push(creationDate.add(15, 'day').format('YYYY-MM-DD'));
    reminders.push(creationDate.add(30, 'day').format('YYYY-MM-DD'));

    return reminders.includes(moment().format('YYYY-MM-DD'));
  }

  unselectAll(): void {
    this.store.dispatch(setSelectedCourses({ selectedCourses: [] }));
  }

  removeCourses(): void {
    let selected = [];
    this.store.pipe(select(selectSelectedCourses), take(1)).subscribe(sltd => selected = sltd);

    const deleteSelectedCourses$ = selected.map((s) => {
      return this.courseService.deleteCourse(s);
    });

    forkJoin(deleteSelectedCourses$).subscribe(() => {
      const batch = gapi.client.newBatch();

      const googleCalendarCourses = selected.map(s => s.ids).filter(Boolean);

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
    let list = [];
    this.store.pipe(select(selectCourses), take(1)).subscribe(l => list = l);

    const newList = list.filter((c: Course) => !this.isSelected(c));
    this.unselectAll();
    this.store.dispatch(setCourses({
      courses: newList,
    }));
  }

  trackByMethod(index: number, el: Course): string {
    return el._id;
  }
}
