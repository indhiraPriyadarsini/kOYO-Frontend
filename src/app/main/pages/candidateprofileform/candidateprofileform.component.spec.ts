import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CandidateprofileformComponent } from './candidateprofileform.component';

describe('CandidateprofileformComponent', () => {
  let component: CandidateprofileformComponent;
  let fixture: ComponentFixture<CandidateprofileformComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CandidateprofileformComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CandidateprofileformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
