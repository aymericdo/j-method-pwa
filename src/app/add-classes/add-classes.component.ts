import { Component } from '@angular/core';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { Difficulties } from '../list-classes/list-classes.component';
import { CourseService } from '../course.service';
import { Store } from '@ngrx/store';
import { addCourse } from '../store/current-session.actions';
import { AppState } from '../store';

@Component({
  selector: 'app-add-classes',
  templateUrl: './add-classes.component.html',
  styleUrls: ['./add-classes.component.scss']
})
export class AddClassesComponent {
  name = '';
  description = '';
  difficulties: Difficulties = 'easy';
  sendToGoogleCalendar = true;
  submitting = false;

  constructor(
    private router: Router,
    private courseService: CourseService,
    private store: Store<AppState>,
  ) {}

  saveCourses(): void {
    this.submitting = true;

    const newCourse = {
      name: this.name,
      description: this.description,
      difficulties: this.difficulties,
      date: moment().format('YYYY-MM-DD'),
      reminders: [],
    };

    this.courseService.addCourse({ ...newCourse, sendToGoogleCalendar: this.sendToGoogleCalendar })
      .subscribe((course) => {
        this.store.dispatch(addCourse({ course }));
        this.submitting = false;
        this.router.navigate(['/home']);
      })
  }
}
