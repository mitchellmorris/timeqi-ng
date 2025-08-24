import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrganizationScheduling } from './scheduling';

describe('OrganizationScheduling', () => {
  let component: OrganizationScheduling;
  let fixture: ComponentFixture<OrganizationScheduling>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrganizationScheduling]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrganizationScheduling);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
