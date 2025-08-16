import { PartialTimeOff } from '@betavc/timeqi-sh';

export class UpsertUserTimeOff {
  static readonly type = '[User] Add Time Off';
  constructor(readonly timeOff: PartialTimeOff[]) { }
}

export class UpsertOrgTimeOff {
  static readonly type = '[Org] Add Time Off';
  constructor(readonly timeOff: PartialTimeOff[]) { }
}

export class UpsertProjectTimeOff {
  static readonly type = '[Project] Add Time Off';
  constructor(readonly timeOff: PartialTimeOff[]) { }
}
