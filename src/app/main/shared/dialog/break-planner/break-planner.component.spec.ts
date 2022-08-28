import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BreakPlannerComponent } from './break-planner.component';

describe('BreakPlannerComponent', () => {
  let component: BreakPlannerComponent;
  let fixture: ComponentFixture<BreakPlannerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BreakPlannerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BreakPlannerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
