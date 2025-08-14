import { ICompany } from '../company/company.interface';
import { ITimeslot } from '../timeslot/timeslot.interface';

// Webinar Status Enum
export enum WebinarStatus {
  ACTIVE = 'active',
  CANCELLED = 'cancelled',
}

// Main Webinar Interface
export interface IWebinar {
  id?: string;
  title: string;
  description: string;
  hostId: string;
  timeslotId: string;
  duration: number; // Duration in minutes
  scheduledStartTime?: Date | string;
  maxParticipants?: number;
  meetingLink?: string;
  category?: string;
  status: WebinarStatus;
  bannerUrl?: string;
  createdAt?: string;

  // Populated fields
  host?: ICompany;
  timeslot?: ITimeslot;
}

// Create Webinar Request Interface
export interface IWebinarCreateRequest {
  title: string;
  description: string;
  host: string;
  timeslot: string;
  duration: number; // Duration in minutes
  scheduledStartTime?: Date | string;
  maxParticipants?: number;
  meetingLink?: string;
  category?: string;
  bannerUrl?: string;
}

// Update Webinar Request Interface
export interface IWebinarUpdateRequest {
  title?: string;
  description?: string;
  hostId?: string;
  timeslotId?: string;
  duration?: number; // Duration in minutes
  scheduledStartTime?: Date | string;
  maxParticipants?: number;
  meetingLink?: string;
  category?: string;
  status?: WebinarStatus;
  bannerUrl?: string;
}
