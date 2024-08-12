import { isValidResponse } from "@/helpers/functions/validation";
import { courseManagementController } from "./courseManagement.repository";
import { CourseManagementRequestDTO } from "./dto/courseManagement.dto";

const courseManagementService = courseManagementController();

export const getCourseManagement = async (
  params?: CourseManagementRequestDTO
) => {
  const res = await courseManagementService.getCourseManagement(params);
  return isValidResponse(res);
};

export const createCourseManagement = async (params: any) => {
  const res = await courseManagementService.createCourseManagement(params);
  return isValidResponse(res);
};

export const updateCourseManagement = async (id: string, params: any) => {
  const res = await courseManagementService.updateCourseManagement(id, params);
  return isValidResponse(res);
};

export const updateSectionManagement = async (id: string, params: any) => {
  const res = await courseManagementService.updateSectionManagement(id, params);
  return isValidResponse(res);
};

export const deleteCourseManagement = async (id: string) => {
  const res = await courseManagementService.deleteCourseManagement(id);
  return isValidResponse(res);
};

export const deleteSectionManagement = async (id: string) => {
  const res = await courseManagementService.deleteSectionManagement(id);
  return isValidResponse(res);
};