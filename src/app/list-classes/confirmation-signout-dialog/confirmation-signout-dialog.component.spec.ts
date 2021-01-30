import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ConfirmationSignoutDialogComponent } from './confirmation-signout-dialog.component';

describe('ConfirmationSignoutDialogComponent', () => {
  let component: ConfirmationSignoutDialogComponent;
  let fixture: ComponentFixture<ConfirmationSignoutDialogComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfirmationSignoutDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmationSignoutDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
