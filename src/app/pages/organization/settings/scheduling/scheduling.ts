import { Component, inject } from '@angular/core';
import { TimeOffPicker } from '../../../../components/time-off-picker/time-off-picker';
import { ActivatedRoute } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { Store } from '@ngxs/store';
import { OrganizationsState } from '../../../../store/organizations/organizations.state';
import { Organization, SchedulingSettings } from '@betavc/timeqi-sh';
import { StateUtils } from '../../../../providers/utils/state';
import { first, Observable } from 'rxjs';
import { WorkshiftSchedular } from '../../../../components/workshift-schedular/workshift-schedular';
import { SaveOrganizationSchedule } from '../../../../store/organizations/organizations.actions';
// console.log(weekdays);
@Component({
  selector: 'app-time-off',
  imports: [
    TimeOffPicker,
    WorkshiftSchedular
  ],
  providers: [
    StateUtils
  ],
  templateUrl: './scheduling.html',
  styleUrl: './scheduling.css'
})
export class Scheduling {
  readonly store = inject(Store);
  readonly route = inject(ActivatedRoute);
  readonly stateUtils = inject(StateUtils);
  id = this.route.snapshot.params['organizationId'];
  organization$: Observable<Organization> = this.stateUtils.getState$(
    OrganizationsState.getState, 
    'organization'
  ).pipe(
    first((organization): organization is Organization => organization !== null)
  );
  organization = toSignal<SchedulingSettings>(this.organization$, { initialValue: null });
    
  onSubmit(formData: SchedulingSettings) {
    this.store.dispatch(new SaveOrganizationSchedule(
      this.id,
      formData
    ));
  }
}
