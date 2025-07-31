import { IMailBlueprint } from './mail-blueprint.interface';

export interface IMailAutomation {
  id?: string;
  name: string;
  resourceName: string;
  bluePrintId: IMailBlueprint;
  createdAt?: string;
}
