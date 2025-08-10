import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TimeOff } from './time-off';

describe('TimeOff', () => {
  let component: TimeOff;
  let fixture: ComponentFixture<TimeOff>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TimeOff]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TimeOff);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
