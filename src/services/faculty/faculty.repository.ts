import apiService from "@/services/apiService";

export const facultyController = (configService = {}) => {
  const service = apiService(configService);
  const prefix = "/faculty";

  return {
    getDepartment: async (facultyCode: string) => {
      return service.get(`${prefix}`, { facultyCode });
    },
  };
};
