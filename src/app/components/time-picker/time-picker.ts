import { Component, forwardRef, input, signal } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor, AbstractControl, FormsModule, NG_VALIDATORS } from '@angular/forms';
import { InputNumberInputEvent, InputNumberModule } from 'primeng/inputnumber';

@Component({
  selector: 'app-time-picker',
  templateUrl: './time-picker.html',
  imports: [
    InputNumberModule,
    FormsModule,
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TimePicker),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => TimePicker),
      multi: true,
    }
  ],
})
export class TimePicker implements ControlValueAccessor {
  minutes = signal<number>(0);
  hours = signal<number>(0);

  value = signal<number>(0);
  disabled = false;
  touched = false;
  invalid = false;

  private onChange = (value: number) => {};
  private onTouched = () => {};

  writeValue(value: number): void {
    const hours = Math.floor(value ?? 0);
    const minutes = Math.round(((value ?? 0) - hours) * 60);
    this.hours.set(hours);
    this.minutes.set(minutes);
    this.value.set(value ?? 0);
  }

  registerOnChange(fn: (value: number) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  onUpdateHours(event: InputNumberInputEvent) {
    this.markAsTouched();
    if (!this.disabled) {
      this.value.set(Number(event.value) + this.minutes() / 60);
      this.onChange(this.value());
    }
  }

  onUpdateMinutes(event: InputNumberInputEvent) {
    this.markAsTouched();
    if (!this.disabled) {
      this.value.set(this.hours() + Number(event.value) / 60);
      this.onChange(this.value());
    }
  }

  onBlur() {
    this.markAsTouched();
    this.onTouched();
  }

  markAsTouched() {
    if (!this.touched) {
      this.onTouched();
      this.touched = true;
    }
  }

  validate(control: AbstractControl) {
    return (this.invalid = control.value <= 0)
      ? { nonZero: true }
      : null;
  }
}
