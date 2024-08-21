import { isValidResponse } from "@/helpers/functions/validation";
import { ploController } from "./plo.repository";
import { IModelPLONo } from "@/models/ModelPLO";

const ploService = ploController();

export const getPLOs = async (params: any) => {
  const res = await ploService.getPLOs(params);
  return isValidResponse(res);
};

export const updatePLO = async (id: string, params: any) => {
  const res = await ploService.updatePLO(id, params);
  return isValidResponse(res);
};
