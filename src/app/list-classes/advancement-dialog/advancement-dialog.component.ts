import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Store, select } from '@ngrx/store';
import { AppState } from 'src/app/store';
import { map, takeUntil } from 'rxjs/operators';
import { ReplaySubject } from 'rxjs';
import { selectSelectedCourses } from '../../store/current-session.reducer';
import { CourseService } from 'src/app/course.service';
import { Course } from 'src/app/list-classes/list-classes.component';
import { setCourse, setSelectedCourses } from 'src/app/store/current-session.actions';

@Component({
  selector: 'app-advancement-dialog',
  templateUrl: './advancement-dialog.component.html',
  styleUrls: ['./advancement-dialog.component.scss'],
})
export class AdvancementDialogComponent implements OnInit {
  submitting = false;
  selectedCourse = null;
  revisionsChoices = [];
  selected = null;

  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  constructor(
    private dialogRef: MatDialogRef<AdvancementDialogComponent>,
    private store: Store<AppState>,
    private courseService: CourseService,
  ) {}

  ngOnInit(): void {
    this.store.pipe(
      select(selectSelectedCourses),
      map((selectedCourses) => selectedCourses[0]),
      takeUntil(this.destroyed$),
    ).subscribe((selectedCourse: Course) => {
        this.selectedCourse = selectedCourse;
        this.selected = selectedCourse.advancement || 0;
        const maxAdvancement = selectedCourse.difficulties === 'easy' ? 4 : 5;
        this.revisionsChoices = [...Array(maxAdvancement).keys()].map((index) => {
          return {
            label: `Revision ${index + 1}`,
            value: index,
          };
        });
      });
  }

  ngOnDestroy(): void {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }

  handleClick(): void {
    this.submitting = true;
    this.courseService.patchCourses({ ...this.selectedCourse, advancement: this.selected }).subscribe((course: Course) => {
      this.store.dispatch(setCourse({ course }));
      this.store.dispatch(setSelectedCourses({ selectedCourses: [course] }));
      this.submitting = false;
      this.dialogRef.close();
    });
  }
}
