import { inject } from '@angular/core';
import type { ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot } from '@angular/router';
import { SetProject } from '../../store/projects/projects.actions';
import { Store } from '@ngxs/store';
import { ProjectsState } from '../../store/projects/projects.state';
import { map } from 'rxjs';
import { ProjectsStateModel } from '@betavc/timeqi-sh';

export const projectResolver: ResolveFn<ProjectsStateModel> = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  const store = inject(Store);
  const project = store.selectSignal(ProjectsState.getState);
  const projectId = route.paramMap.get('id')!;
  return store.dispatch(new SetProject(projectId)).pipe(
    map(() => project())
  );
};