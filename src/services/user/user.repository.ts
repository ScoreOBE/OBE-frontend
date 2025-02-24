import { ROUTE_PATH } from "@/helpers/constants/route";
import { IModelUser } from "@/models/ModelUser";
import apiService from "@/services/apiService";
import store from "@/store";
import { setUser } from "@/store/user";

export const userController = (configService = {}) => {
  const service = apiService(configService);
  const prefix = "/user";

  return {
    getUserInfo: async () => {
      return service.get(`${prefix}`);
    },
    termsOfService: async (params: { agree: boolean }) => {
      return service.post(`${prefix}/terms-of-service`, { ...params });
    },
    getInstructor: async () => {
      return service.get(`${prefix}/instructor`);
    },
    updateUser: async (params: Partial<IModelUser>) => {
      return service.put(`${prefix}`, { ...params });
    },
    updateCurrAdmin: async (params: Partial<IModelUser>) => {
      return service.put(`${prefix}/curr-admin`, { ...params });
    },
    updateAdmin: async (params: Partial<IModelUser>) => {
      return service.put(`${prefix}/admin`, { ...params });
    },
    logout: () => {
      window.location.assign(import.meta.env.VITE_LOGOUT_URL!);
      localStorage.removeItem("token");
      store.dispatch(setUser({}));
    },
  };
};
