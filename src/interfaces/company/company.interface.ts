export enum CompanySize {
  STARTUP = 'startup',
  SMALL = 'small',
  MEDIUM = 'medium',
  LARGE = 'large',
  ENTERPRISE = 'enterprise',
}

export interface ICompany {
  id?: string;
  name: string;
  description: string;
  industry: string;
  location: string;
  website: string;
  logoUrl?: string;
  size: CompanySize;
  contactNumber?: string;
  contactEmail?: string;
  createdAt?: string;
  updatedAt?: string;
}
