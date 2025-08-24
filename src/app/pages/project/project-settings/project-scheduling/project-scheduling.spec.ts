import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectScheduling } from './scheduling';

describe('ProjectScheduling', () => {
  let component: ProjectScheduling;
  let fixture: ComponentFixture<ProjectScheduling>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProjectScheduling]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProjectScheduling);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
