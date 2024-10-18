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
  students?: IModelUser[];
  isActive: boolean;
  addFirstTime?: boolean;
  assignments?: IModelAssignment[];
  TQF3?: IModelTQF3;
  TQF5?: IModelTQF5;
}

export interface IModelAssignment {
  name: string;
  desc: string;
  isPublish: boolean;
  weight: number;
  questions: IModelQuestion[];
}

export interface IModelQuestion {
  no: number;
  desc: string;
  fullScore: number;
  scores: IModelScore[];
}

export interface IModelScore {
  student: IModelUser;
  point: number;
}
