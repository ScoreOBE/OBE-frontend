import apiService from "@/services/apiService";

export const ploController = (configService = {}) => {
  const service = apiService(configService);
  const prefix = "/plo";

  return {
    getPLOs: async (params: any) => {
      return service.get(`${prefix}`, { ...params });
    },
    checkCanCreatePLO: async (name: string) => {
      return service.get(`${prefix}/check`, { name });
    },
    createPLO: async (params: any) => {
      return service.post(`${prefix}`, { ...params });
    },
    updatePLO: async (id: string, params: any) => {
      return service.put(`${prefix}/${id}`, { ...params });
    },
    createPLONo: async (id: string, params: any) => {
      return service.put(`${prefix}/${id}/no`, { ...params });
    },
    deletePLO: async (id: string) => {
      return service.delete(`${prefix}/${id}`, {});
    },
    deletePLONo: async (id: string, params: any) => {
      return service.delete(`${prefix}/${id}/no`, { ...params });
    },
  };
};
