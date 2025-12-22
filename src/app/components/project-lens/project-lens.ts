import { Component, inject, Signal } from '@angular/core';
import { Project, Task } from '@betavc/timeqi-sh';
import { Store } from '@ngxs/store';
import { TasksState } from '../../store/tasks/tasks.state';
import { ProjectsState } from '../../store/projects/projects.state';
import { SliderModule } from 'primeng/slider';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-project-lens',
  imports: [
    SliderModule,
    FormsModule
  ],
  templateUrl: './project-lens.html',
  styleUrl: './project-lens.css'
})
export class ProjectLens {
  readonly store = inject(Store);
  projectProjection: Signal<Partial<Project> | null> = this.store.selectSignal(ProjectsState.getProjection);
  taskProjection: Signal<Task | null> = this.store.selectSignal(TasksState.getProjection);
  activity!: number;
}
