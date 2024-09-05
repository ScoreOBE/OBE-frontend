import { IModelTQF3 } from "@/models/ModelTQF3";
import apiService from "@/services/apiService";

export const tqf3Controller = (configService = {}) => {
  const service = apiService(configService);
  const prefix = "/tqf3";

  return {
    saveTQF3: async (part: string, params: any) => {
      return service.put(`${prefix}/${params.id}/${part}`, { ...params });
    },
  };
};
