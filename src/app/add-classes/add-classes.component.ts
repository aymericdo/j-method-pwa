import { Component } from '@angular/core';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { Difficulties, Rush } from '../list-classes/list-classes.component';
import { CourseService } from '../course.service';
import { select, Store } from '@ngrx/store';
import { addCourse } from '../store/current-session.actions';
import { AppState } from '../store';
import { selectRush } from '../store/current-session.reducer';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';

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
  sendToRush = false;
  submitting = false;
  rush$: Observable<Rush>;

  constructor(
    private router: Router,
    private courseService: CourseService,
    private store: Store<AppState>,
  ) {}

  ngOnInit(): void {
    this.rush$ = this.store.pipe(select(selectRush));
    this.rush$.pipe(take(1)).subscribe(rush => {
      this.sendToGoogleCalendar = !rush;
      this.sendToRush = !!rush;
    });
  }

  saveCourses(): void {
    this.submitting = true;

    const newCourse = {
      name: this.name,
      description: this.description,
      difficulties: this.difficulties,
      date: moment().format('YYYY-MM-DD'),
      reminders: [],
    };

    this.courseService.addCourse({
      ...newCourse,
      sendToGoogleCalendar: this.sendToGoogleCalendar,
      sendToRush: this.sendToRush,
    })
      .subscribe((course) => {
        this.store.dispatch(addCourse({ course }));
        this.submitting = false;
        this.router.navigate(['/home']);
      })
  }
}
