import { Entry } from "../../schemas/entry";

export class SetTaskEntries {
  static readonly type = '[Task] Set Task Entries';
  constructor(public entries: Partial<Entry>[]) { }
}
