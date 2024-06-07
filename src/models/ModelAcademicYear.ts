import { IModelUser } from "./ModelUser";

export interface IModelAcademicYear {
  creator: IModelUser;
  modifier: IModelUser;
  year: number;
  semester: number;
  isActive: boolean;
  // courses: Course[];
  courses: any[];
  createdAt: Date;
  updatedAt: Date;
}
