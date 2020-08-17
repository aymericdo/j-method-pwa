import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { MatListOption, MatSelectionList, MatSelectionListChange } from '@angular/material/list';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { HoursSelectorComponent } from './hours-selector/hours-selector.dialog';
import * as moment from 'moment';

type Difficulties = 'easy' | 'tough';

interface Course {
  name: string;
  description: string;
  difficulties: Difficulties;
  date: string;
  ids: string[];
}

@Component({
  selector: 'app-list-classes',
  templateUrl: './list-classes.component.html',
  styleUrls: ['./list-classes.component.scss']
})
export class ListClassesComponent implements OnInit {
  list: Course[] = [];
  selected: Course[] = [];

  constructor(
    public dialog: MatDialog,
  ) { }

  ngOnInit(): void {
    this.list = JSON.parse(localStorage.getItem('courses')) || [];
  }

  openDialog(dialog: 'scheduler' | 'signout'): void {
    if (dialog === 'scheduler') {
      this.dialog.open(DaySchedulerDialogComponent, {
        height: '400px',
        width: '600px',
        data: { selected: this.selected },
      });
    } else {
      this.dialog.open(ConfirmationSignoutDialogComponent);
    }
  }

  onSelection(event: MatSelectionListChange, courses: MatSelectionList): void {
    this.selected = courses.selectedOptions.selected.map((s: MatListOption) => s.value);
  }

  isSelected(course: Course): boolean {
    return this.selected.some(s => s.ids.every(id => course.ids.includes(id)));
  }

  unselectAll(): void {
    this.selected = [];
  }

  scheduleCourses(): void {
    console.log(this.selected.map(s => s.ids));
  }

  removeCourses(): void {
    const courses = JSON.parse(localStorage.getItem('courses'));

    const batch = gapi.client.newBatch();

    this.selected.map(s => s.ids).forEach((ids) => {
      ids.forEach((id: string) => {
        batch.add(gapi.client.calendar.events.delete({
          calendarId: 'primary',
          eventId: id,
        }));
      });
    });

    // batch.then((event) => {
    //   console.log('all events now dynamically delete!!!');
    //   console.log(event);
    // });

    const newList = courses.filter((c: Course) => !this.isSelected(c));
    this.selected = [];
    this.list = newList;
    localStorage.setItem('courses', JSON.stringify(newList));
  }

  trackByMethod(index: number, el: Course): string {
    return el.name;
  }
}

@Component({
  selector: 'app-confirmation-signout-dialog',
  templateUrl: 'confirmation-signout-dialog.html',
})
export class ConfirmationSignoutDialogComponent {
  constructor(
    private router: Router,
  ) { }

  /**
   *  Sign out the user upon button click.
   */
  handleSignoutClick(): void {
    gapi.auth2.getAuthInstance().signOut();
    this.router.navigateByUrl('/');
  }
}

@Component({
  selector: 'app-day-scheduler-dialog',
  templateUrl: 'day-scheduler-dialog.html',
  styleUrls: ['day-scheduler-dialog.scss'],
})
export class DaySchedulerDialogComponent implements OnInit {
  durationList: { duration: number, course: Course }[];
  endOfTheDay: string;

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: { selected: Course[] },
    private bottomSheet: MatBottomSheet,
  ) { }

  ngOnInit(): void {
    this.durationList = this.data.selected.map(s => ({ course: s, duration: this.difficultiesToDuration(s.difficulties) }));
    this.updateEndOfTheDay();
  }

  handleClick(): void {
  }

  editTimer({ duration, course }): void {
    const bottomSheetRef = this.bottomSheet.open(HoursSelectorComponent, {
      data: { duration },
    });

    const sub = bottomSheetRef.instance.deltaChanged.subscribe((minutes: number) => {
      this.durationList = this.durationList.map((dl) => {
        if (dl.course.ids.every(id => course.ids.includes(id))) {
          return {
            course,
            duration: minutes,
          };
        } else {
          return dl;
        }
      });

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

  trackByMethod(index: number, el: Course): string {
    return el.name;
  }

  private difficultiesToDuration(difficulties: Difficulties): number {
    return difficulties === 'easy' ? 60 : 120;
  }
}
