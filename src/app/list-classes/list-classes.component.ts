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
  selected = [];

  constructor(
    public dialog: MatDialog,
  ) { }

  ngOnInit(): void {
    this.list = JSON.parse(localStorage.getItem('courses')) || [];
  }

  openDialog(): void {
    this.dialog.open(ConfirmationSignoutDialogComponent);
  }

  onSelection(event, courses): void {
    this.selected = courses.selectedOptions.selected;
  }

  removeCourses(): void {
    const courses = JSON.parse(localStorage.getItem('courses'));
    const newList = courses.filter((c) => !this.selected.map(s => s.value.name).includes(c.name));
    this.selected = [];
    this.list = newList;
    localStorage.setItem('courses', JSON.stringify(newList));
  }

  trackByMethod(index: number, el): string {
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
