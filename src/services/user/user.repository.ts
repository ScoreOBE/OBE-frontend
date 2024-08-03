import { IModelUser } from "@/models/ModelUser";
import apiService from "@/services/apiService";

export const userController = (configService = {}) => {
  const service = apiService(configService);
  const prefix = "/user";

  return {
    getUserInfo: async () => {
      return service.get(`${prefix}`);
    },
    getInstructor: async () => {
      return service.get(`${prefix}/instructor`);
    },
    updateUser: async (params: Partial<IModelUser>) => {
      return service.put(`${prefix}`, { ...params });
    },
    updateAdmin: async (params: Partial<IModelUser>) => {
      return service.put(`${prefix}/admin`, { ...params });
    },
    updateSAdmin: async (params: Partial<IModelUser>) => {
      return service.put(`${prefix}/s.admin`, { ...params });
    },
  };
};
