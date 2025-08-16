import { PartialEntry } from '@betavc/timeqi-sh';

export class SetTaskEntries {
  static readonly type = '[Task] Set Task Entries';
  constructor(public entries: PartialEntry[]) { }
}
