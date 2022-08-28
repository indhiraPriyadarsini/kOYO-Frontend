import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InterviewersListComponent } from './interviewers-list.component';

describe('InterviewersListComponent', () => {
  let component: InterviewersListComponent;
  let fixture: ComponentFixture<InterviewersListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InterviewersListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InterviewersListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
