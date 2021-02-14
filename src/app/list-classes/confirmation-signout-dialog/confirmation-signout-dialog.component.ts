import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-confirmation-signout-dialog',
  templateUrl: './confirmation-signout-dialog.component.html',
})
export class ConfirmationSignoutDialogComponent {
  constructor(
    private router: Router,
  ) { }

  /**
   *  Sign out the user upon button click.
   */
  handleSignoutClick(): void {
    localStorage.clear();
    this.router.navigateByUrl('/');
  }
}
