import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DrivedetailsComponent } from './drivedetails.component';

describe('DrivedetailsComponent', () => {
  let component: DrivedetailsComponent;
  let fixture: ComponentFixture<DrivedetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DrivedetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DrivedetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
