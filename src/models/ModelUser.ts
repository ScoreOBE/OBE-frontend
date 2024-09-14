import { ROLE } from "@/helpers/constants/enum";

export interface IModelUser {
  [key: string]: any;
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
  // enrollCourses: Course[];
  // ownCourses: Course[];
  // coCourses: Course[];
  enrollCourses?: any[];
  ownCourses?: any[];
  coCourses?: any[];
}
