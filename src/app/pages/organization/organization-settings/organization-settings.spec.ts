import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrganizationSettings } from './settings';

describe('OrganizationSettings', () => {
  let component: OrganizationSettings;
  let fixture: ComponentFixture<OrganizationSettings>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrganizationSettings]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrganizationSettings);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
