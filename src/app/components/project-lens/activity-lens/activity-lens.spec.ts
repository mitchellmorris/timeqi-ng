import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivityLens } from './activity-lens';

describe('ActivityLens', () => {
  let component: ActivityLens;
  let fixture: ComponentFixture<ActivityLens>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActivityLens]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ActivityLens);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
