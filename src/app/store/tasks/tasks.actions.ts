import { PartialTask, Task } from '@betavc/timeqi-sh';
import { NullifyOrgProject } from '../projects/projects.actions';

export class SetProjectTasks {
  static readonly type = '[Project] Set Project Tasks';
  constructor(public tasks: PartialTask[]) { }
}

export class SetTask {
  static readonly type = '[Project] Set Task';
  constructor(public id: string | null) { }
}

export class NullifyProjectTask {
  static readonly type = '[Project] Nullify Project Task';
  constructor() { }
}

export class CleanOrgTasks {
  static readonly type = '[Org] Clean Org Tasks';
  constructor() { }
}
