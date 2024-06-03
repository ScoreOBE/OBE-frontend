import apiService from "@/services/apiService";

export const userController = (configService = {}) => {
  const service = apiService(configService);

  return {
    getUserInfo: async () => {
      return service.get(`/user`);
    },
  };
};
