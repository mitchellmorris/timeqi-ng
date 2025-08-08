import { Task } from "../../schemas/task";

export class SetProjectTasks {
  static readonly type = '[Project] Set Project Tasks';
  constructor(public tasks: Partial<Task>[]) { }
}
