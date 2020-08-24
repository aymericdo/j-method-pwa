import { Component, OnInit, OnDestroy } from '@angular/core';
import { NotificationService } from '../notification.service';
import { Notification } from '../list-classes/list-classes.component';
import * as moment from 'moment';
import { Router } from '@angular/router';

@Component({
  selector: 'app-daily-schedule',
  templateUrl: './daily-schedule.component.html',
  styleUrls: ['./daily-schedule.component.scss']
})
export class DailyScheduleComponent implements OnInit, OnDestroy {
  list: Notification[] = [];
  countdown = 0;
  displayCountdown: string;
  percentageAccomplished: string;

  private interval: NodeJS.Timeout;

  constructor(
    private notificationService: NotificationService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.notificationService.getNotifications().subscribe((notifications: Notification[]) => {
      this.list = notifications.filter((n) => moment(n.date).isAfter(moment()));
      if (this.list.length) {

        if (this.list.length) {
          this.setCountdown();
          this.setPercentageAccomplished();
        }

        this.interval = setInterval(() => {
          this.countdown -= 1;
          this.setPercentageAccomplished();
          if (this.countdown < 1) {
            this.list.shift();
            if (!this.list.length) {
              this.router.navigate(['/home']);
            } else {
              this.setCountdown();
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
  }

  setPercentageAccomplished(): void {
    if (this.list.length) {
      const totalDurationInSeconds = this.list[0].durationBefore * 60;
      this.percentageAccomplished = `${this.countdown * 100 / totalDurationInSeconds}%`;
    } else {
      this.percentageAccomplished = '100%';
    }
  }

  setCountdown(): void {
    this.countdown = +moment(this.list[0].date).diff(moment(), 'second');
  }

  trackByMethod(index: number, el: Notification): string {
    return el._id;
  }
}
