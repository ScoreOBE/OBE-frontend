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
    createCourse: async (params: Partial<IModelCourse>) => {
      return service.put(`${prefix}`, { ...params });
    },
    updateCourse: async (id: string, params: Partial<IModelCourse>) => {
      return service.put(`${prefix}/${id}`, { ...params });
    },
    deleteCourse: async (id: string) => {
      return service.delete(`${prefix}/${id}`, {});
    },
  };
};
