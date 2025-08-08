import { Task } from "./task";
import { User } from "./user";
export interface Project {
  _id: string;
  name: string;
  sponsor: User;
  organization: string;
  tasks?: Partial<Task>[];
}
export interface ProjectsStateModel {
  projects: Partial<Project>[];
  project: Project | null;
}