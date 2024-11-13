import { IModelUser } from "./ModelUser";
import { IModelTQF3 } from "./ModelTQF3";
import { IModelTQF5 } from "./ModelTQF5";

export interface IModelCourse {
  id: string;
  year: number;
  semester: number;
  courseNo: string;
  courseName: string;
  type: string;
  sections: Partial<IModelSection>[];
  addFirstTime?: boolean;
  TQF3?: IModelTQF3;
  TQF5?: IModelTQF5;
}

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
  students: { student: IModelUser; scores: IModelScore[] }[];
  assignments: IModelAssignment[];
  TQF3?: IModelTQF3;
  TQF5?: IModelTQF5;
}

export interface IModelAssignment {
  name: string;
  isPublish: boolean;
  weight: number;
  questions: IModelQuestion[];
  createdAt: Date;
}

export interface IModelQuestion {
  name: string;
  desc: string;
  fullScore: number;
}

export interface IModelScore {
  assignmentName: string;
  questions: {
    name: string;
    score: number;
  }[];
}
