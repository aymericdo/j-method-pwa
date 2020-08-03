import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  signIn = false;
  title = 'j-meth';

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private router: Router,
  ) {
  }

  ngOnInit(): void {
    document.getElementById('googleBtn').style.display = 'none';
    this.document.addEventListener('signedin', () => {
      if (this.router.url === '/') {
        this.router.navigateByUrl('home');
      }
      gapi.auth2.getAuthInstance().isSignedIn.listen(this.updateSigninStatus.bind(this));
      this.updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
    });
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
