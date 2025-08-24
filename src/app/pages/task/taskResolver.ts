import { inject } from '@angular/core';
import type { ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot } from '@angular/router';
import { Store } from '@ngxs/store';
import { filter, map } from 'rxjs';
import { TasksStateModel } from '@betavc/timeqi-sh';
import { TasksState } from '../../store/tasks/tasks.state';
import { SetTask } from '../../store/tasks/tasks.actions';
import { StateUtils } from '../../providers/utils/state';


export const taskResolver: ResolveFn<TasksStateModel> = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  const store = inject(Store);
  const stateUtils = inject(StateUtils);
  const taskId = route.paramMap.get('taskId')!;
  if (!taskId) {
    throw new Error('No task ID found in route parameters.');
  }
  return store.dispatch(new SetTask(taskId)).pipe(
    map(() => stateUtils.getStateSnapshot(TasksState.getState)),
    filter(({ task }) => !!task)
  );
};