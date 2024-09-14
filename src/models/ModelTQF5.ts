import { TQF_STATUS } from "@/helpers/constants/enum";

export interface IModelTQF5 {
  id: string;
  status: TQF_STATUS;
  part1?: any;
  part2?: any;
  part3?: any;
  updatedAt: Date;
}
