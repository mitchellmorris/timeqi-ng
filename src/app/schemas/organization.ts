import { Project } from "./project";
import { User } from "./user";
export interface Organization {
  _id: string;
  name: string;
  projects?: Partial<Project>[];
  sponsor: User;
}
export interface OrganizationsStateModel {
  organizations: Partial<Organization>[];
  organization: Organization | null;
}