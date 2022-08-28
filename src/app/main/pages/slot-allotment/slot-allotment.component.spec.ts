import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SlotAllotmentComponent } from './slot-allotment.component';

describe('SlotAllotmentComponent', () => {
  let component: SlotAllotmentComponent;
  let fixture: ComponentFixture<SlotAllotmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SlotAllotmentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SlotAllotmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
