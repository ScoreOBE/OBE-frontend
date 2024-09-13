export interface IModelFaculty {
  [key: string]: any;
  id: string;
  facultyCode: string;
  facultyTH: string;
  facultyEN: string;
  courseCode: number;
  codeEN: string;
  codeTH: string;
  department: IModelDepartment[];
}

export interface IModelDepartment {
  [key: string]: any;
  departmentTH: string;
  departmentEN: string;
  courseCode: number;
  codeEN: string;
  codeTH: string;
}
