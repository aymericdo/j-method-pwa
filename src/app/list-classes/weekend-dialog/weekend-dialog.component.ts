import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Store, select } from '@ngrx/store';
import { AppState } from 'src/app/store';
import { takeUntil } from 'rxjs/operators';
import { ReplaySubject } from 'rxjs';
import { selectSettings } from '../../store/current-session.reducer';
import { SettingService } from 'src/app/setting.service';
import { setLoadingSetting, setSettings } from 'src/app/store/current-session.actions';
import { ConfirmationDeletionDialogComponent } from '../confirmation-deletion-dialog/confirmation-deletion-dialog.component';
import * as moment from 'moment';

export interface Weekend {
  maxCoursesNumber: number;
  endDate: string;
}

@Component({
  selector: 'app-weekend-dialog',
  templateUrl: './weekend-dialog.component.html',
  styleUrls: ['./weekend-dialog.component.scss'],
})
export class WeekendDialogComponent implements OnInit {
  maxCoursesNumber = 3;
  endDate = null;
  submitting = false;

  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  constructor(
    private dialog: MatDialog,
    private dialogRef: MatDialogRef<WeekendDialogComponent>,
    private store: Store<AppState>,
    private settingService: SettingService,
  ) {}

  ngOnInit(): void {
    this.settingService.getSettings()
      .subscribe(({ settings, isLoadingSetting }) => {
        this.store.dispatch(setLoadingSetting({ loadingSetting: isLoadingSetting }));
        this.store.dispatch(setSettings({ settings }));
      });

    this.store.pipe(
      select(selectSettings),
      takeUntil(this.destroyed$),
    ).subscribe((settings: Weekend) => {
        this.maxCoursesNumber = settings.maxCoursesNumber;
      })
  }

  ngOnDestroy(): void {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }

  handleReset(): void {
    const daySchedulerDialogRef = this.dialog.open(ConfirmationDeletionDialogComponent, {
      data: {
        title: 'Voulez-vous vraiment réinitialiser les révisions du weekend ?',
      },
    });

    daySchedulerDialogRef.afterClosed().subscribe((result: boolean) => {
      if (result) {
        this.handleResetWeekend();
      }
    });
  }

  handleClick(): void {
    if (!this.maxCoursesNumber || !this.endDate) { return; }
    this.submitting = true;

    this.settingService.postSettings({ maxCoursesNumber: this.maxCoursesNumber, endDate: moment(this.endDate).format('YYYY-MM-DD') })
      .subscribe((settings) => {
        this.submitting = false;
        this.store.dispatch(setSettings({ settings }));
        this.store.dispatch(setLoadingSetting({ loadingSetting: true }));
        this.dialogRef.close();
      });
  }

  private handleResetWeekend(): void {
    this.settingService.deleteWeekEndRevisions()
      .subscribe(() => {
        this.store.dispatch(setLoadingSetting({ loadingSetting: true }));
        this.dialogRef.close();
      });
  }
}
