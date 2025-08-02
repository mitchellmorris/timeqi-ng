import { User } from "./user";
export interface Organization {
  _id: string;
  name: string;
  projects: string[];
  users: Partial<User>[];
  sponsor: User;
}
export interface OrganizationsStateModel {
  organizations: Partial<Organization>[];
  organization: Organization | null;
}