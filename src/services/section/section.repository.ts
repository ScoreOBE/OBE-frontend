import { IModelSection } from "@/models/ModelSection";
import apiService from "@/services/apiService";

export const sectionController = (configService = {}) => {
  const service = apiService(configService);
  const prefix = "/section";

  return {
    checkCanCreateSection: async (params: Partial<IModelSection>) => {
      return service.get(`${prefix}/check`, { ...params });
    },
    createSection: async (params: Partial<IModelSection>) => {
      return service.post(`${prefix}`, { ...params });
    },
    updateSection: async (id: string, params: Partial<IModelSection>) => {
      return service.put(`${prefix}/${id}`, { ...params });
    },
    deleteSection: async (id: string) => {
      return service.delete(`${prefix}/${id}`, {});
    },
  };
};
