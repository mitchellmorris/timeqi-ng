import { User } from "./user";
export interface Project {
  _id: string;
  name: string;
  sponsor: User;
}
export interface ProjectsStateModel {
  projects: Partial<Project>[];
  project: Project | null;
}