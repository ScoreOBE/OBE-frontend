import { isValidResponse } from "@/helpers/functions/validation";
import { tqf5Controller } from "./tqf5.repository";

export const saveTQF5 = async (part: string, params: any) => {
  const tqf5Service = tqf5Controller();
  const res = await tqf5Service.saveTQF5(part, params);
  return isValidResponse(res);
};

export const genPdfTQF5 = async (params: any) => {
  const tqf5Service = tqf5Controller({ responseType: "blob" });
  const res = await tqf5Service.genPdfTQF5(params);
  return isValidResponse(res);
};
