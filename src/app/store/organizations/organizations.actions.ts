import { InstanceOrganization, Organization } from '@betavc/timeqi-sh';

export class SetUserOrganizations {
  static readonly type = '[User] Set User Organizations';
  constructor(public organizations: InstanceOrganization[]) { }
}

export class SetOrganization {
  static readonly type = '[Org Resolver] Set Organization';
  constructor(public id: string) { }
}

export class SetProjectOrganization {
  static readonly type = '[Project] Set Organization';
  constructor(public id: string) { }
}
export class SaveOrganizationSchedule {
  static readonly type = '[Org Scheduling Form] Save Org. Scheduling';
  constructor(public id: string, public organization: Partial<Organization>) { }
}

export class NullifyOrganization {
  static readonly type = '[Org] Nullify Organization';
  constructor() { }
}