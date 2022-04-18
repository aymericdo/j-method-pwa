import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatListOption, MatSelectionList, MatSelectionListChange } from '@angular/material/list';
import { CourseService } from '../course.service';
import { combineLatest, forkJoin, interval, Observable, ReplaySubject } from 'rxjs';
import { ConfirmationSignoutDialogComponent } from './confirmation-signout-dialog/confirmation-signout-dialog.component';
import { RushDialogComponent } from './rush-dialog/rush-dialog.component';
import { DaySchedulerDialogComponent } from './day-scheduler-dialog/day-scheduler-dialog.component';
import { NotificationService } from '../notification.service';
import { Router } from '@angular/router';
import { selectNotifications, selectCourses, selectSelectedCourses, selectRush, selectLoadingRush, selectLoadingSetting, selectTodayCourses, selectCoursesFilter } from '../store/current-session.reducer';
import { Store, select } from '@ngrx/store';
import { setNotifications, setCourses, setSelectedCourses, setRush, setLoadingRush, setLoadingSetting, setTodayCourses, setCoursesFilter } from '../store/current-session.actions';
import { debounce, filter, take, takeUntil } from 'rxjs/operators';
import { AppState } from '../store';
import * as moment from 'moment';
import { RushService } from '../rush.service';
import { ConfirmationDeletionDialogComponent } from './confirmation-deletion-dialog/confirmation-deletion-dialog.component';
import { SettingService } from '../setting.service';

export type Difficulties = 'easy' | 'tough';

export interface Course {
  _id?: string;
  name: string;
  description: string;
  difficulties: Difficulties;
  date: string;
  ids?: string[];
  sendToGoogleCalendar?: boolean;
  sendToRush?: boolean;
  reminders: string[];
}

export interface Notification {
  _id?: string;
  course: Course;
  date: string;
  durationBefore: number;
  isOnPauseSince: string;
}

export interface Rush {
  ids?: string[];
  startDate: string;
  endDate: string;
}

@Component({
  selector: 'app-list-classes',
  templateUrl: './list-classes.component.html',
  styleUrls: ['./list-classes.component.scss']
})
export class ListClassesComponent implements OnInit {
  list$: Observable<Course[]>;
  selected$: Observable<Course[]>;
  notifications$: Observable<Notification[]>;
  rush$: Observable<Rush>;
  selectLoadingRush$: Observable<boolean>;
  selectLoadingSetting$: Observable<boolean>;
  listTodayClasses$: Observable<Course[]>;
  coursesFilter$: Observable<string>;
  deletingRush = false;
  fetching = true;
  listTodayClasses: Course[];

  fabButtons = [{
    id: 0,
    name: 'add',
    icon: 'add',
    disabled: false,
  }, {
    id: 1,
    name: 'today',
    icon: 'today',
    disabled: false,
  }, {
    id: 2,
    name: 'rush',
    icon: 'shutter_speed',
    disabled: false,
  }];

  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  constructor(
    private dialog: MatDialog,
    private courseService: CourseService,
    private notificationService: NotificationService,
    private settingService: SettingService,
    private rushService: RushService,
    private router: Router,
    private store: Store<AppState>,
  ) { }

  ngOnInit(): void {
    this.list$ = this.store.pipe(select(selectCourses));
    this.notifications$ = this.store.pipe(select(selectNotifications));
    this.selected$ = this.store.pipe(select(selectSelectedCourses));
    this.rush$ = this.store.pipe(select(selectRush));
    this.selectLoadingRush$ = this.store.pipe(select(selectLoadingRush));
    this.selectLoadingSetting$ = this.store.pipe(select(selectLoadingSetting));
    this.listTodayClasses$ = this.store.pipe(select(selectTodayCourses));
    this.coursesFilter$ = this.store.pipe(select(selectCoursesFilter));

    this.coursesFilter$.pipe(
      debounce(() => interval(300)),
      filter((courseFilter: string) => courseFilter.length > 2 || !courseFilter.length),
      takeUntil(this.destroyed$),
    ).subscribe((courseFilter: string) => {
      if (!courseFilter.length) {
        this.courseService.getCourses().subscribe((courses: Course[]) => {
          this.store.dispatch(setCourses({ courses }));
        });
      } else {
        this.courseService.getCoursesWithFilter(courseFilter).subscribe((courses: Course[]) => {
          this.store.dispatch(setCourses({ courses }));
        });
      }
    });

    this.listTodayClasses$.pipe(
      takeUntil(this.destroyed$),
    ).subscribe((listTodayClasses) => {
      this.listTodayClasses = listTodayClasses;
    });

    combineLatest([this.rush$, this.selectLoadingRush$])
      .pipe(
        takeUntil(this.destroyed$),
    ).subscribe(([rush, loading]) => {
      this.fabButtons = this.fabButtons.map((btn) => btn.name === 'rush' ? { ...btn, disabled: !!rush || loading } : { ...btn })
    });

    this.fetchEverything()
  }

  ngOnDestroy(): void {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }

  openDialog(dialog: 'scheduler' | 'signout' | 'rush' | 'deleteRush' | 'deleteCourse'): void {
    if (dialog === 'scheduler') {
      let selected = [];
      this.store.pipe(select(selectSelectedCourses), take(1)).subscribe((sltd => selected = sltd));
      const daySchedulerDialogRef = this.dialog.open(DaySchedulerDialogComponent, {
        height: '400px',
        width: '600px',
        data: { selected },
      });

      daySchedulerDialogRef.afterClosed().subscribe((result: Notification[]) => {
        if (result) {
          this.notificationService.addNotifications(result).subscribe(() => {
            this.unselectAll();
            this.router.navigate(['/daily-schedule']);
          });
        }
      });
    } else if (dialog === 'rush') {
      this.dialog.open(RushDialogComponent);
    } else if (dialog === 'deleteRush') {
      const daySchedulerDialogRef = this.dialog.open(ConfirmationDeletionDialogComponent, {
        data: {
          title: 'Voulez-vous vraiment supprimer le rush ?',
        },
      });

      daySchedulerDialogRef.afterClosed().subscribe((result: boolean) => {
        if (result) {
          this.deleteRush()
        }
      });
    } else if (dialog === 'deleteCourse') {
      const daySchedulerDialogRef = this.dialog.open(ConfirmationDeletionDialogComponent, {
        data: {
          title: 'Voulez-vous vraiment supprimer le cours ?',
        },
      });

      daySchedulerDialogRef.afterClosed().subscribe((result: boolean) => {
        if (result) {
          this.removeCourses()
        }
      });
    } else {
      this.dialog.open(ConfirmationSignoutDialogComponent);
    }
  }

  refresh(): void {
    this.fetchEverything()
  }

  onSelection(event: MatSelectionListChange, courses: MatSelectionList): void {
    this.store.dispatch(setSelectedCourses({
      selectedCourses: courses.selectedOptions.selected.map((s: MatListOption) => s.value) as Course[],
    }));
  }

  filterCourses(event: string): void {
    this.store.dispatch(setCoursesFilter({ coursesFilter: event }));
  }

  resetCoursesFilter(): void {
    this.store.dispatch(setCoursesFilter({ coursesFilter: '' }));
  }

  isSelected(course: Course): boolean {
    let selected = [];
    this.selected$.pipe(take(1)).subscribe(sltd => selected = sltd);
    return selected && selected.some(s => s._id === course._id);
  }

  isADayRevision(course: Course): boolean {
    return course.reminders.map(r => (
      moment(r).format('YYYY-MM-DD')
    )).includes(moment().format('YYYY-MM-DD'));
  }

  isAlreadyRevise(course: Course): boolean {
    return !this.listTodayClasses.some(c => c._id === course._id);
  }

  unselectAll(): void {
    this.store.dispatch(setSelectedCourses({ selectedCourses: [] }));
  }

  removeCourses(): void {
    let selected = [];
    this.selected$.pipe(take(1)).subscribe(sltd => selected = sltd);

    const deleteSelectedCourses$ = selected.map((s) => {
      return this.courseService.deleteCourse(s);
    });

    forkJoin(deleteSelectedCourses$).subscribe(() => {
      let list = [];
      this.store.pipe(select(selectCourses), take(1)).subscribe(l => list = l);

      const newList = list.filter((c: Course) => !this.isSelected(c));
      this.unselectAll();
      this.store.dispatch(setCourses({
        courses: newList,
      }));
    });
  }

  deleteRush(): void {
    this.deletingRush = true;
    this.rushService.deleteRush().subscribe(() => {
      this.deletingRush = false;
      this.store.dispatch(setLoadingRush({ loadingRush: true }));
    });
  }

  navigateTo(id: number): void {
    switch (id) {
      case 0: {
        this.router.navigate(['add-classes']);
        break;
      }

      case 1: {
        this.router.navigate(['today-classes']);
        break;
      }

      case 2: {
        this.openDialog('rush');
        break;
      }
    }
  }

  trackByMethod(index: number, el: Course): string {
    return el._id;
  }

  private fetchEverything(): void {
    this.fetching = true;
    this.notificationService.getNotifications().subscribe((notifications: Notification[]) => {
      this.store.dispatch(setNotifications({ notifications }));
    });

    let coursesFilter: string;
    this.coursesFilter$.pipe(take(1)).subscribe(c => coursesFilter = c)

    if (coursesFilter && coursesFilter.length > 2) {
      this.courseService.getCoursesWithFilter(coursesFilter).subscribe((courses: Course[]) => {
        this.fetching = false;
        this.store.dispatch(setCourses({ courses }));
      });
    } else {
      this.courseService.getCourses().subscribe((courses: Course[]) => {
        this.fetching = false;
        this.store.dispatch(setCourses({ courses }));
      });
    }

    this.rushService.getRush().subscribe(({ rush, isLoadingRush }) => {
      this.store.dispatch(setLoadingRush({ loadingRush: isLoadingRush }));
      this.store.dispatch(setRush({ rush }));
    });

    this.settingService.getSettings()
      .subscribe(({ isLoadingSetting }) => {
        this.store.dispatch(setLoadingSetting({ loadingSetting: isLoadingSetting }));
      });

    this.courseService.getTodayClasses()
      .subscribe((todayCourses) => {
        this.store.dispatch(setTodayCourses({ todayCourses }));
      });
  }
}
