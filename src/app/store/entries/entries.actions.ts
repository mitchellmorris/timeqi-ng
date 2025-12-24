

export class SetProjectTaskEntries {
  static readonly type = '[Project] Set Project Task Entries';
  constructor(public projectId: string) { }
}
export class CleanProjectTaskEntries {
  static readonly type = '[Project] Clean Project Task Entries';
  constructor() { }
}

export class NullifyTaskEntry {
  static readonly type = '[Task] Nullify Task Entry';
  constructor() { }
}
