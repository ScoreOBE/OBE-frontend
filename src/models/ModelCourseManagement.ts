import { COURSE_TYPE } from "@/helpers/constants/enum";
import { IModelUser } from "./ModelUser";

export interface IModelCourseManagement {
  id: string;
  courseNo: string;
  courseName: string;
  updatedYear: number;
  updatedSemester: number;
  type: COURSE_TYPE;
  sections: IModelSectionManagement[];
  createdAt: Date;
  updatedAt: Date;
}

export interface IModelSectionManagement {
  id: string;
  topic?: string;
  sectionNo: number;
  semester: number[] | string[];
  instructor: IModelUser;
  coInstructors: IModelUser[];
  isActive: boolean;
}
