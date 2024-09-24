import { EVALUATE_TYPE, TQF_STATUS } from "@/helpers/constants/enum";
import { IModelPLONo } from "./ModelPLO";

export interface IModelTQF3 {
  id: string;
  status: TQF_STATUS;
  part1?: IModelTQF3Part1;
  part2?: IModelTQF3Part2;
  part3?: IModelTQF3Part3;
  part4?: { data: IModelTQF3Part4[]; updatedAt: Date };
  part5?: IModelTQF3Part5;
  part6?: { data: IModelTQF3Part6[]; updatedAt: Date };
  part7?: { data: IModelTQF3Part7[]; updatedAt: Date };
  updatedAt: Date;
}

export interface IModelTQF3Part1 {
  curriculum: string;
  courseType: string;
  studentYear: number[];
  mainInstructor: string;
  instructors: string[];
  teachingLocation: { in: string; out: string };
  consultHoursWk: number;
  updatedAt: Date;
}

export interface IModelTQF3Part2 {
  teachingMethod: string[];
  evaluate: EVALUATE_TYPE;
  clo: IModelCLO[];
  schedule: IModelSchedule[];
  updatedAt: Date;
}

export interface IModelTQF3Part3 {
  gradingPolicy: string;
  eval: IModelEval[];
  updatedAt: Date;
}

export interface IModelTQF3Part4 {
  clo: IModelCLO | string;
  percent: number;
  evals: {
    eval: IModelEval | string;
    evalWeek: number[];
    percent: number;
  }[];
}

export interface IModelTQF3Part5 {
  mainRef: string;
  recDoc: string;
  updatedAt: Date;
}

export interface IModelTQF3Part6 {
  topic: string;
  detail: string[];
  other?: string;
}

export interface IModelTQF3Part7 {
  clo: IModelCLO;
  plo: IModelPLONo[];
}
export interface IModelCLO {
  id: string;
  no: number;
  descTH: string;
  descEN: string;
  learningMethod: string[];
  other?: string;
}

export interface IModelSchedule {
  id: string;
  weekNo: number;
  topic: string;
  lecHour: number;
  labHour: number;
}

export interface IModelEval {
  id: string;
  no: number;
  topicTH: string;
  topicEN: string;
  desc: string;
  percent: number;
}
