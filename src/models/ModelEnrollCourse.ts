import { IModelAssignment, IModelQuestion } from "./ModelCourse";
import { IModelPLO, IModelPLONo } from "./ModelPLO";
import { IModelCLO } from "./ModelTQF3";
import { IModelUser } from "./ModelUser";

export interface IModelEnrollCourse {
  id: string;
  year: number;
  semester: number;
  courseNo: string;
  courseName: string;
  type: string;
  section: IModelEnrollSection;
  clos: {
    clo: IModelCLO;
    score: 0 | 1 | 2 | 3 | 4 | "-";
  }[];
  plo: IModelPLO;
  plos: (IModelPLONo & {
    name: string;
    score: number | "-";
    notMap?: boolean;
  })[];
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
