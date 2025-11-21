import { Component, DestroyRef, EventEmitter, inject, Input, Output, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { WEEKDAYS, DEFAULT_WORKDAYS } from '@betavc/timeqi-sh/utils';
import { SchedulingSettings, Weekday } from '@betavc/timeqi-sh/models';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { InputNumberModule } from 'primeng/inputnumber';

@Component({
  selector: 'app-workshift-schedular',
  imports: [
    ReactiveFormsModule,
    ButtonModule,
    FormsModule,
    InputNumberModule,
    CheckboxModule
  ],
  templateUrl: './workshift-schedular.html',
  styleUrl: './workshift-schedular.css'
})
export class WorkshiftSchedular implements OnInit {
  readonly fb = inject(FormBuilder);
  readonly destroyRef = inject(DestroyRef);
  @Input() data: SchedulingSettings = {
    weekdays: DEFAULT_WORKDAYS,
    workshift: 8
  };
  @Output() formSubmit = new EventEmitter<SchedulingSettings>();
  form: FormGroup = this.fb.group({
    weekdays: [[], Validators.required],
    workshift: [8, [Validators.required, Validators.min(1)]],
  });
  weekdays: Weekday[] = WEEKDAYS;
  
  ngOnInit() {
    this.form.patchValue(this.data);
    this.form.markAsPristine();
  }
  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const value = this.form.value as SchedulingSettings;
    this.form.markAsPristine();
    this.formSubmit.emit(value);
  }
}
