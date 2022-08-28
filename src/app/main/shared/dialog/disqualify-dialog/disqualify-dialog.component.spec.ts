import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DisqualifyDialogComponent } from './disqualify-dialog.component';

describe('DisqualifyDialogComponent', () => {
  let component: DisqualifyDialogComponent;
  let fixture: ComponentFixture<DisqualifyDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DisqualifyDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DisqualifyDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
