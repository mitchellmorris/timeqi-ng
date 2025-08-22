import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReviewTask } from './review-task';

describe('ReviewTask', () => {
  let component: ReviewTask;
  let fixture: ComponentFixture<ReviewTask>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReviewTask]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReviewTask);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
