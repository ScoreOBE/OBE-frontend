import { TQF_STATUS } from "../constants/enum";

export function getEnumByKey(Enum: any, key: string): string {
  return Enum[key as keyof typeof Enum] ?? "";
}

export function getEnumByValue(Enum: any, value: string): string {
  return Object.keys(Enum)[Object.values(Enum).indexOf(value)] ?? "";
}

export const statusColor = (
  status: TQF_STATUS | undefined,
  bg: boolean = false
): string => {
  
  const done = "tqf-done";
  const inProgress = "tqf-in-progress";
  const noData = "tqf-no-data";
  let className = "";
  switch (status) {
    case TQF_STATUS.DONE:
      className = done;
      break;
    case TQF_STATUS.IN_PROGRESS:
      className = inProgress;
      break;
    default:
      className = noData;
      break;
  }
  if (bg) {
    className += ` ${className}-with-bg`;
  }
  return className;
};
