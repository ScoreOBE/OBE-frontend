import { isValidResponse } from "@/helpers/functions/validation";
import { facultyController } from "./faculty.repository";
import { IModelCurriculum, IModelFaculty } from "@/models/ModelFaculty";

const userService = facultyController();

export const getFaculty = async (
  facultyCode: string
): Promise<IModelFaculty> => {
  const res = await userService.getFaculty(facultyCode);
  return isValidResponse(res);
};

export const createCurriculum = async (
  id: string,
  params: IModelCurriculum
): Promise<IModelFaculty> => {
  const res = await userService.createCurriculum(id, params);
  return isValidResponse(res);
};

export const updateCurriculum = async (
  id: string,
  code: string,
  params: IModelCurriculum
): Promise<IModelFaculty> => {
  const res = await userService.updateCurriculum(id, code, params);
  return isValidResponse(res);
};

export const deleteCurriculum = async (
  id: string,
  code: string
): Promise<IModelFaculty> => {
  const res = await userService.deleteCurriculum(id, code);
  return isValidResponse(res);
};
