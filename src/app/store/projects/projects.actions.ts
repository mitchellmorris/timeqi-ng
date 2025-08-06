import { Project } from "../../schemas/project";

export class SetOrganizationProjects {
  static readonly type = '[Org] Set Organization Projects';
  constructor(public projects: Partial<Project>[]) { }
}
