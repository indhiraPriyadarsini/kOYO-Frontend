import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoundsHeaderComponent } from './rounds-header.component';

describe('RoundsHeaderComponent', () => {
  let component: RoundsHeaderComponent;
  let fixture: ComponentFixture<RoundsHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RoundsHeaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RoundsHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
