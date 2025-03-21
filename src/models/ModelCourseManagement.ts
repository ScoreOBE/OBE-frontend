import { IModelUser } from "./ModelUser";
import { IModelPLO } from "./ModelPLO";

export interface IModelCourseManagement {
  id: string;
  courseNo: string;
  courseName: string;
  descTH: string;
  descEN: string;
  updatedYear: number;
  updatedSemester: number;
  type: string;
  sections: Partial<IModelSectionManagement>[];
  ploRequire?: IModelPLORequire[];
  createdAt: Date;
  updatedAt: Date;
}

export interface IModelSectionManagement {
  id: string;
  topic?: string;
  ploRequire?: IModelPLORequire[];
  sectionNo: number;
  curriculum?: string;
  semester: number[] | string[];
  instructor: IModelUser;
  coInstructors: IModelUser[];
  isActive: boolean;
}

export interface IModelPLORequire {
  plo: IModelPLO | string;
  curriculum: string;
  list: string[];
}
