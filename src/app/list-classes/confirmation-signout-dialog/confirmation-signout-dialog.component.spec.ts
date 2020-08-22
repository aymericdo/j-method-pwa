import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmationSignoutDialogComponent } from './confirmation-signout-dialog.component';

describe('ConfirmationSignoutDialogComponent', () => {
  let component: ConfirmationSignoutDialogComponent;
  let fixture: ComponentFixture<ConfirmationSignoutDialogComponent>;

  beforeEach(async(() => {
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
