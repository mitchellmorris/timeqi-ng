import { Component, inject } from '@angular/core';
import { TimeOffPicker } from '../../../../components/time-off-picker/time-off-picker';
import { Store } from '@ngxs/store';
import { ActivatedRoute } from '@angular/router';
import { ProjectsState } from '../../../../store/projects/projects.state';
import { getState$ } from '../../../../providers/utils/state';
import { take } from 'rxjs';
import { Project, SchedulingSettings } from '@betavc/timeqi-sh';
import { WorkshiftSchedular } from '../../../../components/workshift-schedular/workshift-schedular';

@Component({
  selector: 'app-time-off',
  imports: [
    TimeOffPicker,
    WorkshiftSchedular
  ],
  templateUrl: './scheduling.html',
  styleUrl: './scheduling.css'
})
export class Scheduling {
  readonly store = inject(Store);
  readonly route = inject(ActivatedRoute);
  id = this.route.snapshot.params['id'];
  project: Project | null = null;
  constructor() {}
  ngOnInit() {
    getState$(
      this.store, 
      ProjectsState.getState, 
      'project'
    ).pipe(take(1)).subscribe(
      (project) => this.project = project as Project
    );
  }
  
  onSubmit(formData: SchedulingSettings) {
    console.log(formData);
  }
}
