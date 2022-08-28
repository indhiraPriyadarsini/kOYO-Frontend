import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpcomingdrivesComponent } from './upcomingdrives.component';

describe('UpcomingdrivesComponent', () => {
  let component: UpcomingdrivesComponent;
  let fixture: ComponentFixture<UpcomingdrivesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpcomingdrivesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UpcomingdrivesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
