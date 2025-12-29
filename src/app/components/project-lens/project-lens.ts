import { Component, computed, effect, inject, model, OnInit, Signal } from '@angular/core';
import { Activity, Project, Task } from '@betavc/timeqi-sh';
import { Store } from '@ngxs/store';
import { TasksState } from '../../store/tasks/tasks.state';
import { ProjectsState } from '../../store/projects/projects.state';
import { DatePipe } from '@angular/common';
import { SliderModule } from 'primeng/slider';
import { FormsModule } from '@angular/forms';
import { ActivityState } from '../../store/activity/activity.state';
import { min } from 'ramda';

@Component({
  selector: 'app-project-lens',
  imports: [
    SliderModule,
    FormsModule,
    DatePipe
  ],
  templateUrl: './project-lens.html',
  styleUrl: './project-lens.css'
})
export class ProjectLens {
  readonly store = inject(Store);
  projectProjection: Signal<Partial<Project> | null> = this.store.selectSignal(ProjectsState.getProjection);
  taskProjection: Signal<Task | null> = this.store.selectSignal(TasksState.getProjection);
  activity: Signal<Activity[]> = this.store.selectSignal(ActivityState.getActivity);
  activityCount: Signal<number> = computed(() => this.activity().length);
  activityIndex = model<number>(0);
  // step: Signal<number> = computed(() => min(100, 100 / this.activity().length);
  
  constructor() {
    effect(() => {
      const activityLength = this.activity().length;
      if (activityLength > 0) {
        this.activityIndex.set(activityLength - 1);
      }
    });
  }
}
