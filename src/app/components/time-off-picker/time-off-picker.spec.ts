import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TimeOffPicker } from './time-off-picker';

describe('TimeOffPicker', () => {
  let component: TimeOffPicker;
  let fixture: ComponentFixture<TimeOffPicker>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TimeOffPicker]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TimeOffPicker);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
