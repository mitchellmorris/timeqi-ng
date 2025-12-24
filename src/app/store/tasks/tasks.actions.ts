import { InstanceTask, Task } from '@betavc/timeqi-sh';

export class SetProjectTasks {
  static readonly type = '[Project] Set Project Tasks';
  constructor(public tasks: InstanceTask[]) { }
}

export class SetTask {
  static readonly type = '[Task Resolver] Set Task';
  constructor(public id: string | null) { }
}

export class SetProjectTaskProjection {
  static readonly type = '[Project] Set Task Projection';
  constructor(readonly taskProjection: Task) { }
}

export class SetProjectTasksProjections {
  static readonly type = '[Project] Set Tasks Projections';
  constructor(readonly taskProjections: Partial<InstanceTask>[]) { }
}

export class UpdateTask {
  static readonly type = '[Task Edit Form] Update Task';
  constructor(public id: string, public task: Partial<Task>) { }
}

export class NullifyProjectTask {
  static readonly type = '[Project] Nullify Project Task';
  constructor() { }
}

export class NullifyTask {
  static readonly type = '[Task] Nullify Task';
  constructor() { }
}

export class CleanProjectTasks {
  static readonly type = '[Project] Clean Project Tasks';
  constructor() { }
}
