import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DescriptionClassComponent } from './description-class.component';

describe('DescriptionClassComponent', () => {
  let component: DescriptionClassComponent;
  let fixture: ComponentFixture<DescriptionClassComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DescriptionClassComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DescriptionClassComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
