import { isValidResponse } from "@/helpers/functions/validation";
import { ploController } from "./plo.repository";

const ploService = ploController();

export const getPLOs = async (params: any) => {
  const res = await ploService.getPLOs(params);
  return isValidResponse(res);
};
export const getOnePLO = async (name: string) => {
  const res = await ploService.getOnePLO(name);
  return isValidResponse(res);
};
export const checkCanCreatePLO = async (name: string) => {
  const res = await ploService.checkCanCreatePLO(name);
  return isValidResponse(res);
};
export const createPLO = async (params: any) => {
  const res = await ploService.createPLO(params);
  return isValidResponse(res);
};
export const updatePLO = async (id: string, params: any) => {
  const res = await ploService.updatePLO(id, params);
  return isValidResponse(res);
};
export const createPLONo = async (id: string, params: any) => {
  const res = await ploService.createPLONo(id, params);
  return isValidResponse(res);
};
export const deletePLO = async (id: string) => {
  const res = await ploService.deletePLO(id);
  return isValidResponse(res);
};
export const deletePLONo = async (id: string, params: any) => {
  const res = await ploService.deletePLONo(id, params);
  return isValidResponse(res);
};
