import { isValidResponse } from "@/helpers/functions/validation";
import { courseManagementController } from "./courseManagement.repository";
import {
  CourseManagementRequestDTO,
  CourseManagementSearchDTO,
} from "./dto/courseManagement.dto";

const courseManagementService = courseManagementController();

export const getCourseManagement = async (
  params?: CourseManagementSearchDTO
) => {
  const res = await courseManagementService.getCourseManagement(params);
  return isValidResponse(res);
};
export const getOneCourseManagement = async (params: any) => {
  const res = await courseManagementService.getOneCourseManagement(params);
  return isValidResponse(res);
};
export const createCourseManagement = async (
  params: CourseManagementRequestDTO
) => {
  const res = await courseManagementService.createCourseManagement(params);
  return isValidResponse(res);
};
export const checkCanCreateSectionManagement = async (params: any) => {
  const res = await courseManagementService.checkCanCreateSectionManagement(
    params
  );
  return isValidResponse(res);
};
// export const createSectionManagement = async (id: string, params: any) => {
//   const res = await courseManagementService.createSectionManagement(id, params);
//   return isValidResponse(res);
// };
export const updateCourseManagement = async (id: string, params: any) => {
  const res = await courseManagementService.updateCourseManagement(id, params);
  return isValidResponse(res);
};
export const updateSectionManagement = async (
  id: string,
  section: string,
  params: any
) => {
  const res = await courseManagementService.updateSectionManagement(
    id,
    section,
    params
  );
  return isValidResponse(res);
};
export const updateCoInsSections = async (params: any) => {
  const res = await courseManagementService.updateCoInsSections(params);
  return isValidResponse(res);
};
export const deleteCourseManagement = async (id: string, params: any) => {
  const res = await courseManagementService.deleteCourseManagement(id, params);
  return isValidResponse(res);
};
export const deleteSectionManagement = async (
  id: string,
  section: string,
  params: any
) => {
  const res = await courseManagementService.deleteSectionManagement(
    id,
    section,
    params
  );
  return isValidResponse(res);
};
export const ploMapping = async (params: any) => {
  const res = await courseManagementService.ploMapping(params);
  return isValidResponse(res);
};
