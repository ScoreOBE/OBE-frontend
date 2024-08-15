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

export const getOneCourseManagement = async (courseNo: string) => {
  const res = await courseManagementService.getOneCourseManagement(courseNo);
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

export const deleteCourseManagement = async (id: string) => {
  const res = await courseManagementService.deleteCourseManagement(id);
  return isValidResponse(res);
};

export const deleteSectionManagement = async (id: string, section: string) => {
  const res = await courseManagementService.deleteSectionManagement(
    id,
    section
  );
  return isValidResponse(res);
};
