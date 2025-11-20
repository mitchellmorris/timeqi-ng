import { PartialTask, Task } from '@betavc/timeqi-sh';

/**
 * @Action(SetTaskProject)
 * @Action(SetProject)
 * Dispatches the action to set the project tasks.
 */
export class SetProjectTasks {
  static readonly type = '[Project] Set Project Tasks';
  constructor(public tasks: PartialTask[]) { }
}
/**
 * taskResolver.ts
 * Resolves the task for the given ID.
 */
export class SetTask {
  static readonly type = '[Project] Set Task';
  constructor(public id: string | null) { }
}

export class SetTaskProjection {
  static readonly type = '[Project] Set Task Projection';
  constructor(readonly taskProjection: Task) { }
}
/**
 * @Action(SetProject)
 * Dispatches the action to set the project
 * and nullify the current task.
 */
export class NullifyProjectTask {
  static readonly type = '[Project] Nullify Project Task';
  constructor() { }
}
/**
 * @Action(NullifyOrgProject)
 * Dispatches the action to clean all tasks for the organization.
 */
export class CleanOrgTasks {
  static readonly type = '[Org] Clean Org Tasks';
  constructor() { }
}
