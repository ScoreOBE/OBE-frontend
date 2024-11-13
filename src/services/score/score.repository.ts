import apiService from "@/services/apiService";

export const scoreController = (configService = {}) => {
  const service = apiService(configService);
  const prefix = "/score";

  return {
    uploadScore: async (params: any) => {
      return service.post(`${prefix}`, { ...params });
    },
  };
};
