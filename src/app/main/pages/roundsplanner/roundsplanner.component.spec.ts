import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoundsPlannerComponent } from './roundsplanner.component';

describe('RoundsplannerComponent', () => {
  let component: RoundsPlannerComponent;
  let fixture: ComponentFixture<RoundsPlannerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RoundsPlannerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RoundsPlannerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
