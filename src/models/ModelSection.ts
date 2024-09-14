import { IModelTQF3 } from "./ModelTQF3";
import { IModelTQF5 } from "./ModelTQF5";
import { IModelUser } from "./ModelUser";

export interface IModelSection {
  id: string;
  sectionNo: number;
  topic?: string;
  semester?: number[] | string[];
  openThisTerm?: boolean;
  instructor: IModelUser | string;
  coInstructors: IModelUser[] | any[];
  isActive: boolean;
  addFirstTime?: boolean;
  assignments: any[];
  TQF3?: IModelTQF3;
  TQF5?: IModelTQF5;
}
