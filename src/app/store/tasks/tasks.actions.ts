import { Task } from "../../schemas/task";

export class SetProjectTasks {
  static readonly type = '[Project] Set Project Tasks';
  constructor(public tasks: Partial<Task>[]) { }
}

export class SetTask {
  static readonly type = '[Project] Set Task';
  constructor(public id: string) { }
}
