import { Component, OnInit } from '@angular/core';
import { ReplaySubject } from 'rxjs';
import { Course } from 'src/app/list-classes/list-classes.component';
import { CourseService } from 'src/app/course.service';
import { FiveByFiveDialogComponent } from 'src/app/list-classes/five-by-five-dialog/five-by-five-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-five-by-five',
  templateUrl: './five-by-five.component.html',
  styleUrls: ['./five-by-five.component.scss'],
})
export class FiveByFiveComponent implements OnInit {
  courses: Course[] = [];
  fetching = false;

  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  constructor(
    private dialog: MatDialog,
    private courseService: CourseService,
  ) { }

  ngOnInit(): void {
    this.fetching = true;
    this.getPostFiveByFive();
  }

  ngOnDestroy(): void {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }

  handleNextCourses(): void {
    const dialogRef = this.dialog.open(FiveByFiveDialogComponent);

    dialogRef.afterClosed().subscribe(() => {
      this.getPostFiveByFive();
    });
  }

  courseById(index, course) {
    return course._id;
  }

  private getPostFiveByFive(): void {
    this.courseService.getFiveByFive()
      .subscribe((courses) => {
        this.courses = courses;
        this.fetching = false;
      });
  }
}
