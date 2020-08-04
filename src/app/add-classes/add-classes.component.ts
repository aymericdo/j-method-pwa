import { Component, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import * as moment from 'moment';

@Component({
  selector: 'app-add-classes',
  templateUrl: './add-classes.component.html',
  styleUrls: ['./add-classes.component.scss']
})
export class AddClassesComponent {
  name = '';
  difficulties = 'easy';
  submitting = false;

  constructor(
    private router: Router,
    private zone: NgZone,
  ) {}

  saveCourses(): void {
    this.submitting = true;
    const courses = JSON.parse(localStorage.getItem('courses')) || [];

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
      description: 'A wonderful description',
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
      courses.push({ name: this.name, difficulties: this.difficulties, date: moment().format('YYYY/MM/DD'), ids });
      localStorage.setItem('courses', JSON.stringify(courses));
      this.submitting = false;
      this.zone.run(() => this.router.navigate(['/home']));
    });
  }
}
