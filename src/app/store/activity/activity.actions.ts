import { Activity } from "@betavc/timeqi-sh";

export class SetTaskActivity {
  static readonly type = '[Task] Set Task Activity';
  constructor(public activity: Activity[]) { }
}
export class CleanTaskActivity {
  static readonly type = '[Task] Clean Task Activity';
  constructor() { }
}
