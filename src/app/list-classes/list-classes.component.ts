import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
  selector: 'app-list-classes',
  templateUrl: './list-classes.component.html',
  styleUrls: ['./list-classes.component.scss']
})
export class ListClassesComponent implements OnInit {
  list = [];

  constructor(
    public dialog: MatDialog,
  ) { }

  ngOnInit(): void {
    this.list = JSON.parse(localStorage.getItem('courses')) || [];
  }

  openDialog(): void {
    this.dialog.open(ConfirmationSignoutDialogComponent);
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
