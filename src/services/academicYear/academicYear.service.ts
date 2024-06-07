import { isValidResponse } from "@/helpers/functions/validation";
import { academicYearController } from "./academicYear.repository";
import { IModelAcademicYear } from "@/models/ModelAcademicYear";

const academicYearService = academicYearController();

export const getAcademicYear = async () => {
  const res = await academicYearService.getAcademicYear();
  return isValidResponse(res);
};
export const createAcademicYear = async (
  params: Partial<IModelAcademicYear>
) => {
  const res = await academicYearService.createAcademicYear(params);
  return isValidResponse(res);
};
export const activeAcademicYear = async (id: string) => {
  const res = await academicYearService.activeAcademicYear(id);
  return isValidResponse(res);
};
export const deleteAcademicYear = async (id: string) => {
  const res = await academicYearService.deleteAcademicYear(id);
  return isValidResponse(res);
};
