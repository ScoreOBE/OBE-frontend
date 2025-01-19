import { isValidResponse } from "@/helpers/functions/validation";
import { facultyController } from "./faculty.repository";
import { IModelFaculty } from "@/models/ModelFaculty";

const userService = facultyController();

export const getFaculty = async (
  facultyCode: string
): Promise<IModelFaculty> => {
  const res = await userService.getFaculty(facultyCode);
  return isValidResponse(res);
};
