import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnInit, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { SwPush } from '@angular/service-worker';
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
    @Inject(DOCUMENT) private document: Document,
    private swPush: SwPush,
    private notificationService: NotificationService,
    private router: Router,
  ) {
  }

  ngOnInit(): void {
  }

  @HostListener('document:signedin', ['$event'])
  signedIn(): void {
    if (this.router.url === '/') {
      this.router.navigateByUrl('home');
    }
    gapi.auth2.getAuthInstance().isSignedIn.listen(this.updateSigninStatus.bind(this));
    this.updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
    this.subscribeToNotifications();
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

 /**
  *  Called when the signed in status changes, to update the UI
  *  appropriately. After a sign-in, the API is called.
  */
  private updateSigninStatus(isSignedIn): void {
    if (isSignedIn) {
     this.signIn = true;
    } else {
      this.signIn = false;
      const event = new Event('signout');
      this.document.dispatchEvent(event);
    }
  }
}
