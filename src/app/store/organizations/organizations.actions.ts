import { Organization } from "../../schemas/organization";

export class SetUserOrganizations {
  static readonly type = '[App] Set User Organizations';
  constructor(public organizations: Partial<Organization>[]) { }
}
