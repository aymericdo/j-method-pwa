import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { DaySchedulerDialogComponent } from './day-scheduler-dialog.component';

describe('DaySchedulerDialogComponent', () => {
  let component: DaySchedulerDialogComponent;
  let fixture: ComponentFixture<DaySchedulerDialogComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DaySchedulerDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DaySchedulerDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
