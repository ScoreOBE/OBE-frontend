export interface IModelPLO {
  id: string;
  year: number;
  semester: number;
  facultyCode: string;
  departmentCode: string[];
  data: IModelPLONo[];
}

export interface IModelPLONo {
  no: number;
  descTH: string;
  descEN: string;
}
