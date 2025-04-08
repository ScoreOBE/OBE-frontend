import apiService from "@/services/apiService";
import {
  AcademicYearRequestDTO,
  CreateAcademicYearRequestDTO,
} from "./dto/academicYear.dto";

export const academicYearController = (configService = {}) => {
  const service = apiService(configService);
  const prefix = "/academic-year";

  return {
    getAcademicYear: async (params?: AcademicYearRequestDTO) => {
      return apiService({ noAuth: true }).get(`${prefix}`, { ...params });
    },
    createAcademicYear: async (params: CreateAcademicYearRequestDTO) => {
      return service.post(`${prefix}`, { ...params });
    },
    activeAcademicYear: async (id: string) => {
      return service.put(`${prefix}/${id}`, {});
    },
    // updateProcessTqf3: async (id: string, params: any) => {
    //   return service.put(`${prefix}/${id}/tqf`, { ...params });
    // },
    deleteAcademicYear: async (id: string) => {
      return service.delete(`${prefix}/${id}`, {});
    },
  };
};
