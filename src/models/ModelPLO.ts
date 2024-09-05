export interface IModelPLOCollection {
  [key: string]: any;
  departmentCode: string;
  departmentEN: string;
  collections: IModelPLO[];
}
export interface IModelPLO {
  [key: string]: any;
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
  [key: string]: any;
  id: string;
  no: number;
  descTH: string;
  descEN: string;
}
