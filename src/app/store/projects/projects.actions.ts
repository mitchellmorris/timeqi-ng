import { Project } from "../../schemas/project";

export class SetOrganizationProjects {
  static readonly type = '[Org] Set Organization Projects';
  constructor(public projects: Partial<Project>[]) { }
}

export class SetProject {
  static readonly type = '[Project] Set Project';
  constructor(public id: string) { }
}
