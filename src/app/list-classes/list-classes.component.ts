import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatListOption, MatSelectionList, MatSelectionListChange } from '@angular/material/list';
import { CourseService } from '../course.service';
import { forkJoin, Observable } from 'rxjs';
import { ConfirmationSignoutDialogComponent } from './confirmation-signout-dialog/confirmation-signout-dialog.component';
import { RushDialogComponent } from './rush-dialog/rush-dialog.component';
import { DaySchedulerDialogComponent } from './day-scheduler-dialog/day-scheduler-dialog.component';
import { NotificationService } from '../notification.service';
import { Router } from '@angular/router';
import { selectNotifications, selectCourses, selectSelectedCourses, selectRush } from '../store/current-session.reducer';
import { Store, select } from '@ngrx/store';
import { setNotifications, setCourses, setSelectedCourses, setRush } from '../store/current-session.actions';
import { take } from 'rxjs/operators';
import { AppState } from '../store';
import * as moment from 'moment';
import { RushService } from '../rush.service';

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

export interface Rush {
  ids?: string[];
  startDate: string;
  endDate: string;
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
  rush$: Observable<Rush>;
  deletingRush = false;

  fabButtons = [{
    id: 0,
    icon: 'add',
  }, {
    id: 1,
    icon: 'hourglass_bottom',
  }, {
    id: 2,
    icon: 'shutter_speed',
  }];

  constructor(
    private dialog: MatDialog,
    private courseService: CourseService,
    private notificationService: NotificationService,
    private rushService: RushService,
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

    this.rushService.getRush().subscribe((rush: Rush) => {
      this.store.dispatch(setRush({ rush }));
    });

    this.list$ = this.store.pipe(select(selectCourses));
    this.notifications$ = this.store.pipe(select(selectNotifications));
    this.selected$ = this.store.pipe(select(selectSelectedCourses));
    this.rush$ = this.store.pipe(select(selectRush));
  }

  openDialog(dialog: 'scheduler' | 'signout' | 'rush'): void {
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
    } else if (dialog === 'rush') {
      this.dialog.open(RushDialogComponent);
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
    this.selected$.pipe(take(1)).subscribe(sltd => selected = sltd);
    return selected && selected.some(s => s._id === course._id);
  }

  isADayRevision(course: Course): boolean {
    const reminders: string[] = [];
    reminders.push(moment(course.date).add(1, 'day').format('YYYY-MM-DD'));
    if (course.difficulties === 'tough') {
      reminders.push(moment(course.date).add(2, 'day').format('YYYY-MM-DD'));
    }
    reminders.push(moment(course.date).add(5, 'day').format('YYYY-MM-DD'));
    reminders.push(moment(course.date).add(15, 'day').format('YYYY-MM-DD'));
    reminders.push(moment(course.date).add(30, 'day').format('YYYY-MM-DD'));

    return reminders.includes(moment().format('YYYY-MM-DD'));
  }

  unselectAll(): void {
    this.store.dispatch(setSelectedCourses({ selectedCourses: [] }));
  }

  removeCourses(): void {
    let selected = [];
    this.selected$.pipe(take(1)).subscribe(sltd => selected = sltd);

    const googleCalendarCourses = selected.map(s => s.ids).filter(Boolean);

    if (googleCalendarCourses.length) {
      const batch = gapi.client.newBatch();

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
        this.handleSuccess(selected);
      });
    } else {
      this.handleSuccess(selected);
    }
  }

  deleteRush(): void {
    this.deletingRush = true;
    let rush = null;
    this.rush$.pipe(take(1)).subscribe(r => rush = r);

    const batch = gapi.client.newBatch();

    rush.ids.forEach((id: string) => {
      batch.add(gapi.client.calendar.events.delete({
        calendarId: 'primary',
        eventId: id,
      }));
    });

    batch.then((event) => {
      console.log('all events now dynamically delete!!!');
      console.log(event);

      this.rushService.deleteRush().subscribe(() => {
        this.deletingRush = false;
        this.store.dispatch(setRush({ rush: null }));
      });
    });
  }

  navigateTo(id: number): void {
    switch (id) {
      case 0: {
        this.router.navigate(['add-classes']);
        break;
      }

      case 1: {
        this.router.navigate(['today-classes']);
        break;
      }

      case 2: {
        this.openDialog('rush');
        break;
      }
    }
  }

  private handleSuccess(selected: Course[]): void {
    const deleteSelectedCourses$ = selected.map((s) => {
      return this.courseService.deleteCourse(s);
    });

    forkJoin(deleteSelectedCourses$).subscribe(() => {
      let list = [];
      this.store.pipe(select(selectCourses), take(1)).subscribe(l => list = l);

      const newList = list.filter((c: Course) => !this.isSelected(c));
      this.unselectAll();
      this.store.dispatch(setCourses({
        courses: newList,
      }));
    });
  }

  trackByMethod(index: number, el: Course): string {
    return el._id;
  }
}
