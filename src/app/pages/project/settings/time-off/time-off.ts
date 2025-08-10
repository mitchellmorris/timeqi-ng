import { Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { ProjectsStateModel } from '../../../../schemas/project';

@Component({
  selector: 'app-time-off',
  imports: [],
  templateUrl: './time-off.html',
  styleUrl: './time-off.css'
})
export class TimeOff {
  private route = inject(ActivatedRoute);
  private data = toSignal(this.route.parent?.data ?? this.route.data);
  projectsState = computed(() => this.data()?.['projectsState'] as ProjectsStateModel);
  constructor() {
    // You can use this.projectsState to access the resolved project state
    console.log('Resolved Projects State:', this.projectsState());
  }
}
