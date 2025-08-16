import { Project, PartialProject } from "@betavc/timeqi-sh";

export class SetOrganizationProjects {
  static readonly type = '[Org] Set Organization Projects';
  constructor(public projects: PartialProject[]) { }
}
export class SetProjectOrgProjects {
  static readonly type = '[Project] Set Organization Projects';
  constructor(public projects: PartialProject[]) { }
}

export class SetProject {
  static readonly type = '[Project] Set Project';
  constructor(public id: string) { }
}
