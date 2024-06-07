import { IModelAcademicYear } from "@/models/ModelAcademicYear";
import apiService from "@/services/apiService";

export const academicYearController = (configService = {}) => {
  const service = apiService(configService);

  return {
    getAcademicYear: async () => {
      return service.get(`/academicYears`);
    },
    createAcademicYear: async (params: Partial<IModelAcademicYear>) => {
      return service.put(`/academicYears`, { ...params });
    },
    activeAcademicYear: async (id: string) => {
      return service.put(`/academicYears/${id}`, {});
    },
    deleteAcademicYear: async (id: string) => {
      return service.delete(`/academicYears/${id}`, {});
    },
  };
};
