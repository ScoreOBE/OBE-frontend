import apiService from "@/services/apiService";

export const facultyController = (configService = {}) => {
  const service = apiService(configService);

  return {
    getDepartment: async (facultyCode: string) => {
      return service.get(`/faculty`, { facultyCode });
    },
  };
};
