import { EVALUATE_TYPE, TQF_STATUS } from "@/helpers/constants/enum";
import { IModelPLONo } from "./ModelPLO";

export interface IModelTQF3 {
  [key: string]: any;
  id: string;
  status: TQF_STATUS;
  part1?: IModelTQF3Part1;
  part2?: IModelTQF3Part2;
  part3?: IModelTQF3Part3;
  part4?: { data: IModelTQF3Part4[]; updatedAt: Date };
  part5?: { data: IModelTQF3Part5[]; updatedAt: Date };
  part6?: { data: IModelTQF3Part6[]; updatedAt: Date };
  updatedAt: Date;
}

export interface IModelTQF3Part1 {
  [key: string]: any;
  courseType: string;
  teachingMethod: string[];
  studentYear: number[];
  evaluate: EVALUATE_TYPE;
  instructors: string[];
  coordinator: string;
  lecPlace: string;
  labPlace: string;
  mainRef: string;
  recDoc: string;
  updatedAt: Date;
}

export interface IModelTQF3Part2 {
  [key: string]: any;
  clo: IModelCLO[];
  schedule: IModelSchedule[];
  updatedAt: Date;
}

export interface IModelTQF3Part3 {
  [key: string]: any;
  gradingPolicy: string;
  eval: IModelEval[];
  updatedAt: Date;
}

export interface IModelTQF3Part4 {
  [key: string]: any;
  clo: IModelCLO;
  evals: {
    eval: IModelEval;
    evalWeek: number[];
  }[];
}

export interface IModelTQF3Part5 {
  [key: string]: any;
  clo: IModelCLO;
  plo: IModelPLONo[];
}

export interface IModelTQF3Part6 {
  [key: string]: any;
  topic: string;
  detail: string[];
  other?: string;
}

export interface IModelCLO {
  [key: string]: any;
  id: string;
  cloNo: number;
  cloDescTH: string;
  cloDescEN: string;
  learningMethod: string[];
  other?: string;
}

export interface IModelSchedule {
  [key: string]: any;
  id: string;
  weekNo: number;
  topicDesc: string;
  lecHour: number;
  labHour: number;
}

export interface IModelEval {
  [key: string]: any;
  id: string;
  evalNo: number;
  evalTopicTH: string;
  evalTopicEN: string;
  evalDesc: string;
  evalPercent: number;
}
