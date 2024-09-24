import apiService from "@/services/apiService";

export const tqf3Controller = (configService = {}) => {
  const service = apiService(configService);
  const prefix = "/tqf3";

  return {
    saveTQF3: async (part: string, params: any) => {
      return service.put(`${prefix}/${params.id}/${part}`, { ...params });
    },
    genPdfTQF3: async (params: any) => {
      return service.get(`${prefix}/pdf`, { ...params });
    },
  };
};
