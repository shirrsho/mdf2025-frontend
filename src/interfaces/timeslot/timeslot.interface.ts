export interface ITimeslot {
  id?: string;
  timeslotName: string;
  slug?: string;
  startTime: string | Date;
  endTime: string | Date;
  description?: string;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

export interface ITimeslotCreateRequest {
  timeslotName: string;
  startTime: string | Date;
  endTime: string | Date;
  description?: string;
}

export interface ITimeslotUpdateRequest extends ITimeslotCreateRequest {
  id: string;
}
