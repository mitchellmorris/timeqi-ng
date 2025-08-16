import { Component, inject, DestroyRef } from '@angular/core';
import { Store } from '@ngxs/store';
import { SetOrganization } from '../../store/organizations/organizations.actions';
import { ActivatedRoute, Router } from '@angular/router';
import { ProjectsState } from '../../store/projects/projects.state';
import { filter, first, map, Subscription, take, takeUntil } from 'rxjs';
import { Project, PartialProject } from '@betavc/timeqi-sh';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-organization',
  imports: [],
  templateUrl: './organization.html',
  styleUrl: './organization.css'
})
export class Organization {
  readonly store = inject(Store);
  projects: PartialProject[] = [];
  projects$ = this.store.select(ProjectsState.getState).pipe(
    filter(({ projects }) => projects.length > 0),
    map(({ projects }) => projects),
    first(projects => projects.length === 1),
    takeUntilDestroyed(),
  );
  projectsSubscription!: Subscription;
  loading: boolean = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private destroyRef: DestroyRef
  ) {
    const userId = localStorage.getItem('user_id');
    const organizationId = this.route.snapshot.paramMap.get('id');
    if (userId && organizationId) {
      this.projectsSubscription = this.projects$.pipe(
        takeUntilDestroyed(this.destroyRef)
      ).subscribe((projects) => {
        if (projects.length > 0) {
          this.loading = false;
          this.projects = projects;
          if (projects.length === 1) {
            // Redirect to the single organization's page
            this.router.navigate(['/project', projects[0]._id]);
          }
        }
      });
    } else {
      console.warn(userId ? 'No user ID found in local storage.' : 'No organization ID found in route parameters.');
    }
  }
}
