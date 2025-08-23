import { Component, inject, DestroyRef, effect } from '@angular/core';
import { State, Store } from '@ngxs/store';
import { SetOrganization } from '../../store/organizations/organizations.actions';
import { ActivatedRoute, Router } from '@angular/router';
import { ProjectsState } from '../../store/projects/projects.state';
import { filter, first, map, Observable, Subscription, take, takeUntil } from 'rxjs';
import { Project, PartialProject } from '@betavc/timeqi-sh';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { StateUtils } from '../../providers/utils/state';

@Component({
  selector: 'app-organization',
  imports: [],
  providers: [
    StateUtils
  ],
  templateUrl: './organization.html',
  styleUrl: './organization.css'
})
export class Organization {
  readonly store = inject(Store);
  readonly stateUtils = inject(StateUtils);
  projects$: Observable<PartialProject[]> = this.stateUtils.getState$(
    ProjectsState.getState,
    'projects'
  ).pipe(
    filter(({ projects }) => projects.length > 0),
    first(projects => projects.length === 1)
  );
  projects = toSignal(this.projects$, { initialValue: [] as PartialProject[] });
  loading: boolean = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {
    const userId = localStorage.getItem('user_id');
    const organizationId = this.route.snapshot.paramMap.get('organizationId');
    if (!userId || !organizationId) {
      console.warn(userId ? 'No user ID found in local storage.' : 'No organization ID found in route parameters.');
    }
    effect(() => {
      if (this.projects().length > 0) {
        this.loading = false;
        if (this.projects().length === 1) {
          // Redirect to the single organization's page
          this.router.navigate(['/project', this.projects()[0]._id]);
        }
      }
    });
  }
}
