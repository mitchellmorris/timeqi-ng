import { Organization } from "./organization";
import { TimeOff } from "./time-off";
export interface User {
  _id: string;
  name: string;
  email: string;
  organizations?: Partial<Organization>[];
  timeOff?: Partial<TimeOff>[];
	password: string;
}
export interface UserStateModel {
  users: User[];
  user: User | null
}