import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PastDriveDetailsComponent } from './past-drive-details.component';

describe('PastDriveDetailsComponent', () => {
  let component: PastDriveDetailsComponent;
  let fixture: ComponentFixture<PastDriveDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PastDriveDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PastDriveDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
