import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditOrganization } from './general';

describe('EditOrganization', () => {
  let component: EditOrganization;
  let fixture: ComponentFixture<EditOrganization>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditOrganization]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditOrganization);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
