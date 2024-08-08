import { RESPONSE_MESSAGE } from "@/helpers/constants/response.enum";
import { ROUTE_PATH } from "../constants/route";
import { showNotifications } from "./function";
import { NOTI_TYPE } from "../constants/enum";

export const isValidResponse = (res: any) => {
  if (res.message === RESPONSE_MESSAGE.SUCCESS) {
    return res.data;
  } else {
    if (res == RESPONSE_MESSAGE.UNAUTHORIZED) {
      localStorage.clear();
      window.location.replace(ROUTE_PATH.LOGIN);
    }
    showNotifications(NOTI_TYPE.ERROR, "Something went wrong", res);
    return;
  }
};

export const containsOnlyNumbers = (
  textString: any,
  min?: number,
  max?: number
): boolean => {
  if (typeof textString !== "string") {
    throw new Error("Input must be a string.");
  }

  const numericRegex = /^[0-9]+$/;
  if (!numericRegex.test(textString)) {
    return false;
  }

  const numberValue = parseInt(textString, 10);
  if (min !== undefined && numberValue < min) {
    return false;
  }
  if (max !== undefined && numberValue > max) {
    return false;
  }

  return true;
};

export const ellipsisText = (text: string, limit: number = 10) => {
  if (typeof text !== "string") {
    return "";
  }
  return text.length <= limit ? text : text.substring(0, limit).concat("...");
};

export const validateEmail = (email: string) => {
  return /^\S+@cmu\.ac\.th$/i.test(email);
};
