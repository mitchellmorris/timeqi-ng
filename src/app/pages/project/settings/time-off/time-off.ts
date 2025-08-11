import { Component } from '@angular/core';
import { TimeOffPicker } from '../../../../components/time-off-picker/time-off-picker';


@Component({
  selector: 'app-time-off',
  imports: [
    TimeOffPicker
  ],
  templateUrl: './time-off.html',
  styleUrl: './time-off.css'
})
export class TimeOff {
  constructor() {
    // You can use this.projectsState to access the resolved project state
  }
}
