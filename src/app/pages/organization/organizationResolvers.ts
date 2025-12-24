import { inject } from '@angular/core';
import type { ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot } from '@angular/router';
import { SetOrganization } from '../../store/organizations/organizations.actions';
import { Store } from '@ngxs/store';
import { OrganizationsState } from '../../store/organizations/organizations.state';
import { filter, first, map } from 'rxjs';
import { OrganizationsStateModel } from '@betavc/timeqi-sh';
import { StateUtils } from '../../providers/utils/state';

export const organizationResolver: ResolveFn<OrganizationsStateModel> = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  const store = inject(Store);
  const stateUtils = inject(StateUtils);
  const organizationId = route.paramMap.get('organizationId');
  if (!organizationId) 
    throw new Error('No organization ID found in route parameters.');
  
  return store.dispatch(new SetOrganization(organizationId)).pipe(
    map(() => stateUtils.getStateSnapshot(OrganizationsState.getOrganization)),
    filter((organization) => !!organization),
    first()
  );
};