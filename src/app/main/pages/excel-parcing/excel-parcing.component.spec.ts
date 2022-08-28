import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExcelParcingComponent } from './excel-parcing.component';

describe('ExcelParcingComponent', () => {
  let component: ExcelParcingComponent;
  let fixture: ComponentFixture<ExcelParcingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExcelParcingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExcelParcingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
