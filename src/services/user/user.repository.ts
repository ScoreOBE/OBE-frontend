import { IModelUser } from "@/models/ModelUser";
import apiService from "@/services/apiService";
import { getInstructor } from "./user.service";

export const userController = (configService = {}) => {
  const service = apiService(configService);

  return {
    getUserInfo: async () => {
      return service.get(`/user`);
    },
    getInstructor: async () => {
      return service.get(`/user/instructor`)
    },
    updateUser: async (params: Partial<IModelUser>) => {
      return service.put(`/user`, { ...params });
    },

  };
};
