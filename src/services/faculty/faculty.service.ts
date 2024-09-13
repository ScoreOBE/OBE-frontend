import { isValidResponse } from "@/helpers/functions/validation";
import { facultyController } from "./faculty.repository";
import { IModelFaculty } from "@/models/ModelFaculty";

const userService = facultyController();

export const getDepartment = async (
  facultyCode: string
): Promise<IModelFaculty> => {
  const res = await userService.getDepartment(facultyCode);
  return isValidResponse(res);
};
