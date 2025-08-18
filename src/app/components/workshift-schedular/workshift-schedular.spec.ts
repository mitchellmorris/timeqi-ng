import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkshiftSchedular } from './workshift-schedular';

describe('WorkshiftSchedular', () => {
  let component: WorkshiftSchedular;
  let fixture: ComponentFixture<WorkshiftSchedular>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WorkshiftSchedular]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WorkshiftSchedular);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
