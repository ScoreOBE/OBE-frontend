import { isValidResponse } from "@/helpers/functions/validation";
import { studentController } from "./student.repository";
import { IModelEnrollCourse } from "@/models/ModelEnrollCourse";

const studentService = studentController();

export const getEnrollCourse = async (params: {
  year: number;
  semester: number;
}): Promise<IModelEnrollCourse[]> => {
  const res = await studentService.getEnrollCourse(params);
  return isValidResponse(res);
};
