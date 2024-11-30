import { METHOD_TQF5, TQF_STATUS } from "@/helpers/constants/enum";
import { IModelCLO, IModelEval } from "./ModelTQF3";

export interface IModelTQF5 {
  id: string;
  status: TQF_STATUS;
  method?: METHOD_TQF5;
  part1?: IModelTQF5Part1;
  part2?: { data: IModelTQF5Part2[]; updatedAt: Date };
  part3?: any;
  updatedAt: Date;
}

export interface IModelTQF5Part1 {
  courseEval: {
    sectionNo: number;
    A: number;
    Bplus: number;
    B: number;
    Cplus: number;
    C: number;
    Dplus: number;
    D: number;
    F: number;
    W: number;
    S: number;
    U: number;
    P: number;
  }[];
  gradingCriteria: {
    A: string;
    Bplus: string;
    B: string;
    Cplus: string;
    C: string;
    Dplus: string;
    D: string;
    F: string;
    W: string;
    S: string;
    U: string;
  };
  updatedAt: Date;
}

export interface IModelTQF5Part2 {
  clo: IModelCLO | string;
  assignments: { eval: IModelEval | string; questions: string[] }[];
}
