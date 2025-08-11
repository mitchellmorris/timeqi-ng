import { Project } from "./project";
import { TimeOff } from "./time-off";
import { User } from "./user";
export interface Organization {
  _id: string;
  name: string;
  projects?: Partial<Project>[];
  timeOff?: Partial<TimeOff>[];
  sponsor: User;
}
export interface OrganizationsStateModel {
  organizations: Partial<Organization>[];
  organization: Organization | null;
}