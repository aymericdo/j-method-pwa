import { Component, OnInit, OnDestroy } from '@angular/core';
import { NotificationService } from '../notification.service';
import { Notification } from '../list-classes/list-classes.component';
import * as moment from 'moment';

@Component({
  selector: 'app-daily-schedule',
  templateUrl: './daily-schedule.component.html',
  styleUrls: ['./daily-schedule.component.scss']
})
export class DailyScheduleComponent implements OnInit, OnDestroy {
  list: Notification[] = [];
  countdown: number;
  displayCountdown: string;

  private interval: NodeJS.Timeout;

  constructor(
    private notificationService: NotificationService,
  ) { }

  ngOnInit(): void {
    this.notificationService.getNotifications().subscribe((notifications: Notification[]) => {
      if (notifications.length) {
        this.list = notifications.filter((n) => moment(n.date).isAfter(moment()));
        this.countdown = +moment(this.list[0].date).diff(moment(), 'second');

        this.interval = setInterval(() => {
          this.countdown -= 1;
          this.displayCountdown = new Date(this.countdown * 1000).toISOString().substr(11, 8);
        }, 1000);
      }
    });
  }

  ngOnDestroy(): void {
    clearInterval(this.interval);
  }

  trackByMethod(index: number, el: Notification): string {
    return el._id;
  }
}
