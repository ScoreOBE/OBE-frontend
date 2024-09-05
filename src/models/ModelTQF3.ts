import { EVALUATE_TYPE, TQF_STATUS } from "@/helpers/constants/enum";
import { IModelUser } from "./ModelUser";
import { IModelPLONo } from "./ModelPLO";

export interface IModelTQF3 {
  id: string;
  status: TQF_STATUS;
  part1?: IModelTQF3Part1;
  part2?: IModelTQF3Part2;
  part3?: IModelTQF3Part3;
  part4?: IModelTQF3Part4[];
  part5?: IModelTQF3Part5[];
  part6?: IModelTQF3Part6[];
}

export interface IModelTQF3Part1 {
  courseType: string;
  teachingMethod: string[];
  studentYear: number[];
  evaluate: EVALUATE_TYPE;
  instructors: string[];
  coInstructors: string[];
  lecPlace: string;
  labPlace: string;
  mainRef: string;
  recDoc: string;
}

export interface IModelTQF3Part2 {
  clo: IModelCLO[];
  schedule: {
    weekNo: number;
    topicDesc: string;
    lecHour: number;
    labHour: number;
  }[];
}

export interface IModelTQF3Part3 {
  gradingPolicy: string;
  eval: IModelEval[];
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
