export interface IModelPLOCollection {
  departmentCode: string;
  departmentEN: string;
  collections: IModelPLO[];
}
export interface IModelPLO {
  id: string;
  name: string;
  year: number;
  semester: number;
  isActive: boolean;
  facultyCode: string;
  departmentCode: string[];
  criteriaTH: string;
  criteriaEN: string;
  data: IModelPLONo[];
}

export interface IModelPLONo {
  no: number;
  descTH: string;
  descEN: string;
}
