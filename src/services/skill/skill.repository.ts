import apiService from "@/services/apiService";
import { SkillRequestDTO } from "./dto/skill.dto";

export const skillController = (
  configService = { baseApiPath: import.meta.env.VITE_SKILL_API, noAuth: true }
) => {
  const service = apiService(configService);

  return {
    getSkills: async (params: SkillRequestDTO) => {
      return service.get("/skills/publishes", { ...params });
    },
    getTags: async () => {
      return service.get("/tags");
    },
    getTagGroups: async () => {
      return service.get("/tagGroups");
    },
  };
};
