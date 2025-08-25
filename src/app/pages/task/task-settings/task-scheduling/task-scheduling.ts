import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { Store } from '@ngxs/store';
import { OrganizationsState } from '../../../../store/organizations/organizations.state';
import { SchedulingSettings, Task } from '@betavc/timeqi-sh';
import { StateUtils } from '../../../../providers/utils/state';
import { first, Observable } from 'rxjs';
import { WorkshiftSchedular } from '../../../../components/workshift-schedular/workshift-schedular';
import { SaveOrganizationSchedule } from '../../../../store/organizations/organizations.actions';
import { TasksState } from '../../../../store/tasks/tasks.state';

@Component({
  selector: 'app-task-scheduling',
  imports: [
    WorkshiftSchedular
  ],
  providers: [
    StateUtils
  ],
  templateUrl: './task-scheduling.html',
  styleUrl: './task-scheduling.css'
})
export class TaskScheduling {
  readonly store = inject(Store);
  readonly route = inject(ActivatedRoute);
  readonly stateUtils = inject(StateUtils);
  id = this.route.snapshot.params['organizationId'];
  task$: Observable<Task> = this.stateUtils.getState$(
    TasksState.getState, 
    'task'
  ).pipe(
    first((task): task is Task => task !== null)
  );
  task = toSignal<SchedulingSettings>(this.task$, { initialValue: null });

  onSubmit(formData: SchedulingSettings) {
    console.log('Form Data:', formData);
    // this.store.dispatch(new SaveOrganizationSchedule(
    //   this.id,
    //   formData
    // ));
  }
}
