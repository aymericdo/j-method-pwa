import { Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import * as moment from 'moment';
import { Observable } from 'rxjs';
import { CourseService } from '../course.service';
import { Course } from '../list-classes/list-classes.component';
import { AppState } from '../store';
import { setCourses } from '../store/current-session.actions';
import { selectTodayCourses } from '../store/current-session.reducer';

@Component({
  selector: 'app-today-classes',
  templateUrl: './today-classes.component.html',
  styleUrls: ['./today-classes.component.scss']
})
export class TodayClassesComponent implements OnInit {
  list$: Observable<Course[]>;

  constructor(
    private courseService: CourseService,
    private store: Store<AppState>,
  ) { }

  ngOnInit(): void {
    this.courseService.getCourses().subscribe((courses: Course[]) => {
      this.store.dispatch(setCourses({ courses }));
    });

    this.list$ = this.store.pipe(select(selectTodayCourses));
  }

  trackByMethod(index: number, el: Course): string {
    return el._id;
  }
}
