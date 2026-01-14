import { Component, computed, effect, inject, model, OnInit, Signal } from '@angular/core';
import { Activity, Project, Task } from '@betavc/timeqi-sh';
import { Store } from '@ngxs/store';
import { TasksState } from '../../store/tasks/tasks.state';
import { ProjectsState } from '../../store/projects/projects.state';
import { DatePipe } from '@angular/common';
import { SliderModule } from 'primeng/slider';
import { FormsModule } from '@angular/forms';
import { ActivityState } from '../../store/activity/activity.state';
import { ActivityLens } from './activity-lens/activity-lens';

@Component({
  selector: 'app-project-lens',
  imports: [
    DatePipe,
    ActivityLens,
  ],
  templateUrl: './project-lens.html',
  styleUrl: './project-lens.css'
})
export class ProjectLens {
  readonly store = inject(Store);
  projectProjection: Signal<Partial<Project> | null> = this.store.selectSignal(ProjectsState.getProjection);
  task: Signal<Task | null> = this.store.selectSignal(TasksState.getTask);
  taskProjection: Signal<Task | null> = this.store.selectSignal(TasksState.getProjection);
}
