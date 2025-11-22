import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectLens } from './project-lens';

describe('ProjectLens', () => {
  let component: ProjectLens;
  let fixture: ComponentFixture<ProjectLens>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProjectLens]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProjectLens);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
