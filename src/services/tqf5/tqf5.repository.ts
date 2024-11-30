import apiService from "@/services/apiService";

export const tqf5Controller = (configService = {}) => {
  const service = apiService(configService);
  const prefix = "/tqf5";

  return {
    changeMethodTQF5: async (id: string, params: any) => {
      return service.post(`${prefix}/${id}/change-method`, { ...params });
    },
    saveTQF5: async (part: string, params: any) => {
      return service.put(`${prefix}/${params.id}/${part}`, { ...params });
    },
    genPdfTQF5: async (params: any) => {
      return service.get(`${prefix}/pdf`, { ...params });
    },
  };
};
