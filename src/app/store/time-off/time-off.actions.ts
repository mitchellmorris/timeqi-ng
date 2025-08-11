import { TimeOff } from "../../schemas/time-off";

export class UpsertUserTimeOff {
  static readonly type = '[User] Add Time Off';
  constructor(readonly timeOff: Partial<TimeOff>[]) { }
}

export class UpsertOrgTimeOff {
  static readonly type = '[Org] Add Time Off';
  constructor(readonly timeOff: Partial<TimeOff>[]) { }
}

export class UpsertProjectTimeOff {
  static readonly type = '[Project] Add Time Off';
  constructor(readonly timeOff: Partial<TimeOff>[]) { }
}
