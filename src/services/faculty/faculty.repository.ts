import { IModelCurriculum } from "@/models/ModelFaculty";
import apiService from "@/services/apiService";

export const facultyController = (configService = {}) => {
  const service = apiService(configService);
  const prefix = "/faculty";

  return {
    getFaculty: async (facultyCode: string) => {
      return service.get(`${prefix}`, { facultyCode });
    },
    createCurriculum: async (id: string, params: IModelCurriculum) => {
      return service.post(`${prefix}/${id}`, { ...params });
    },
    updateCurriculum: async (
      id: string,
      code: string,
      params: IModelCurriculum
    ) => {
      return service.put(`${prefix}/${id}/${code}`, { ...params });
    },
    deleteCurriculum: async (id: string, code: string) => {
      return service.delete(`${prefix}/${id}/${code}`, {});
    },
  };
};
