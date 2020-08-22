import { Component, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { Course, Difficulties } from '../list-classes/list-classes.component';
import { CourseService } from '../course.service';

@Component({
  selector: 'app-add-classes',
  templateUrl: './add-classes.component.html',
  styleUrls: ['./add-classes.component.scss']
})
export class AddClassesComponent {
  name = '';
  description = '';
  difficulties: Difficulties = 'easy';
  sendToGoogleCalendar = false;
  submitting = false;

  constructor(
    private router: Router,
    private zone: NgZone,
    private courseService: CourseService,
  ) {}

  saveCourses(): void {
    this.submitting = true;

    const reminders: string[] = [];
    reminders.push(moment().add(1, 'day').format('YYYY-MM-DD'));
    if (this.difficulties === 'tough') {
      reminders.push(moment().add(2, 'day').format('YYYY-MM-DD'));
    }
    reminders.push(moment().add(5, 'day').format('YYYY-MM-DD'));
    reminders.push(moment().add(15, 'day').format('YYYY-MM-DD'));
    reminders.push(moment().add(30, 'day').format('YYYY-MM-DD'));

    const events = reminders.map(e => ({
      summary: this.name,
      description: this.description,
      start: {
        date: e,
        timeZone: 'Europe/Paris'
      },
      end: {
        date: e,
        timeZone: 'Europe/Paris'
      },
      reminders: {
        useDefault: false,
        overrides: [
          { method: 'popup', minutes: 240 },
        ]
      }
    }));

    if (this.sendToGoogleCalendar) {
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
    } else {
      this.handleSuccess();
    }
  }

  private handleSuccess(ids: string[] = null): void {
    const newCourse = {
      name: this.name,
      description: this.description,
      difficulties: this.difficulties,
      date: moment().format('YYYY-MM-DD'),
      ids,
    };

    this.courseService.addCourse(newCourse)
      .subscribe(() => {
        this.submitting = false;
        this.zone.run(() => this.router.navigate(['/home']));
      });
  }
}
