export interface IMailCredential {
  transporterName?: string;
  smtpHost?: string;
  smtpPort?: string;
  smtpFrom?: string;
  smtpUser?: string;
  smtpPassword?: string;
  isDefault?: boolean;
  id?: string;
  _id?: string;
}
