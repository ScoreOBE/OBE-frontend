import apiService from "@/services/apiService";

export const scoreController = (configService = {}) => {
  const service = apiService(configService);
  const prefix = "/score";

  return {
    uploadScore: async (params: any) => {
      return service.post(`${prefix}`, { ...params });
    },
    updateAssignmentName: async (params: any) => {
      return service.put(`${prefix}`, { ...params });
    },
    deleteAssignment: async (params: any) => {
      return service.delete(`${prefix}`, { ...params });
    },
    publishScore: async (params: any) => {
      return service.put(`${prefix}/publish`, { ...params });
    },
    updateStudentScore: async (params: any) => {
      return service.put(`${prefix}/student`, { ...params });
    },
  };
};
