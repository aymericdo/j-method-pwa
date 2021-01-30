import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ListClassesComponent } from './list-classes.component';

describe('ListClassesComponent', () => {
  let component: ListClassesComponent;
  let fixture: ComponentFixture<ListClassesComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ListClassesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListClassesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
