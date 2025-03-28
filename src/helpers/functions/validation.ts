import {
  RESPONSE_MESSAGE,
  STATUS_CODE,
} from "@/helpers/constants/response.enum";
import { showNotifications } from "@/helpers/notifications/showNotifications";
import { NOTI_TYPE } from "../constants/enum";
import store from "@/store";
import { setErrorResponse } from "@/store/errorResponse";
import { isNumber } from "lodash";
import { ROUTE_PATH } from "../constants/route";
import { jwtDecode } from "jwt-decode";

export const checkTokenExpired = async (token: string) => {
  try {
    const decode: any = await jwtDecode(token);
    // check expired
    if (!decode.exp || decode.exp * 1000 <= new Date().getTime()) {
      return true;
    }
    return false;
  } catch (err) {
    // token invalid
    return true;
  }
};

export const isValidResponse = async (res: any) => {
  if (
    res.headers &&
    ["application/pdf", "application/zip"].includes(res.headers["content-type"])
  )
    return res;
  if (res.message === RESPONSE_MESSAGE.SUCCESS) {
    return res.data;
  } else {
    // const path = window.location.pathname;
    const dispatch = store.dispatch;
    switch (res.statusCode) {
      case STATUS_CODE.NOT_FOUND:
        // dispatch(setErrorResponse(res));
        break;
      case STATUS_CODE.FORBIDDEN:
      case STATUS_CODE.UNAUTHORIZED:
        const isExpired = await checkTokenExpired(
          localStorage.getItem("token") || ""
        );
        if (localStorage.getItem("token") && isExpired) {
          localStorage.removeItem("token");
          window.location.assign(ROUTE_PATH.LOGIN);
          return;
        }
        dispatch(setErrorResponse(res));
        break;
      default:
        // dispatch(setErrorResponse(res));
        showNotifications(
          NOTI_TYPE.ERROR,
          res.title ?? "Something Went Wrong",
          res.message ?? "An unexpected error occurred. Please try again later."
        );
        break;
    }
    return;
  }
};

export const validateCourseNo = (
  value: string | null | undefined,
  courseCode?: { [key: string]: number }
) => {
  if (!value) return "Course No. is required";
  if (!value.replace(/^[0]+$/, "").length) return "Cannot have only 0";
  const isValid = /^\d{6}$/.test(value.toString());
  if (courseCode && isValid) {
    const isValidCourse = Object.values(courseCode).some(
      (code) => value.slice(0, 3) === code.toString()
    );
    return isValidCourse
      ? null
      : `Course No. must start with one of the following: ${Object.values(
          courseCode
        ).join(", ")}`;
  }
  return isValid ? null : "Require number 6 digits";
};

export const validateTextInput = (
  value: string | null | undefined,
  title: string,
  maxLength = 70,
  checkCha = true
) => {
  if (!value) return `${title} is required`;
  if (!value.trim().length) return "Cannot have only spaces";
  if (maxLength != 0 && value.length > maxLength)
    return `You have ${value.length - maxLength} characters too many`;
  if (checkCha) {
    const isValid = /^[0-9A-Za-z "%&()*+,-./<=>?@[\]\\^_]+$/.test(value);
    return isValid
      ? null
      : `only contain 0-9, a-z, A-Z, space, "%&()*+,-./<=>?@[]\\^_`;
  }
};

export const validateSectionNo = (
  value: number | string | null | undefined
) => {
  if (value == undefined) return "Section No. is required";
  const isValid =
    (isNumber(value) || parseInt(value)) && value.toString().length <= 3;
  return isValid ? null : "Please enter a valid section no";
};

export const validateEmail = (email: string) => {
  return /^\S+@cmu\.ac\.th$/i.test(email);
};

export const validateEngLanguage = (value: string) => {
  return /[A-Za-z ]/.test(value);
};

export const validateThaiLanguage = (value: string) => {
  return /[\u0E00-\u0E7F]/.test(value);
};

export const validateStudentId = (
  value: number | string | null | undefined
) => {
  if (value == undefined) return "Student Id. is required";
  const isValid =
    (isNumber(value) || parseInt(value)) && value.toString().length == 9;
  return isValid ? null : "Please enter a valid student id";
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
