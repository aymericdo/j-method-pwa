import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { select, Store } from '@ngrx/store';
import * as moment from 'moment';
import { forkJoin, Observable } from 'rxjs';
import { CourseService } from '../course.service';
import { ConfirmationDeletionDialogComponent } from '../list-classes/confirmation-deletion-dialog/confirmation-deletion-dialog.component';
import { Course } from '../list-classes/list-classes.component';
import { AppState } from '../store';
import { setTodayCourses } from '../store/current-session.actions';
import { selectTodayCourses } from '../store/current-session.reducer';

@Component({
  selector: 'app-today-classes',
  templateUrl: './today-classes.component.html',
  styleUrls: ['./today-classes.component.scss']
})
export class TodayClassesComponent implements OnInit {
  list$: Observable<Course[]>;

  constructor(
    private dialog: MatDialog,
    private courseService: CourseService,
    private store: Store<AppState>,
  ) { }

  ngOnInit(): void {
    this.fetchData()
    this.list$ = this.store.pipe(select(selectTodayCourses));
  }

  deleteCourse(course: Course): void {
    this.courseService.postTodayClasses({ course })
      .subscribe(() => {
        this.fetchData();
      })
  }

  openDialog($event: Event, dialog: 'deleteCourse', course: Course): void {
    $event.stopPropagation();
    $event.preventDefault();

    if (dialog === 'deleteCourse') {
      const daySchedulerDialogRef = this.dialog.open(ConfirmationDeletionDialogComponent, {
        data: {
          title: 'Avez-vous révisé ce cours ?',
        },
      });

      daySchedulerDialogRef.afterClosed().subscribe((result: boolean) => {
        if (result) {
          this.deleteCourse(course)
        }
      });
    }
  }

  private fetchData() {
    this.courseService.getTodayClasses()
      .subscribe((todayCourses) => {
        this.store.dispatch(setTodayCourses({ todayCourses }));
      });
  }
}
