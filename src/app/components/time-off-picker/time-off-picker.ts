import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Store } from '@ngxs/store';
import { DatePickerModule } from 'primeng/datepicker';
import { TimeOffState } from '../../store/time-off/time-off.state';
import { map, Observable } from 'rxjs';
import { PartialTimeOff } from '@betavc/timeqi-sh';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { TableModule, TableRowSelectEvent } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { StateUtils } from '../../providers/utils/state';

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
  readonly stateUtils = inject(StateUtils); 
  timeOffLabel: string = "Add Time Off";
  isTimeOffOpened: boolean = false;
  timeOffDate: Date | null = null;
  timeOff$: Observable<PartialTimeOff[]> = this.stateUtils.getState$(TimeOffState.getState, 'timeoffs');
  timeoffs = toSignal(this.timeOff$, { initialValue: [] as PartialTimeOff[] });

  addTimeOff() {
    this.isTimeOffOpened = true;
  }

  onRowSelect(event: TableRowSelectEvent<PartialTimeOff>) {
    const timeOff = event.data;
    console.log('Selected Time Off:', timeOff);
    this.isTimeOffOpened = true;
  }


}
