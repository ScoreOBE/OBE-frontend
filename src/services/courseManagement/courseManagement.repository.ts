import apiService from "@/services/apiService";
import { CourseManagementRequestDTO } from "./dto/courseManagement.dto";

export const courseManagementController = (configService = {}) => {
  const service = apiService(configService);
  const prefix = "/courseManagement";

  return {
    getCourseManagement: async (params?: CourseManagementRequestDTO) => {
      return service.get(`${prefix}`, { ...params });
    },
    getOneCourseManagement: async (courseNo: string) => {
      return service.get(`${prefix}/one`, { courseNo });
    },
    createCourseManagement: async (params: any) => {
      return service.post(`${prefix}`, { ...params });
    },
    checkCanCreateSectionManagement: async (params: any) => {
      return service.get(`${prefix}/check`, { ...params });
    },
    createSectionManagement: async (id: string, params: any) => {
      return service.post(`${prefix}/section/${id}`, { ...params });
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
    updateCoInsSections: async (params: any) => {
      return service.put(`${prefix}/coIns`, { ...params });
    },
    deleteCourseManagement: async (id: string, params: any) => {
      return service.delete(`${prefix}/${id}`, { ...params });
    },
    deleteSectionManagement: async (
      id: string,
      section: string,
      params: any
    ) => {
      return service.delete(`${prefix}/${id}/${section}`, { ...params });
    },
    ploMapping: async (params: any) => {
      return service.put(`${prefix}/ploMapping`, { ...params });
    },
  };
};
