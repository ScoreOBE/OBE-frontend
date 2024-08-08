import {
  RESPONSE_MESSAGE,
  STATUS_CODE,
} from "@/helpers/constants/response.enum";
import { ROUTE_PATH } from "../constants/route";
import { showNotifications } from "./function";
import { NOTI_TYPE } from "../constants/enum";
import store from "@/store";
import { setErrorResponse } from "@/store/errorResponse";

export const isValidResponse = (res: any) => {
  if (res.message === RESPONSE_MESSAGE.SUCCESS) {
    return res.data;
  } else {
    const dispatch = store.dispatch;
    switch (res.statusCode) {
      case STATUS_CODE.NOT_FOUND:
        dispatch(setErrorResponse(res));
        break;
      case STATUS_CODE.UNAUTHORIZED:
        localStorage.clear();
        window.location.replace(ROUTE_PATH.LOGIN);
        break;
      default:
        dispatch(setErrorResponse(res));
        showNotifications(NOTI_TYPE.ERROR, "Something went wrong", res.message);
        break;
    }
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
