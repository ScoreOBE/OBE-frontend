import { IModelAssignment, IModelQuestion } from "./ModelCourse";
import { IModelPLONo } from "./ModelPLO";
import { IModelCLO, IModelEval } from "./ModelTQF3";
import { IModelUser } from "./ModelUser";

export interface IModelEnrollCourse {
  id: string;
  courseNo: string;
  courseName: string;
  type: string;
  section: IModelEnrollSection;
  clos: {
    clo: IModelCLO;
    evals: { eval: IModelEval; percent: number }[];
    plos: string[];
  }[];
  scores: IModelStudentScore[];
}

export interface IModelEnrollSection {
  sectionNo: number;
  topic?: string;
  instructor: IModelUser;
  coInstructors: IModelUser[];
  assignments: IModelStudentAssignment[];
}

export interface IModelStudentScore {
  assignmentName: string;
  questions: { name: string; score: number }[];
}

export interface IModelStudentAssignment extends IModelAssignment {
  questions: IModelStudentQuestion[];
  scores: number[];
}

export interface IModelStudentQuestion extends IModelQuestion {
  scores: number[];
}
