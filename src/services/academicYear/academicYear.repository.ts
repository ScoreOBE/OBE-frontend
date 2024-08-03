import { IModelAcademicYear } from "@/models/ModelAcademicYear";
import apiService from "@/services/apiService";
import { AcademicYearRequestDTO } from "./dto/academicYear.dto";

export const academicYearController = (configService = {}) => {
  const service = apiService(configService);
  const prefix = "/academicYear";

  return {
    getAcademicYear: async (params?: AcademicYearRequestDTO) => {
      return service.get(`${prefix}`, { ...params });
    },
    createAcademicYear: async (params: Partial<IModelAcademicYear>) => {
      return service.put(`${prefix}`, { ...params });
    },
    activeAcademicYear: async (id: string) => {
      return service.put(`${prefix}/${id}`, {});
    },
    deleteAcademicYear: async (id: string) => {
      return service.delete(`${prefix}/${id}`, {});
    },
  };
};
