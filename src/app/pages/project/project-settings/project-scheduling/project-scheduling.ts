import { Component, effect, inject, Signal } from '@angular/core';
import { TimeOffPicker } from '../../../../components/time-off-picker/time-off-picker';
import { Store } from '@ngxs/store';
import { ActivatedRoute } from '@angular/router';
import { ProjectsState } from '../../../../store/projects/projects.state';
import { StateUtils } from '../../../../providers/utils/state';
import { filter, first, Observable, take } from 'rxjs';
import { Project, SchedulingSettings } from '@betavc/timeqi-sh';
import { WorkshiftSchedular } from '../../../../components/workshift-schedular/workshift-schedular';
import { SaveProjectSchedule } from '../../../../store/projects/projects.actions';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-project-scheduling',
  imports: [
    TimeOffPicker,
    WorkshiftSchedular
  ],
  providers: [
    StateUtils
  ],
  templateUrl: './project-scheduling.html',
  styleUrl: './project-scheduling.css'
})
export class ProjectScheduling {
  readonly store = inject(Store);
  readonly route = inject(ActivatedRoute);
  readonly stateUtils = inject(StateUtils);
  id = this.route.snapshot.params['projectId'];
  project$: Observable<Project> = this.stateUtils.getState$(
    ProjectsState.getState,
    'project'
  ).pipe(
    first((project): project is Project => project !== null)
  );
  project = toSignal<SchedulingSettings>(this.project$, { initialValue: null });
  
  onSubmit(formData: SchedulingSettings) {
    this.store.dispatch(new SaveProjectSchedule(
      this.id,
      formData
    ));
  }
}
