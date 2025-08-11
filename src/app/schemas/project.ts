import { Task } from "./task";
import { TimeOff } from "./time-off";
import { User } from "./user";
export interface Project {
  _id: string;
  name: string;
  sponsor: User;
  organization: string;
  tasks?: Partial<Task>[];
  timeOff?: Partial<TimeOff>[];
}
export interface ProjectsStateModel {
  projects: Partial<Project>[];
  project: Project | null;
}