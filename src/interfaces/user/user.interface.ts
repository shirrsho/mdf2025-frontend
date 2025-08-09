import { Role, AccountStatus } from '@/enums';

export interface IUser {
  id: string;
  name: string;
  email: string;
  phone?: string;
  imageUrl: string;
  description: string;
  role: Role[];
  status: AccountStatus;
  isverified: boolean;
  providerId: string;
  createdAt: string;
  companyId?: string;
}
