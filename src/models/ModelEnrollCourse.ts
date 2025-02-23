import { IModelAssignment, IModelQuestion } from "./ModelCourse";
import { IModelCLO, IModelEval } from "./ModelTQF3";
import { IModelTQF5Part2 } from "./ModelTQF5";
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
    plos: { curriculum: string; list: string[] }[][];
    assess: {
      eval: string;
      sheet: string[];
      percent: number;
      fullScore: number;
      range0: number;
      range1: number;
      range2: number;
      range3: number;
    }[];
    tqf5Part2: IModelTQF5Part2[];
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
