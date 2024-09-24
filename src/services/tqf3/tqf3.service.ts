import { isValidResponse } from "@/helpers/functions/validation";
import { tqf3Controller } from "./tqf3.repository";

export const saveTQF3 = async (part: string, params: any) => {
  const tqf3Service = tqf3Controller();
  const res = await tqf3Service.saveTQF3(part, params);
  return isValidResponse(res);
};

export const genPdfTQF3 = async (params: any) => {
  const tqf3Service = tqf3Controller({ responseType: "blob" });
  const res = await tqf3Service.genPdfTQF3(params);
  return isValidResponse(res);
};
