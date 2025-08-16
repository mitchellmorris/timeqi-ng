import { PartialOrganization } from '@betavc/timeqi-sh';

export class SetUserOrganizations {
  static readonly type = '[App] Set User Organizations';
  constructor(public organizations: PartialOrganization[]) { }
}
export class SetOrganiganization {
  static readonly type = '[Org] Set Organization';
  constructor(public id: string) { }
}
export class SetProjectOrganization {
  static readonly type = '[Project] Set Organization';
  constructor(public id: string) { }
}
