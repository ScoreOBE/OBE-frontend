import { isValidResponse } from "@/helpers/functions/validation";
import { ploController } from "./plo.repository";

const ploService = ploController();

export const getPLOs = async (params: any) => {
  const res = await ploService.getPLOs(params);
  return isValidResponse(res);
};
