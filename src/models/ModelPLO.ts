export interface IModelPLO {
  id: string;
  name: string;
  facultyCode: string;
  curriculum: string[];
  criteriaTH: string;
  criteriaEN: string;
  data: IModelPLONo[];
  canEdit?: boolean;
}

export interface IModelPLONo {
  id: string;
  no: number;
  descTH: string;
  descEN: string;
}
