import { InstanceOrganization, SchedulingSettings } from '@betavc/timeqi-sh';

/**
 * @Action(SetUser)
 * Dispatched to set the current user in the state 
 * on application startup.
 */
export class SetUserOrganizations {
  static readonly type = '[App] Set User Organizations';
  constructor(public organizations: InstanceOrganization[]) { }
}
/**
 * organizationResolvers.ts
 * Dispatched to set the current organization in the state 
 * when navigating to an organization.
 * Note this nullifies the project state as well.
 */
export class SetOrganization {
  static readonly type = '[Org] Set Organization';
  constructor(public id: string) { }
}
/**
 * @Action(SetTaskProject)
 * @Action(SetProject)
 * Dispatched to set the current project in the state 
 * when navigating to a project.
 */
export class SetProjectOrganization {
  static readonly type = '[Project] Set Organization';
  constructor(public id: string) { }
}
/**
 * organization-scheduling.ts (onSubmit)
 * Dispatched to save the organization's scheduling settings.
 */
export class SaveOrganizationSchedule {
  static readonly type = '[Org] Save Org. Scheduling';
  constructor(public id: string, public organization: Partial<SchedulingSettings>) { }
}
