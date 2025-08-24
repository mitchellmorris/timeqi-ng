import { Project, PartialProject } from "@betavc/timeqi-sh";

/**
 * @Action(SetOrganization)
 * Dispatched to set the current organization in the state
 * when navigating to an organization.
 */
export class SetOrganizationProjects {
  static readonly type = '[Org] Set Organization Projects';
  constructor(public projects: PartialProject[]) { }
}
/**
 * @Action(SetProjectOrganization)
 * Dispatched to set the current organization in the state
 * when navigating to a project.
 */
export class SetProjectOrgProjects {
  static readonly type = '[Project] Set Organization Projects';
  constructor(public projects: PartialProject[]) { }
}
/**
 * projectResolvers.ts
 * Resolves the project state before navigating to a project.
 */
export class SetProject {
  static readonly type = '[Project] Set Project';
  constructor(public id: string) { }
}

/**
 * @Action(SetTask)
 * Dispatches an action to set the current task in the state
 * when navigating to a task.
 */
export class SetTaskProject {
  static readonly type = '[Task] Set Project';
  constructor(public id: string) { }
}
/**
 * project-scheduling.ts (onSubmit)
 * Dispatched to save the project's scheduling settings.
 */
export class SaveProjectSchedule {
  static readonly type = '[Project] Save Project Scheduling';
  constructor(public id: string, public project: Partial<Project>) { }
}
/**
 * @Action(SetOrganization)
 * Dispatched to nullify the current project in the state
 * when navigating to a organization.
 */
export class NullifyOrgProject {
  static readonly type = '[Org] Nullify Organization Project';
  constructor() { }
}
