export interface TimeOff {
  _id: string;
  name: string;
  type: string; // e.g., 'vacation', 'sick leave'
}
export interface TimeOffStateModel {
  timeoff: Partial<TimeOff>[];
}
