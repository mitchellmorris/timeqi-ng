import { Component, computed, effect, inject, model, Signal } from '@angular/core';
import { Activity, Task } from '@betavc/timeqi-sh';
import { Store } from '@ngxs/store';
import { ActivityState } from '../../../store/activity/activity.state';
import { SliderModule } from 'primeng/slider';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TasksState } from '../../../store/tasks/tasks.state';

@Component({
  selector: 'app-activity-lens',
  imports: [
    SliderModule,
    FormsModule,
    DatePipe
  ],
  templateUrl: './activity-lens.html',
  styleUrl: './activity-lens.css'
})
export class ActivityLens {
  readonly store = inject(Store);
  activity: Signal<Activity[]> = this.store.selectSignal(ActivityState.getActivity);
  task: Signal<Task | null> = this.store.selectSignal(TasksState.getTask);
  activityCount: Signal<number> = computed(() => this.activity().length);
  activityIndex = model<number>(0); 
  
  constructor() {
    effect(() => {
      const activityLength = this.activity().length;
      if (activityLength > 0) {
        this.activityIndex.set(activityLength - 1);
      }
    });
  }
}
