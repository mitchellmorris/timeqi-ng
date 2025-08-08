import { Entry } from "./entry";
import { User } from "./user";
export interface Task {
  _id: string;
  name: string;
  assignee: User;
  entries?: Entry[];
}
export interface TasksStateModel {
  tasks: Partial<Task>[];
  task: Task | null;
}