export enum JobType {
  FULL_TIME = 'full_time',
  PART_TIME = 'part_time',
  CONTRACT = 'contract',
  INTERNSHIP = 'internship',
  REMOTE = 'remote',
}

export enum ExperienceLevel {
  ENTRY = 'entry',
  MID = 'mid',
  SENIOR = 'senior',
  LEAD = 'lead',
  EXECUTIVE = 'executive',
}

export enum JobStatus {
  OPEN = 'open',
  CLOSED = 'closed',
  DRAFT = 'draft',
}

export interface IJob {
  id?: string;
  title: string;
  description: string;
  companyId: string;
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
