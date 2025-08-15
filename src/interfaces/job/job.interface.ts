import { ICompany } from '../company';

export enum JobType {
  FULL_TIME = 'full_time',
  PART_TIME = 'part_time',
  CONTRACT = 'contract',
  INTERNSHIP = 'internship',
  REMOTE = 'remote',
}

export enum ExperienceLevel {
  ENTRY = '0-2 Years',
  MID = '3-5 Years',
  SENIOR = '6-8 Years',
  LEAD = '9-12 Years',
  EXECUTIVE = '12+ Years',
}

export enum JobStatus {
  OPEN = 'open',
  CLOSED = 'closed',
}

export interface IJob {
  id?: string;
  title: string;
  description: string;
  company: ICompany;
  location: string;
  type: JobType;
  experienceLevel: ExperienceLevel;
  salaryMin?: number;
  salaryMax?: number;
  currency?: string;
  skills: string[];
  requirements: string[];
  benefits?: string[];
  applicationDeadline: string | Date;
  status: JobStatus;
  slug?: string;
  createdAt?: string;
  updatedAt?: string;
}
