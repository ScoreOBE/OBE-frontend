export interface IModelFaculty {
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
  departmentTH: string;
  departmentEN: string;
  courseCode: number;
  codeEN: string;
  codeTH: string;
}
