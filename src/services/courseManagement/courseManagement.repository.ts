import apiService from "@/services/apiService";
import { CourseManagementRequestDTO } from "./dto/courseManagement.dto";

export const courseManagementController = (configService = {}) => {
  const service = apiService(configService);
  const prefix = "/courseManagement";

  return {
    getCourseManagement: async (params?: CourseManagementRequestDTO) => {
      return service.get(`${prefix}`, { ...params });
    },
    createCourseManagement: async (params: any) => {
      return service.post(`${prefix}`, { ...params });
    },
    updateCourseManagement: async (id: string, params: any) => {
      return service.put(`${prefix}/course/${id}`, { ...params });
    },
    updateSectionManagement: async (id: string, params: any) => {
      return service.put(`${prefix}/section/${id}`, { ...params });
    },
    deleteCourseManagement: async (id: string) => {
      return service.delete(`${prefix}/course/${id}`, {});
    },
    deleteSectionManagement: async (id: string) => {
      return service.delete(`${prefix}/section/${id}`, {});
    },
  };
};
