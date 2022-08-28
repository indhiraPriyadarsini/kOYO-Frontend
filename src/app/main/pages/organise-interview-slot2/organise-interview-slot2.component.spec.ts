import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrganiseInterviewSlot2Component } from './organise-interview-slot2.component';

describe('InterviewSlot2Component', () => {
  let component: OrganiseInterviewSlot2Component;
  let fixture: ComponentFixture<OrganiseInterviewSlot2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrganiseInterviewSlot2Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OrganiseInterviewSlot2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
