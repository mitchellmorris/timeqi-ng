import { PopulatedOrganization } from "./organization";

export interface LoginUser {
	email: string;
	password: string;
}

export interface PopulatedUser {
  _id: string;
  name: string;
}
export interface User extends PopulatedUser {
  email: string;
  organizations?: PopulatedOrganization[];
}
export interface UserStateModel {
  users: PopulatedUser[];
  user: User | null
}