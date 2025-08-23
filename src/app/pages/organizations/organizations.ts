import { Component, effect, inject } from '@angular/core';
import { TableModule } from 'primeng/table';
import { PartialOrganization } from '@betavc/timeqi-sh';
import { filter, first, Observable } from 'rxjs';
import { Store } from '@ngxs/store'; // Add this import
import { OrganizationsState } from '../../store/organizations/organizations.state';
import { Router } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { StateUtils } from '../../providers/utils/state';

@Component({
  selector: 'app-organizations',
  imports: [TableModule],
  providers: [
    StateUtils
  ],
  templateUrl: './organizations.html',
  styleUrl: './organizations.css'
})
export class Organizations {
  readonly store = inject(Store);
  readonly storeUtils = inject(StateUtils);
  organizations$: Observable<PartialOrganization[]> = this.storeUtils.getState$(OrganizationsState.getState, 'organizations').pipe(
    filter(organizations => (organizations as PartialOrganization[]).length > 0),
    first(organizations => (organizations as PartialOrganization[]).length === 1),
  );
  organizations = toSignal(this.organizations$, { initialValue: [] as PartialOrganization[] });
  loading: boolean = true;

  constructor(private router: Router) { 
    const userId = localStorage.getItem('user_id');
    if (!userId) {
      console.warn('No user ID found in local storage.');
    }
    effect(() => {
      if (this.organizations().length > 0) {
        this.loading = false;
        if (this.organizations().length === 1) {
          // Redirect to the single organization's page
          this.router.navigate(['/organization', this.organizations()[0]._id]);
        }
      }
    });
  }

}
