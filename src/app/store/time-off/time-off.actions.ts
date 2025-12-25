import { InstanceTimeOff } from '@betavc/timeqi-sh';

export class SetOrgTimeOff {
  static readonly type = '[Org] Add Organization Time Off';
  constructor(readonly timeOff: InstanceTimeOff[]) { }
}

export class SetProjectTimeOff {
  static readonly type = '[Project] Add Project Time Off';
  constructor(readonly timeOff: InstanceTimeOff[]) { }
}

export class SetTaskTimeOff {
  static readonly type = '[Task] Add Task Time Off';
  constructor(readonly timeOff: InstanceTimeOff[]) { }
}

export class CleanOrgTimeOff {
  static readonly type = '[Org] Clean Organization Time Off';
  constructor() { }
}

export class CleanProjectTimeOff {
  static readonly type = '[Project] Clean Project Time Off';
  constructor() { }
}

export class CleanTaskTimeOff {
  static readonly type = '[Task] Clean Task Time Off';
  constructor() { }
}

export class SetProjectTasksTimeOff {
  static readonly type = '[Project] Set Project Task Time Off';
  constructor(readonly timeOff: InstanceTimeOff[]) { }
}