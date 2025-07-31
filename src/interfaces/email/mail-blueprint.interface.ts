export interface IMailBlueprint {
  id?: string;
  name: string;
  subjectContent: string;
  bodyContent: string;
  resourceName?: string;
  createdAt?: string;
  placeholders?: string[];
}
