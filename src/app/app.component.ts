import { Component, OnInit } from '@angular/core';
import { SwPush } from '@angular/service-worker';
import { environment } from 'src/environments/environment';
import { AuthService } from './auth.service';
import { NotificationService } from './notification.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  signIn = false;
  title = 'j-meth';

  readonly VAPID_PUBLIC_KEY = 'BA0IrWNjeSUg-vrORw1qaiMZ4-echF259O25I42NywBlbC3f7OzdiJjooH27nOzjtID5EoQ4pZO1wOo7lzwi7iQ';

  constructor(
    private swPush: SwPush,
    private notificationService: NotificationService,
    private auth: AuthService,
  ) {
  }

  ngOnInit(): void {
    if (environment.production && this.auth.isAuthenticated()) {
      this.subscribeToNotifications();
    }
  }

  subscribeToNotifications(): void {
    this.swPush.requestSubscription({
      serverPublicKey: this.VAPID_PUBLIC_KEY,
    })
    .then(sub => {
      this.notificationService.postSub(sub).subscribe();
    })
    .catch(err => console.error('Could not subscribe to notifications', err));
  }
}
