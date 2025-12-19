import { InstanceEntry } from '@betavc/timeqi-sh';

export class SetTaskEntries {
  static readonly type = '[Task] Set Task Entries';
  constructor(public entries: InstanceEntry[]) { }
}
export class SetProjectEntries {
  static readonly type = '[Project] Set Project Entries';
  constructor(public projectId: string) { }
}
export class CleanTaskEntries {
  static readonly type = '[Task] Clean Task Entries';
  constructor() { }
}

export class NullifyTaskEntry {
  static readonly type = '[Task] Nullify Task Entry';
  constructor() { }
}
