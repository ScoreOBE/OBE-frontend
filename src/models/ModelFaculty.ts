export interface IModelFaculty {
  id: string;
  facultyCode: string;
  facultyTH: string;
  facultyEN: string;
  code: string;
  curriculum: IModelCurriculum[];
}

export interface IModelCurriculum {
  nameTH: string;
  nameEN: string;
  code: string;
}
