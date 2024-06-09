import { IModelCourse } from "@/models/ModelCourse";
import apiService from "@/services/apiService";
import { CourseRequestDTO } from "./dto/course.dto";

export const courseController = (configService = {}) => {
  const service = apiService(configService);

  return {
    getCourse: async (params?: CourseRequestDTO) => {
      return service.get(`/courses`, { ...params });
    },
    createCourse: async (params: Partial<IModelCourse>) => {
      return service.put(`/courses`, { ...params });
    },
    activeCourse: async (id: string) => {
      return service.put(`/courses/${id}`, {});
    },
    deleteCourse: async (id: string) => {
      return service.delete(`/courses/${id}`, {});
    },
  };
};
