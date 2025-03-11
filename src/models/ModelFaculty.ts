export interface IModelFaculty {
  id: string;
  facultyCode: string;
  facultyTH: string;
  facultyEN: string;
  department: IModelDepartment[];
  curriculum: IModelCurriculum[];
}

export interface IModelDepartment {
  nameTH: string;
  nameEN: string;
  code: string;
}

export interface IModelCurriculum {
  nameTH: string;
  nameEN: string;
  code: string;
  disable?: boolean;
}
