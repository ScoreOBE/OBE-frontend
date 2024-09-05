import { TQF_STATUS } from "@/helpers/constants/enum";

export interface IModelTQF5 {
  [key: string]: any;
  id: string;
  status: TQF_STATUS;
  part1?: any;
  part2?: any;
  part3?: any;
}
