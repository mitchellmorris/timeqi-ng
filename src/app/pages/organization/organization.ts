import { Component, inject, effect } from '@angular/core';
import { Store } from '@ngxs/store';
import { Router } from '@angular/router';
import { ProjectsState } from '../../store/projects/projects.state';
import { filter, Observable } from 'rxjs';
import { PartialProject } from '@betavc/timeqi-sh';
import { toSignal } from '@angular/core/rxjs-interop';
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
    filter(projects => projects.length > 0),
  );
  projects = toSignal(this.projects$, { initialValue: [] as PartialProject[] });

  constructor(
    private router: Router
  ) {
    effect(() => {
      if (this.projects().length === 1) {
        // Redirect to the single organization's page
        this.router.navigate(['/project', this.projects()[0]._id]);
      }
    });
  }
}
