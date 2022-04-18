import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Store, select } from '@ngrx/store';
import * as moment from 'moment';
import { Observable } from 'rxjs';
import { AppState } from 'src/app/store';
import { selectCourses } from 'src/app/store/current-session.reducer';
import { Course } from '../list-classes.component';
import { RushService } from 'src/app/rush.service';
import { setLoadingRush } from 'src/app/store/current-session.actions';

@Component({
  selector: 'app-rush-dialog',
  templateUrl: './rush-dialog.component.html',
  styleUrls: ['./rush-dialog.component.scss'],
})
export class RushDialogComponent implements OnInit {
  startDate = new Date();
  endDate = null;
  isDayRevision = false;
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
    this.submitting = true;

    this.rushService.addRush(moment(this.startDate).format('YYYY-MM-DD'), moment(this.endDate).format('YYYY-MM-DD'), this.isDayRevision)
      .subscribe(() => {
        this.submitting = false;
        this.store.dispatch(setLoadingRush({ loadingRush: true }));
        this.dialogRef.close();
      });
  }
}
