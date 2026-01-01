import { 
  Component, 
  effect,
  inject,
  input,
  OnInit,
  output,
  Signal,
} from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { PrimeNG, ScenarioDate, Task } from '@betavc/timeqi-sh';
import { debounceTime, distinctUntilChanged, startWith } from 'rxjs';
import { Projection } from '../../providers/projection/projection';
import { Store } from '@ngxs/store';
import { TasksState } from '../../store/tasks/tasks.state';
import { DatePipe } from '@angular/common';
import { SelectModule } from 'primeng/select';
import { SelectButtonModule } from 'primeng/selectbutton';
import { InputNumberModule } from 'primeng/inputnumber';
import { DatePickerModule } from 'primeng/datepicker';
import { InputTextModule } from 'primeng/inputtext';
import { UserState } from '../../store/user/user.state';
import { ButtonModule } from 'primeng/button';
import { EditorModule } from 'primeng/editor';
import { TimePicker } from '../time-picker/time-picker';

@Component({
  selector: 'app-task-form',
  imports: [
    ReactiveFormsModule,
    DatePipe,
    SelectModule,
    SelectButtonModule,
    InputNumberModule,
    DatePickerModule,
    InputTextModule,
    ButtonModule,
    EditorModule,
    TimePicker
  ],
  templateUrl: './task-form.html',
  styleUrl: './task-form.css'
})
export class TaskForm implements OnInit {
  readonly store = inject(Store);
  readonly fb = inject(FormBuilder);
  taskProjection: Signal<Task | null> = this.store.selectSignal(TasksState.getProjection);
  users: Signal<PrimeNG.SelectOption[]> = this.store.selectSignal(UserState.getUserSelectOptions);
  data = input<Partial<Task> | null>({
    name: '',
    description: '',
    startDate: null,
    endDate: null,
    locked: false,
    estimate: 0,
    assignee: '' as string
  });
  // @Output() formSubmit = new EventEmitter<Partial<Task>>();
  formSubmit = output<Partial<Task>>();
  valueChanges = output<Partial<Task>>();
  form = this.fb.group({
    name: ['', Validators.required],
    description: [''],
    startDate: [null as ScenarioDate],
    endDate: [null as ScenarioDate],
    locked: [false],
    estimate: [0],
    assignee: ['' as string]
  });
  modeOptions: PrimeNG.SelectOption[] = [
    { label: 'Snap', value: false },
    { label: 'Lock', value: true }
  ];
  // Signal for form changes with filtering
  formChanges = toSignal(
    this.form.valueChanges.pipe(
      startWith(this.form.value), // Include initial value
      debounceTime(300), // Wait 300ms after user stops typing
      distinctUntilChanged(), // Only emit when values actually change
      takeUntilDestroyed()
    ),
    { initialValue: this.form.value }
  );

  constructor(
      readonly projection: Projection
    ) {
    // Effect that runs whenever form changes (with filtering)
    effect(async () => {
      const formData = this.formChanges();
      if (this.form.dirty) {
        this.valueChanges.emit(formData as Partial<Task>);
      }
    });
  }
  
  ngOnInit() {
    const data = this.data();
    if (!data) return;
    this.form.patchValue({
      ...data,
      startDate: data.startDate,
      endDate: data.endDate,
      assignee: data.assignee as string
    });
    this.form.markAsPristine();
  }
  
  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const value = this.form.value as Partial<Task>;
    this.form.markAsPristine();
    this.formSubmit.emit(value);
  }
}
