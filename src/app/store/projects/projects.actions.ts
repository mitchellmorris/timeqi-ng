import { Project, PartialProject } from "@betavc/timeqi-sh";

export class SetOrganizationProjects {
  static readonly type = '[Org] Set Organization Projects';
  constructor(public projects: PartialProject[]) { }
}
export class SetProjectOrgProjects {
  static readonly type = '[Project] Set Organization Projects';
  constructor(public projects: PartialProject[]) { }
}
export class SetTaskOrgProjects {
  static readonly type = '[Task] Set Organization Projects';
  constructor(public projects: PartialProject[]) { }
}

export class SetProject {
  static readonly type = '[Project] Set Project';
  constructor(public id: string) { }
}

export class SetTaskProject {
  static readonly type = '[Task] Set Project';
  constructor(public id: string) { }
}

export class SaveProjectSchedule {
  static readonly type = '[Project] Save Project Scheduling';
  constructor(public id: string, public project: Partial<Project>) { }
}

export class NullifyOrgProject {
  static readonly type = '[Org] Nullify Organization Project';
  constructor() { }
}
