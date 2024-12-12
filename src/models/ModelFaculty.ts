export interface IModelFaculty {
  id: string;
  facultyCode: string;
  facultyTH: string;
  facultyEN: string;
  courseCode: number;
  codeEN: string;
  codeTH: string;
  department: IModelDepartment[];
  curriculum: IModelCurriculum[];
}

export interface IModelDepartment {
  departmentTH: string;
  departmentEN: string;
  courseCode: number;
  codeEN: string;
  codeTH: string;
}

export interface IModelCurriculum {
  nameTH: string;
  nameEN: string;
  code: string;
}
