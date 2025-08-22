import { inject } from '@angular/core';
import type { ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot } from '@angular/router';
import { SetProject } from '../../store/projects/projects.actions';
import { Store } from '@ngxs/store';
import { ProjectsState } from '../../store/projects/projects.state';
import { filter, map } from 'rxjs';
import { ProjectsStateModel } from '@betavc/timeqi-sh';
import { StateUtils } from '../../providers/utils/state';

export const projectResolver: ResolveFn<ProjectsStateModel> = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  const store = inject(Store);
  const stateUtils = inject(StateUtils);
  const projectId = route.paramMap.get('projectId')!;
  return store.dispatch(new SetProject(projectId)).pipe(
    map(() => stateUtils.getStateSnapshot(ProjectsState.getState)),
    filter(({ project }) => !!project)
  );
};