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
      return service.put(`${prefix}/${id}`, { ...params });
    },
    updateSectionManagement: async (
      id: string,
      section: string,
      params: any
    ) => {
      return service.put(`${prefix}/${id}/${section}`, { ...params });
    },
    deleteCourseManagement: async (id: string) => {
      return service.delete(`${prefix}/${id}`, {});
    },
    deleteSectionManagement: async (id: string, section: string) => {
      return service.delete(`${prefix}/${id}/${section}`, {});
    },
  };
};
