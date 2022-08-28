import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConductRoundsComponent } from './conduct-rounds.component';

describe('ConductRoundsComponent', () => {
  let component: ConductRoundsComponent;
  let fixture: ComponentFixture<ConductRoundsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConductRoundsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConductRoundsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
