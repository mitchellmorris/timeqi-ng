import { PartialUser } from "@betavc/timeqi-sh";

export class SetUser {
  static readonly type = '[App] Set User';
  constructor() { }
}
export class SetOrganizationUsers {
  static readonly type = '[Org] Set Organization Users';
  constructor(public users: PartialUser[]) { }
}
