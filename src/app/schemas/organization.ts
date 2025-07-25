import { PopulatedUser } from "./user";

export interface PopulatedOrganization {
  _id: string;
  name: string;
  sponsor: PopulatedUser;
  users: PopulatedUser[];
}
export interface Organization extends PopulatedOrganization {
  projects: string[];
}
export interface OrganizationsStateModel {
  organizations: PopulatedOrganization[];
  organization: Organization | null;
}