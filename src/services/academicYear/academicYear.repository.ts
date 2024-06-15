import { IModelAcademicYear } from "@/models/ModelAcademicYear";
import apiService from "@/services/apiService";
import { AcademicYearRequestDTO } from "./dto/academicYear.dto";

export const academicYearController = (configService = {}) => {
  const service = apiService(configService);

  return {
    getAcademicYear: async (params?: AcademicYearRequestDTO) => {
      return service.get(`/academicYear`, { ...params });
    },
    createAcademicYear: async (params: Partial<IModelAcademicYear>) => {
      return service.put(`/academicYear`, { ...params });
    },
    activeAcademicYear: async (id: string) => {
      return service.put(`/academicYear/${id}`, {});
    },
    deleteAcademicYear: async (id: string) => {
      return service.delete(`/academicYear/${id}`, {});
    },
  };
};
