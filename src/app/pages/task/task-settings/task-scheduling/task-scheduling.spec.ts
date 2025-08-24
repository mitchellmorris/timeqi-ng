import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskScheduling } from './task-scheduling';

describe('TaskScheduling', () => {
  let component: TaskScheduling;
  let fixture: ComponentFixture<TaskScheduling>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaskScheduling]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TaskScheduling);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
