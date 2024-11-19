import { IModelSection } from "@/models/ModelCourse";
import apiService from "@/services/apiService";

export const sectionController = (configService = {}) => {
  const service = apiService(configService);
  const prefix = "/section";

  return {
    updateSection: async (id: string, params: Partial<IModelSection>) => {
      return service.put(`${prefix}/${id}`, { ...params });
    },
    updateSectionActive: async (params: any) => {
      return service.put(`${prefix}/active`, { ...params });
    },
    deleteSection: async (id: string, params: any) => {
      return service.delete(`${prefix}/${id}`, { ...params });
    },
    uploadStudentList: async (params: any) => {
      return service.post(`${prefix}/student-list`, { ...params });
    },
    addStudent: async (params: any) => {
      return service.post(`${prefix}/student`, { ...params });
    },
    deleteStudent: async (params: any) => {
      return service.delete(`${prefix}/student`, { ...params });
    },
    updateStudent: async (params: any) => {
      return service.post(`${prefix}/student`, { ...params });
    },
  };
};
