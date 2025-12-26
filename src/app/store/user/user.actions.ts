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

export class SetProjectUsers {
  static readonly type = '[Project] Set Project Users';
  constructor(public users: string[]) { }
}
export class SetTaskUsers {
  static readonly type = '[Task] Set Task Users';
  constructor(public users: string[]) { }
}
export class CleanOrganizationUsers {
  static readonly type = '[Org] Clean Organization Users';
  constructor() { }
}

export class CleanProjectUsers {
  static readonly type = '[Project] Clean Project Users';
  constructor() { }
}

export class CleanTaskUsers {
  static readonly type = '[Task] Clean Task Users';
  constructor() { }
}