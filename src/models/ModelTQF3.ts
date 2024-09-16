import { EVALUATE_TYPE, TQF_STATUS } from "@/helpers/constants/enum";
import { IModelPLONo } from "./ModelPLO";

export interface IModelTQF3 {
  id: string;
  status: TQF_STATUS;
  part1?: IModelTQF3Part1;
  part2?: IModelTQF3Part2;
  part3?: IModelTQF3Part3;
  part4?: { data: IModelTQF3Part4[]; updatedAt: Date };
  part5?: { data: IModelTQF3Part5[]; updatedAt: Date };
  part6?: { data: IModelTQF3Part6[]; updatedAt: Date };
  part7?: "";
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
  clo: IModelCLO;
  evals: {
    eval: IModelEval;
    evalWeek: number[];
  }[];
}

export interface IModelTQF3Part5 {
  mainRef: string;
  recDoc: string;

  clo: IModelCLO;
  plo: IModelPLONo[];
}

export interface IModelTQF3Part6 {
  topic: string;
  detail: string[];
  other?: string;
}

export interface IModelCLO {
  id: string;
  cloNo: number;
  cloDescTH: string;
  cloDescEN: string;
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
  evalNo: number;
  evalTopicTH: string;
  evalTopicEN: string;
  evalDesc: string;
  evalPercent: number;
}
