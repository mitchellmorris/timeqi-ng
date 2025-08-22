import { inject } from '@angular/core';
import type { ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot } from '@angular/router';
import { SetOrganization } from '../../store/organizations/organizations.actions';
import { Store } from '@ngxs/store';
import { OrganizationsState } from '../../store/organizations/organizations.state';
import { filter, map } from 'rxjs';
import { OrganizationsStateModel } from '@betavc/timeqi-sh';
import { StateUtils } from '../../providers/utils/state';

export const organizationResolver: ResolveFn<OrganizationsStateModel> = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  const store = inject(Store);
  const stateUtils = inject(StateUtils);
  const organizationId = route.paramMap.get('organizationId')!;
  return store.dispatch(new SetOrganization(organizationId)).pipe(
    map(() => stateUtils.getStateSnapshot(OrganizationsState.getState)),
    filter(({ organization }) => !!organization)
  );
};