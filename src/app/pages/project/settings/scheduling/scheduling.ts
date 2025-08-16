import { Component } from '@angular/core';
import { TimeOffPicker } from '../../../../components/time-off-picker/time-off-picker';


@Component({
  selector: 'app-time-off',
  imports: [
    TimeOffPicker
  ],
  templateUrl: './scheduling.html',
  styleUrl: './scheduling.css'
})
export class Scheduling {
  constructor() {
    // You can use this.projectsState to access the resolved project state
  }
}
