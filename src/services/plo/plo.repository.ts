import { IModelPLONo } from "@/models/ModelPLO";
import apiService from "@/services/apiService";

export const ploController = (configService = {}) => {
  const service = apiService(configService);
  const prefix = "/plo";

  return {
    getPLOs: async (params: any) => {
      return service.get(`${prefix}`, { ...params });
    },
    updatePLO: async (id: string, params: any) => {
      return service.put(`${prefix}/${id}`, { ...params });
    },
  };
};
