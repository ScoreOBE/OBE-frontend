import { ROLE } from "@/helpers/constants/enum";
import { IModelCourse } from "./ModelCourse";

export interface IModelUser {
  id: string;
  studentId?: string;
  firstNameTH: string;
  lastNameTH: string;
  firstNameEN: string;
  lastNameEN: string;
  email: string;
  facultyCode: string;
  departmentCode: string[];
  role: ROLE;
  termsOfService?: boolean;
  enrollCourses?: IModelEnrollCourse[];
}

export interface IModelEnrollCourse {
  year: number;
  semester: number;
  courses: {
    course: IModelCourse;
    section: number;
  }[];
}
