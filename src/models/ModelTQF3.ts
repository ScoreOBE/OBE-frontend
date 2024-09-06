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
  clo: IModelCLO[];
  schedule: {
    weekNo: number;
    topicDesc: string;
    lecHour: number;
    labHour: number;
  }[];
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
  clo: IModelCLO;
  plo: IModelPLONo[];
}

export interface IModelTQF3Part6 {
  topic: string;
  detail: String[];
}

export interface IModelCLO {
  id: string;
  cloNo: number;
  cloDescTH: string;
  cloDescEN: string;
}

export interface IModelEval {
  id: string;
  evalNo: number;
  evalTopicTH: string;
  evalTopicEN: string;
  evalDesc: string;
  evalPercent: number;
}
