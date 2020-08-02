import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-list-classes',
  templateUrl: './list-classes.component.html',
  styleUrls: ['./list-classes.component.scss']
})
export class ListClassesComponent implements OnInit {
  list = [];

  constructor() { }

  ngOnInit(): void {
    this.list = JSON.parse(localStorage.getItem('courses')) || [];
  }
}
