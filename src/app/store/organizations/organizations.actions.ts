import { Organization } from "../../schemas/organization";

export class AddOrganizations {
  static readonly type = '[Organizations] Add All';
  constructor(readonly payload: string) { }
}
