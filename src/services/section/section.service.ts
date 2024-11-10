import { isValidResponse } from "@/helpers/functions/validation";
import { sectionController } from "./section.repository";
import { IModelSection } from "@/models/ModelCourse";

const sectionService = sectionController();

export const updateSection = async (
  id: string,
  params: Partial<IModelSection>
) => {
  const res = await sectionService.updateSection(id, params);
  return isValidResponse(res);
};
export const updateSectionActive = async (params: any) => {
  const res = await sectionService.updateSectionActive(params);
  return isValidResponse(res);
};
export const deleteSection = async (id: string, params: any) => {
  const res = await sectionService.deleteSection(id, params);
  return isValidResponse(res);
};
export const uploadStudentList = async (params: any) => {
  const res = await sectionService.uploadStudentList(params);
  return isValidResponse(res);
};
