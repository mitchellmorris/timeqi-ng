import { InstanceUser } from "@betavc/timeqi-sh";

export class SetUser {
  static readonly type = '[App Component] Set User';
  constructor() { }
}

export class SetLoginUser {
  static readonly type = '[Login] Set Login User';
  constructor() { }
}
export class SetOrganizationUsers {
  static readonly type = '[Org] Set Organization Users';
  constructor(public users: InstanceUser[]) { }
}
export class SetProjectOrgUsers {
  static readonly type = '[Project] Set Project Organization Users';
  constructor(public users: InstanceUser[]) { }
}

export class CleanOrganizationUsers {
  static readonly type = '[Org] Clean Organization Users';
  constructor() { }
}