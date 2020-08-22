import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { Course, Difficulties, Notification } from '../list-classes.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import * as moment from 'moment';
import { HoursSelectorDialogComponent } from '../hours-selector-dialog/hours-selector-dialog.component';

@Component({
  selector: 'app-day-scheduler-dialog',
  templateUrl: 'day-scheduler-dialog.component.html',
  styleUrls: ['day-scheduler-dialog.component.scss'],
})
export class DaySchedulerDialogComponent implements OnInit, OnDestroy {
  durationList: { duration: number, course: Course }[];
  endOfTheDay: string;

  private interval: NodeJS.Timeout;

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: { selected: Course[] },
    private bottomSheet: MatBottomSheet,
    private dialogRef: MatDialogRef<DaySchedulerDialogComponent>,
  ) { }

  ngOnInit(): void {
    this.interval = setInterval(() => {
      const secs = new Date().getSeconds().toString();
      if (+secs === 0) {
        this.updateEndOfTheDay();
      }
    }, 1000);

    this.durationList = this.data.selected.map(s => ({ course: s, duration: this.difficultiesToDuration(s.difficulties) }));
    this.updateEndOfTheDay();
  }

  ngOnDestroy(): void {
    clearInterval(this.interval);
  }

  editTimer({ duration, course }): void {
    const bottomSheetRef = this.bottomSheet.open(HoursSelectorDialogComponent, {
      data: { duration },
    });

    const sub = bottomSheetRef.instance.deltaChanged.subscribe((minutes: number) => {
      this.durationList = this.durationList.map(dl =>
        dl.course._id === course._id ? {
          course,
          duration: minutes,
        } : dl
      );

      this.updateEndOfTheDay();
    });

    bottomSheetRef.afterDismissed().subscribe(() => {
      sub.unsubscribe();
    });
  }

  updateEndOfTheDay(): void {
    const now = moment();
    this.durationList.forEach(dl => {
      now.add(dl.duration, 'minutes');
    });
    this.endOfTheDay = now.format('HH:mm');
  }

  handleSubmit(): void {
    const currentDate = moment();
    const notifs: Notification[] = [];
    this.durationList.forEach(dl => {
      notifs.push({
        course: dl.course,
        date: currentDate.add(dl.duration, 'minute').format(),
      });
    });

    this.dialogRef.close(notifs);
  }

  trackByMethod(index: number, el: Course): string {
    return el.name;
  }

  private difficultiesToDuration(difficulties: Difficulties): number {
    return difficulties === 'easy' ? 60 : 120;
  }
}
