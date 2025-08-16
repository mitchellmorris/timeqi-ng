import { inject } from '@angular/core';
import type { ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot } from '@angular/router';
import { SetOrganization } from '../../store/organizations/organizations.actions';
import { Store } from '@ngxs/store';
import { OrganizationsState } from '../../store/organizations/organizations.state';
import { map } from 'rxjs';
import { OrganizationsStateModel } from '@betavc/timeqi-sh';

export const organizationResolver: ResolveFn<OrganizationsStateModel> = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  const store = inject(Store);
  const organization = store.selectSignal(OrganizationsState.getState);
  const organizationId = route.paramMap.get('id')!;
  return store.dispatch(new SetOrganization(organizationId)).pipe(
    map(() => organization())
  );
};