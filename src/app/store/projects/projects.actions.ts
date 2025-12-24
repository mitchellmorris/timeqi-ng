import { Project, InstanceProject } from "@betavc/timeqi-sh";

export class SetOrganizationProjects {
  static readonly type = '[Org] Set Organization Projects';
  constructor(public projects: InstanceProject[]) { }
}

export class SetProject {
  static readonly type = '[Project Resolver] Set Project';
  constructor(public id: string) { }
}

export class SetProjectProjection {
  static readonly type = '[Projection Service] Set Project Projection';
  constructor(readonly project: Project) { }
}

export class SetTaskProject {
  static readonly type = '[Task] Set TaskProject';
  constructor(public id: string) { }
}

export class SaveProjectSchedule {
  static readonly type = '[Project Scheduling Form] Save Project Scheduling';
  constructor(public id: string, public project: Partial<Project>) { }
}
export class NullifyProject {
  static readonly type = '[Project] Nullify Project';
  constructor() { }
}

export class NullifyOrgProject {
  static readonly type = '[Org] Nullify Organization Project';
  constructor() { }
}

export class CleanOrgProjects {
  static readonly type = '[Org] Clean Projects';
  constructor() { }
}