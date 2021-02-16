import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store, select } from '@ngrx/store';
import * as moment from 'moment';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { CourseService } from '../course.service';
import { Course } from '../list-classes/list-classes.component';
import { AppState } from '../store';
import { setCourse, setCourses } from '../store/current-session.actions';
import { selectOpenedCourse } from '../store/current-session.reducer';

@Component({
  selector: 'app-description-class',
  templateUrl: './description-class.component.html',
  styleUrls: ['./description-class.component.scss']
})
export class DescriptionClassComponent implements OnInit {
  selectedCourse$: Observable<Course>;
  editMode: boolean;
  submitting: boolean = false;
  description = '';

  constructor(
    private courseService: CourseService,
    private store: Store<AppState>,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    const courseId = this.route.snapshot.paramMap.get('id');

    this.courseService.getCourses().subscribe((courses: Course[]) => {
      this.store.dispatch(setCourses({ courses }));
    });

    this.selectedCourse$ = this.store.pipe(select(selectOpenedCourse(courseId)));
  }

  createdDate(date): string {
    return moment(date).format('DD/MM/YYYY');
  }

  editModeToggle(): void {
    this.editMode = true
  }

  submitDescription(): void {
    this.editMode = false;
    let course = null;
    this.selectedCourse$.pipe(take(1)).subscribe((c) => course = c);

    this.store.dispatch(setCourse({ course: { ...course, description: this.description } }));

    this.courseService.patchCourses({ ...course, description: this.description }).subscribe((course: Course) => {
      this.store.dispatch(setCourse({ course }));
    });
  }
}
