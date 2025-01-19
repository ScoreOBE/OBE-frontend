export interface IModelPLOCollection {
  code: string;
  nameEN: string;
  nameTH: string;
  collections: IModelPLO[];
}
export interface IModelPLO {
  id: string;
  name: string;
  year: number;
  semester: number;
  isActive: boolean;
  facultyCode: string;
  curriculum: string[];
  criteriaTH: string;
  criteriaEN: string;
  data: IModelPLONo[];
}

export interface IModelPLONo {
  id: string;
  no: number;
  descTH: string;
  descEN: string;
}
