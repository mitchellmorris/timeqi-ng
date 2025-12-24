import { Activity } from "@betavc/timeqi-sh";

export class SetProjectTaskActivity {
  static readonly type = '[Project] Set Project Task Activity';
  constructor(public activity: Activity[]) { }
}

export class SetProjectActivity {
  static readonly type = '[Project] Set Project Activity';
  constructor(public activity: Activity[]) { }
}
export class CleanTaskActivity {
  static readonly type = '[Task] Clean Task Activity';
  constructor() { }
}
