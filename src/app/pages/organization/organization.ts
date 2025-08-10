import { Component, inject } from '@angular/core';
import { Store } from '@ngxs/store';
import { SetOrganiganization } from '../../store/organizations/organizations.actions';
import { ActivatedRoute, Router } from '@angular/router';
import { ProjectsState } from '../../store/projects/projects.state';
import { map, Subscription } from 'rxjs';
import { Project } from '../../schemas/project';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-organization',
  imports: [],
  templateUrl: './organization.html',
  styleUrl: './organization.css'
})
export class Organization {
  readonly store = inject(Store);
  projects: Partial<Project>[] = [];
  projects$ = this.store.select(ProjectsState.getState).pipe(
    map(({ projects }) => projects),
    takeUntilDestroyed()
  );
  projectsSubscription!: Subscription;
  loading: boolean = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {
    const userId = localStorage.getItem('user_id');
    const organizationId = this.route.snapshot.paramMap.get('id');
    if (userId && organizationId) {
      this.store.dispatch(new SetOrganiganization(organizationId));
      this.projectsSubscription = this.projects$.subscribe((projects) => {
        if (projects.length > 0) {
          this.loading = false;
          this.projects = projects;
          if (projects.length === 1) {
            // Redirect to the single organization's page
            this.router.navigate(['/project', projects[0]._id]);
            this.projectsSubscription.unsubscribe();
          }
        }
      });
    } else {
      console.warn(userId ? 'No user ID found in local storage.' : 'No organization ID found in route parameters.');
    }
  }
}
