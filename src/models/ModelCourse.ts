import { IModelSection } from "./ModelSection";
import { IModelTQF3 } from "./ModelTQF3";
import { IModelTQF5 } from "./ModelTQF5";

export interface IModelCourse {
  id: string;
  year: number;
  semester: number;
  courseNo: string;
  courseName: string;
  type: string;
  sections: Partial<IModelSection>[];
  addFirstTime?: boolean;
  TQF3?: IModelTQF3;
  TQF5?: IModelTQF5;
}
