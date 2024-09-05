import { COURSE_TYPE } from "@/helpers/constants/enum";
import { IModelUser } from "./ModelUser";
import { IModelPLONo } from "./ModelPLO";

export interface IModelCourseManagement {
  [key: string]: any;
  id: string;
  courseNo: string;
  courseName: string;
  updatedYear: number;
  updatedSemester: number;
  type: string;
  sections: Partial<IModelSectionManagement>[];
  plos?: IModelPLONo[] | string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface IModelSectionManagement {
  [key: string]: any;
  id: string;
  topic?: string;
  plos?: IModelPLONo[] | string[];
  sectionNo: number;
  semester: number[] | string[];
  instructor: IModelUser;
  coInstructors: IModelUser[];
  isActive: boolean;
}
