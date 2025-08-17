import { Component, inject, DestroyRef } from '@angular/core';
import { TimeOffPicker } from '../../../../components/time-off-picker/time-off-picker';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputNumberModule } from 'primeng/inputnumber';
import { ActivatedRoute } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { filter, map } from 'rxjs';
import { has } from 'ramda';
import { Store } from '@ngxs/store';
import { OrganizationsState } from '../../../../store/organizations/organizations.state';
import { Weekday, DEFAULT_WORKDAYS } from '@betavc/timeqi-sh';
import { CheckboxModule } from 'primeng/checkbox';
import { SaveOrganizationSchedule } from '../../../../store/organizations/organizations.actions';
// console.log(weekdays);
@Component({
  selector: 'app-time-off',
  imports: [
    TimeOffPicker,
    ReactiveFormsModule,
    ButtonModule,
    FormsModule,
    InputNumberModule,
    CheckboxModule
  ],
  templateUrl: './scheduling.html',
  styleUrl: './scheduling.css'
})
export class Scheduling {
  readonly fb = inject(FormBuilder);
  readonly route = inject(ActivatedRoute);
  readonly destroyRef = inject(DestroyRef);
  readonly store = inject(Store);
  id = this.route.snapshot.params['id'];
  form: FormGroup = this.fb.group({
    weekdays: [[], Validators.required],
    workshift: [8, [Validators.required, Validators.min(1)]],
  });
  organizationState$ = this.store.select(OrganizationsState.getState).pipe(
    filter(state => has('organization', state)),
    map(({ organization }) => organization),
    takeUntilDestroyed()
  );
  weekdays: Weekday[] = DEFAULT_WORKDAYS;
  constructor() {
    this.organizationState$.subscribe((organization) => {
      if (organization) {
        this.form.patchValue({
          weekdays: organization?.weekdays && organization?.weekdays.length ? 
            organization?.weekdays : 
            ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
          workshift: organization?.workshift || 8
        });
        this.form.markAsPristine();
      }
    });
  }

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched(); // 👈 ensures errors show up
      return;
    }
    if (this.form.valid) {
      // Handle form submission
      console.log(this.form.value);
      this.store.dispatch(new SaveOrganizationSchedule(this.id, this.form.value));

    }
  }
}
