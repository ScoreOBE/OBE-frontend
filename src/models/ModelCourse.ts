import { COURSE_TYPE } from "@/helpers/constants/enum";
import { IModelAcademicYear } from "./ModelAcademicYear";
import { IModelSection } from "./ModelSection";

export interface IModelCourse {
  id: string;
  academicYear: IModelAcademicYear | string;
  courseNo: string;
  courseName: string;
  type: COURSE_TYPE;
  sections: Partial<IModelSection>[];
  addFirstTime?: boolean;
  isProcessTQF3: boolean;
  // TQF3: TQF;
  // TQF5: TQF;
  TQF3?: any;
  TQF5?: any;
}
