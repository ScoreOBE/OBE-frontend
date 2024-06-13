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
  role: string;
  // enrollCourses: Course[];
  // ownCourses: Course[];
  // coCourses: Course[];
  enrollCourses?: any[];
  ownCourses?: any[];
  coCourses?: any[];
}
