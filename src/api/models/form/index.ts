export interface Form {
  id: number;
  formId: string;
  userId: number;
  firstName?: string;
  lastName?: string;
  department?: string;
  division?: string;
  branch?: string;
  unit?: string;
  email?: string;
  mailcode?: string;
  daysOffTravelStatus?: string;
  dateBackToWork?: Date;
  travelDuration?: string;
  purpose?: string; // DEPRECATED: remove after 2023-10-19
  purposeId?: number;
  travelAdvance?: string;
  eventName?: string;
  summary?: string;
  benefits?: string;
  supervisorEmail?: string;
  status?: string;
  departureDate?: Date;
  stops?: any[];
  expenses?: any[];
  estimates?: any[];
  requestChange?: string;
  denialReason?: string;
  oneWayTrip?: string;
  multiStop?: string;
  createdBy?: string;
  createdDate?: Date;
  deletedBy?: string;
  deletedDate?: Date;
  deleted?: string;
}
