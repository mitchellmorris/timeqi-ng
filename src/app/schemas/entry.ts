import { User } from "./user";
export interface Entry {
  _id: string;
  name: string;
  performer: User;
}
export interface EntriesStateModel {
  entries: Partial<Entry>[];
  entry: Entry | null;
}