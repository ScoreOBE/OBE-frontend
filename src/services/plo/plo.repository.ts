import apiService from "@/services/apiService";

export const ploController = (configService = {}) => {
  const service = apiService(configService);
  const prefix = "/plo";

  return {
    getPLOs: async (params: any) => {
      return service.get(`${prefix}`, { ...params });
    },
  };
};
