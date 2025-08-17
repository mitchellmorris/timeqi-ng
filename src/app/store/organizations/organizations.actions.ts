import { PartialOrganization, SchedulingSettings } from '@betavc/timeqi-sh';

export class SetUserOrganizations {
  static readonly type = '[App] Set User Organizations';
  constructor(public organizations: PartialOrganization[]) { }
}
export class SetOrganization {
  static readonly type = '[Org] Set Organization';
  constructor(public id: string) { }
}
export class SetProjectOrganization {
  static readonly type = '[Project] Set Organization';
  constructor(public id: string) { }
}

export class SaveOrganizationSchedule {
  static readonly type = '[Org] Save Org. Scheduling';
  constructor(public id: string, public organization: Partial<SchedulingSettings>) { }
}
