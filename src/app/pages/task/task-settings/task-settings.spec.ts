import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskSettings } from './task-settings';

describe('TaskSettings', () => {
  let component: TaskSettings;
  let fixture: ComponentFixture<TaskSettings>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaskSettings]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TaskSettings);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
