import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Store, select } from '@ngrx/store';
import * as moment from 'moment';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { AppState } from 'src/app/store';
import { selectCourses } from 'src/app/store/current-session.reducer';
import { Course } from '../list-classes.component';
import { RushService } from 'src/app/rush.service';
import { setRush } from 'src/app/store/current-session.actions';

@Component({
  selector: 'app-rush-dialog',
  templateUrl: './rush-dialog.component.html',
  styleUrls: ['./rush-dialog.component.scss'],
})
export class RushDialogComponent implements OnInit {
  startDate = new Date();
  endDate = null;
  list$: Observable<Course[]>;
  submitting = false;

  constructor(
    private dialogRef: MatDialogRef<RushDialogComponent>,
    private store: Store<AppState>,
    private rushService: RushService,
  ) {}

  ngOnInit(): void {
    this.list$ = this.store.pipe(select(selectCourses));
  }

  handleClick(): void {
    if (!this.endDate) { return; }
    let stillHaveTime = true;

    const momentEndDate = moment(this.endDate).set({ hour: 8, minute: 0, second: 0 });

    this.submitting = true;
    let courses: Course[] = [];
    this.list$.pipe(take(1)).subscribe((list: Course[]) => courses = list);

    const start = moment(this.startDate).set({ hour: 8, minute: 0, second: 0 });
    const events = [];

    while (stillHaveTime) {
      courses.forEach(course => {
        if (!stillHaveTime) { return; }

        const end = moment(start).add(1, 'hours');

        const res = {
          summary: course.name,
          description: course.description,
          colorId: 5,
          start: {
            dateTime: start.format(),
            timeZone: 'Europe/Paris'
          },
          end: {
            dateTime: end.format(),
            timeZone: 'Europe/Paris'
          },
          reminders: {
            useDefault: false,
            overrides: [
              { method: 'popup', minutes: 240 },
            ],
          },
        };

        start.add(1, 'hours');
        if (start.hours() === 12 && start.minutes() === 0) {
          start.add(2, 'hours');
        }

        if (start.hours() === 19 && start.minutes() === 0) {
          start.add(1, 'day').set({ hour: 8, minute: 0, second: 0 });
        }

        if (start.isAfter(momentEndDate)) {
          stillHaveTime = false;
          return null;
        }

        events.push(res);
      });
    }

    console.log(events);

    const batch = gapi.client.newBatch();

    events.forEach((e) => {
      batch.add(gapi.client.calendar.events.insert({
        calendarId: 'primary',
        resource: e,
      }));
    });

    batch.then((event) => {
      console.log('all events now dynamically added!!!');
      console.log(event);
      const ids = Object.keys(event.result).map(k => event.result[k].result.id);
      this.handleSuccess(ids);
    });
  }

  private handleSuccess(ids: string[] = null): void {
    const newRush = {
      startDate: moment(this.startDate).format(),
      endDate: moment(this.endDate).format(),
      ids,
    };

    this.rushService.addRush(newRush)
      .subscribe(() => {
        this.store.dispatch(setRush({ rush: newRush }));
        this.submitting = false;
        this.dialogRef.close();
      }, () => {
        const batch = gapi.client.newBatch();

        ids.forEach((id: string) => {
          batch.add(gapi.client.calendar.events.delete({
            calendarId: 'primary',
            eventId: id,
          }));
        });

        batch.then((event) => {
          console.log('all events now dynamically delete!!!');
          console.log(event);
          this.submitting = false;
        });
      });
  }
}
