import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Select, Store } from '@ngxs/store';
import { DatePickerModule } from 'primeng/datepicker';
import { TimeOffState } from '../../store/time-off/time-off.state';
import { map, Observable } from 'rxjs';
import { TimeOff, TimeOffStateModel } from '../../schemas/time-off';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';

@Component({
  selector: 'app-time-off-picker',
  imports: [
    DatePickerModule,
    TableModule,
    FormsModule,
    DialogModule
  ],
  templateUrl: './time-off-picker.html',
  styleUrl: './time-off-picker.css'
})
export class TimeOffPicker {
  readonly store = inject(Store);
  timeOffLabel: string = "Add Time Off";
  isTimeOffOpened: boolean = false;
  timeOffDate: Date | null = null;
  allTimeOff: Partial<TimeOff>[] = [];
  timeOff$: Observable<Partial<TimeOff>[]> = this.store.select(TimeOffState.getState).pipe(
    map(({ timeoff }) => timeoff),
    takeUntilDestroyed(),
  )

  constructor() {
    this.timeOff$.subscribe(allTimeOff => {
        this.allTimeOff = allTimeOff;
    });
  }

  addTimeOff() {
    this.isTimeOffOpened = true;
  }

}
