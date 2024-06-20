import { IModelCourse } from "@/models/ModelCourse";
import apiService from "@/services/apiService";
import { CourseRequestDTO } from "./dto/course.dto";

export const courseController = (configService = {}) => {
  const service = apiService(configService);

  return {
    getCourse: async (params?: CourseRequestDTO) => {
      return service.get(`/course`, { ...params });
    },
    getOneCourse: async (params?: CourseRequestDTO) => {
      return service.get(`/course/one`, { ...params });
    },
    createCourse: async (params: Partial<IModelCourse>) => {
      return service.put(`/course`, { ...params });
    },
    updateCourse: async (id: string, params: Partial<IModelCourse>) => {
      return service.put(`/course/${id}`, { ...params });
    },
    deleteCourse: async (id: string) => {
      return service.delete(`/course/${id}`, {});
    },
  };
};
