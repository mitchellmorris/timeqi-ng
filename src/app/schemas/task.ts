import { User } from "./user";
export interface Task {
  _id: string;
  name: string;
  assignee: User;
}
export interface TasksStateModel {
  tasks: Partial<Task>[];
  task: Task | null;
}