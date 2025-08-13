export interface ITimeslot {
  id?: string;
  timeslotName: string;
  slug?: string;
  startTime: string | Date;
  endTime: string | Date;
  description?: string;
  isAvailable: boolean;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

export interface ITimeslotCreateRequest {
  timeslotName: string;
  startTime: string | Date;
  endTime: string | Date;
  description?: string;
  isAvailable?: boolean;
}

export interface ITimeslotUpdateRequest extends ITimeslotCreateRequest {
  id: string;
}
