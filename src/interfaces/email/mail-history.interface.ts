import { SentMailStatus } from '@/enums';

export interface IMailHistory {
  id?: string;
  recepitentEmail: string;
  resourceId: string;
  resourceName: string;
  tag: string;
  status: SentMailStatus;
  isOpened: boolean;
  openTimes: Date[];
  sentTimes: Date[];
  cc?: string[];
  bcc?: string[];
  blueprint: string;
  placeValues: Record<string, string>;

  isPredefined?: boolean;
  createdAt?: string;

  subject?: string;
  body?: string;
}
