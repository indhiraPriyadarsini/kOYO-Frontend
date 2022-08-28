import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoundsStep1Component } from './rounds-step1.component';

describe('RoundsStep1Component', () => {
  let component: RoundsStep1Component;
  let fixture: ComponentFixture<RoundsStep1Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RoundsStep1Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RoundsStep1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
