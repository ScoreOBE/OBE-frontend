import apiService from "@/services/apiService";
import {
  CourseManagementRequestDTO,
  CourseManagementSearchDTO,
} from "./dto/courseManagement.dto";

export const courseManagementController = (configService = {}) => {
  const service = apiService(configService);
  const prefix = "/course-management";

  return {
    getCourseManagement: async (params?: CourseManagementSearchDTO) => {
      return service.get(`${prefix}`, { ...params });
    },
    getOneCourseManagement: async (params: any) => {
      return service.get(`${prefix}/one`, { ...params });
    },
    createCourseManagement: async (params: CourseManagementRequestDTO) => {
      return service.post(`${prefix}`, { ...params });
    },
    checkCanCreateSectionManagement: async (params: any) => {
      return service.get(`${prefix}/check`, { ...params });
    },
    // createSectionManagement: async (id: string, params: any) => {
    //   return service.post(`${prefix}/section/${id}`, { ...params });
    // },
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
      return service.put(`${prefix}/co-instructor`, { ...params });
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
      return service.put(`${prefix}/plo-mapping`, { ...params });
    },
  };
};
