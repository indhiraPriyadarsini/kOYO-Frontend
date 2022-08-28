import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReviewAndFinishComponent } from './review-and-finish.component';

describe('ReviewAndFinishComponent', () => {
  let component: ReviewAndFinishComponent;
  let fixture: ComponentFixture<ReviewAndFinishComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReviewAndFinishComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReviewAndFinishComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
