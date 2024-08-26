import { isValidResponse } from "@/helpers/functions/validation";
import { sectionController } from "./section.repository";
import { IModelSection } from "@/models/ModelSection";

const sectionService = sectionController();

export const updateSection = async (
  id: string,
  params: Partial<IModelSection>
) => {
  const res = await sectionService.updateSection(id, params);
  return isValidResponse(res);
};
export const updateSectionActive = async (
  id: string,
  params: Partial<IModelSection>
) => {
  const res = await sectionService.updateSectionActive(id, params);
  return isValidResponse(res);
};
export const deleteSection = async (id: string, params: any) => {
  const res = await sectionService.deleteSection(id, params);
  return isValidResponse(res);
};
