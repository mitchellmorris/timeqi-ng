import { PartialTask, Task } from '@betavc/timeqi-sh';

export class SetProjectTasks {
  static readonly type = '[Project] Set Project Tasks';
  constructor(public tasks: PartialTask[]) { }
}

export class SetTask {
  static readonly type = '[Project] Set Task';
  constructor(public id: string | null) { }
}
