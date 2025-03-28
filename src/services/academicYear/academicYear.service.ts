import { isValidResponse } from "@/helpers/functions/validation";
import { academicYearController } from "./academicYear.repository";
import {
  AcademicYearRequestDTO,
  CreateAcademicYearRequestDTO,
} from "./dto/academicYear.dto";

const academicYearService = academicYearController();

export const getAcademicYear = async (params?: AcademicYearRequestDTO) => {
  const res = await academicYearService.getAcademicYear(params);
  return isValidResponse(res);
};
export const createAcademicYear = async (
  params: CreateAcademicYearRequestDTO
) => {
  const res = await academicYearService.createAcademicYear(params);
  return isValidResponse(res);
};
export const activeAcademicYear = async (id: string) => {
  const res = await academicYearService.activeAcademicYear(id);
  return isValidResponse(res);
};
// export const updateProcessTqf3 = async (id: string, params: any) => {
//   const res = await academicYearService.updateProcessTqf3(id, params);
//   return isValidResponse(res);
// };
export const deleteAcademicYear = async (id: string) => {
  const res = await academicYearService.deleteAcademicYear(id);
  return isValidResponse(res);
};
