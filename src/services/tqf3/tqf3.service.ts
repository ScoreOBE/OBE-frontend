import { isValidResponse } from "@/helpers/functions/validation";
import { tqf3Controller } from "./tqf3.repository";
import { IModelTQF3 } from "@/models/ModelTQF3";

const tqf3Service = tqf3Controller();

export const saveTQF3 = async (part: string, params: any) => {
  const res = await tqf3Service.saveTQF3(part, params);
  return isValidResponse(res);
};
