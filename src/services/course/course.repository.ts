import { IModelCourse } from "@/models/ModelCourse";
import apiService from "@/services/apiService";
import { CourseRequestDTO } from "./dto/course.dto";

export const courseController = (configService = {}) => {
  const service = apiService(configService);
  const prefix = "/course";

  return {
    getCourse: async (params?: CourseRequestDTO) => {
      return service.get(`${prefix}`, { ...params });
    },
    getOneCourse: async (params?: CourseRequestDTO) => {
      return service.get(`${prefix}/one`, { ...params });
    },
    getExistsCourseName: async (courseNo: string, params: any) => {
      return service.get(`${prefix}/name/${courseNo}`, { ...params });
    },
    checkCanCreateCourse: async (params: Partial<IModelCourse>) => {
      return service.get(`${prefix}/check`, { ...params });
    },
    createCourse: async (params: Partial<IModelCourse>) => {
      return service.post(`${prefix}`, { ...params });
    },
    updateCourse: async (id: string, params: Partial<IModelCourse>) => {
      return service.put(`${prefix}/${id}`, { ...params });
    },
    deleteCourse: async (id: string) => {
      return service.delete(`${prefix}/${id}`, {});
    },
    leaveCourse: async (id: string) => {
      return service.post(`${prefix}/leave/${id}`, {});
    },
  };
};
