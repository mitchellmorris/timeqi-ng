import { Organization } from "./organization";
export interface User {
  _id: string;
  name: string;
  email: string;
  organizations?: Partial<Organization>[];
	password: string;
}
export interface UserStateModel {
  users: User[];
  user: User | null
}