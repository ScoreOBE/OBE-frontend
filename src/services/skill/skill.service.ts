import { skillController } from "./skill.repository";
import { SkillRequestDTO } from "./dto/skill.dto";

const skillService = skillController();

export const getSkills = async (params: SkillRequestDTO) => {
  const res = await skillService.getSkills(params);
  return res;
};
export const getTags = async () => {
  const res = await skillService.getTags();
  return res;
};
export const getTagGroups = async () => {
  const res = await skillService.getTagGroups();
  return res;
};
