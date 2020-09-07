import { Component, OnInit, OnDestroy } from '@angular/core';
import { NotificationService } from '../notification.service';
import { Notification } from '../list-classes/list-classes.component';
import * as moment from 'moment';
import { Router } from '@angular/router';
import { Observable, ReplaySubject } from 'rxjs';
import { takeUntil, filter } from 'rxjs/operators';
import { setNotifications, shiftNotification } from '../store/current-session.actions';
import { Store, select } from '@ngrx/store';
import { selectNotifications, selectIsOnPause } from '../store/current-session.reducer';
import { AppState } from '../store';

@Component({
  selector: 'app-daily-schedule',
  templateUrl: './daily-schedule.component.html',
  styleUrls: ['./daily-schedule.component.scss']
})
export class DailyScheduleComponent implements OnInit, OnDestroy {
  notifications$: Observable<Notification[]>;
  onPause$: Observable<boolean>;
  countdown = 0;
  displayCountdown: string;
  percentageAccomplished: string;
  notifications: Notification[];

  private interval: NodeJS.Timeout;
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  constructor(
    private notificationService: NotificationService,
    private router: Router,
    private store: Store<AppState>,
  ) { }

  ngOnInit(): void {
    this.notifications$ = this.store.pipe(select(selectNotifications));
    this.onPause$ = this.store.pipe(select(selectIsOnPause));

    this.notificationService.getNotifications().subscribe((notifications: Notification[]) => {
      this.store.dispatch(setNotifications({ notifications }));
    });

    this.notifications$.pipe(filter(notifs => !!notifs.length), takeUntil(this.destroyed$)).subscribe((notifications: Notification[]) => {
      clearInterval(this.interval);

      this.setCountdown(notifications);
      this.setPercentageAccomplished(notifications);

      this.notifications = notifications;

      if (!notifications[0].isOnPauseSince) {
        this.interval = setInterval(() => {
          this.countdown -= 1;
          this.setPercentageAccomplished(notifications);
          if (this.countdown < 1) {
            this.store.dispatch(shiftNotification());
            if (notifications.length < 2) {
              this.router.navigate(['/home']);
            }
          } else {
            this.displayCountdown = new Date(this.countdown * 1000).toISOString().substr(11, 8);
          }
        }, 1000);
      }
    });
  }

  ngOnDestroy(): void {
    clearInterval(this.interval);
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }

  setPercentageAccomplished(notifications: Notification[]): void {
    const totalDurationInSeconds = notifications[0].durationBefore * 60;
    this.percentageAccomplished = `${this.countdown * 100 / totalDurationInSeconds}%`;
  }

  setCountdown(notifications: Notification[]): void {
    if (notifications[0].isOnPauseSince) {
      this.countdown = +moment(notifications[0].date).diff(moment(notifications[0].isOnPauseSince), 'second');
    } else {
      this.countdown = +moment(notifications[0].date).diff(moment(), 'second');
    }
    this.displayCountdown = new Date(this.countdown * 1000).toISOString().substr(11, 8);
  }

  togglePauseMode(): void {
    this.notificationService.pauseNotifications().subscribe((notifications: Notification[]) => {
      this.store.dispatch(setNotifications({ notifications }));
    });
  }

  nextCourse(): void {
    this.notificationService.deleteNotifications(this.notifications[0]._id).subscribe((notifications: Notification[]) => {
      this.store.dispatch(setNotifications({ notifications }));
    });
  }

  trackByMethod(index: number, el: Notification): string {
    return el._id;
  }
}
