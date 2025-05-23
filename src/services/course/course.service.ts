import { isValidResponse } from "@/helpers/functions/validation";
import { courseController } from "./course.repository";
import { IModelCourse } from "@/models/ModelCourse";
import { CourseRequestDTO } from "./dto/course.dto";

const courseService = courseController();

export const getCourse = async (params?: CourseRequestDTO) => {
  const res = await courseService.getCourse(params);
  return isValidResponse(res);
};
export const getOneCourse = async (params?: any) => {
  const res = await courseService.getOneCourse(params);
  return isValidResponse(res);
};
export const getExistsCourseData = async (courseNo: string, params: any) => {
  const res = await courseService.getExistsCourseData(courseNo, params);
  return isValidResponse(res);
};
export const checkCanCreateCourse = async (params: any) => {
  const res = await courseService.checkCanCreateCourse(params);
  return isValidResponse(res);
};
export const createCourse = async (params: Partial<IModelCourse>) => {
  const res = await courseService.createCourse(params);
  return isValidResponse(res);
};
export const updateCourse = async (
  id: string,
  params: Partial<IModelCourse>
) => {
  const res = await courseService.updateCourse(id, params);
  return isValidResponse(res);
};
export const deleteCourse = async (id: string) => {
  const res = await courseService.deleteCourse(id);
  return isValidResponse(res);
};
export const leaveCourse = async (id: string) => {
  const res = await courseService.leaveCourse(id);
  return isValidResponse(res);
};
