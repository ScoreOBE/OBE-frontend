import { COURSE_TYPE } from "@/helpers/constants/enum";
import { IModelAcademicYear } from "./ModelAcademicYear";

export interface IModelCourse {
  id: string;
  academicYear: IModelAcademicYear;
  courseNo: number;
  courseName: string;
  type: COURSE_TYPE;
  // sections: Section[];
  sections: any[];
  addFirstTime?: boolean;
  isProcessTQF3: boolean;
  // TQF3: TQF;
  // TQF5: TQF;
  TQF3?: any;
  TQF5?: any;
}
