import { notifications } from "@mantine/notifications";
import { NOTI_TYPE } from "../constants/enum";
import { IModelUser } from "@/models/ModelUser";
import { IconX, IconCheck } from "@tabler/icons-react";
import React from "react";
import { isEmpty } from "lodash";
import moment from "moment";

export const getSectionNo = (sectionNo: number | string | undefined) => {
  if (!sectionNo) return "";
  return ("000" + parseInt(sectionNo.toString())).slice(-3);
};
export const getUserName = (
  user: Partial<IModelUser> | undefined,
  format?: number
) => {
  if (!user) return;
  else if (isEmpty(user.firstNameEN) || isEmpty(user.lastNameEN))
    return user.email;
  switch (format) {
    case 1:
      return `${user.firstNameEN} ${user.lastNameEN}`; // John Doe
    case 2:
      return `${user.firstNameEN?.toLowerCase()} ${user.lastNameEN?.toLowerCase()}`; // john doe
    case 3:
      return `${user.firstNameTH} ${user.lastNameTH}`; // กข คง
    default:
      return `${user.firstNameEN} ${user.lastNameEN?.slice(0, 1)}.`; // John D.
  }
};

export const dateFormatter = (
  date: string | Date | undefined,
  format?: number
) => {
  if (!date) return;
  switch (format) {
    case 1:
      return moment(date).format("DD/MM/YYYY"); // 25/09/2024
    case 2:
      return moment(date).format("MMMM DD, YYYY HH:mm"); // September 25, 2024 14:17
    default:
      return moment(date).format("MMM DD, YYYY HH:mm"); // Sep 25, 2024 14:42
  }
};

export const getKeyByValue = (object: any, value: any) => {
  return Object.keys(object).find(
    (key) => object[key] == value
  ) as keyof object;
};

export const getValueEnumByKey = (Enum: any, key: string): string => {
  return Enum[key as keyof typeof Enum] ?? "";
};

export const getKeyEnumByValue = (Enum: any, value: string): string => {
  return Object.keys(Enum)[Object.values(Enum).indexOf(value)] ?? "";
};

export const sortData = (
  data: any[] | undefined,
  key: string,
  typeKey: string = "number",
  typeSort: string = "asc"
) => {
  const isAscending = ["asc", "ASC"].includes(typeSort);
  data?.sort((a, b) => {
    const aValue =
      a[key] ?? (typeKey === "number" ? 0 : typeKey === "boolean" ? false : "");
    const bValue =
      b[key] ?? (typeKey === "number" ? 0 : typeKey === "boolean" ? false : "");
    if (typeKey === "number") {
      return isAscending ? aValue - bValue : bValue - aValue;
    } else if (typeKey === "string") {
      return isAscending
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    } else if (typeKey === "boolean") {
      return isAscending
        ? Number(bValue) - Number(aValue)
        : Number(aValue) - Number(bValue);
    } else return 0;
  });
};

export const showNotifications = (
  type: string,
  title: string,
  message: string
) => {
  let className, color, icon;

  switch (type) {
    case NOTI_TYPE.SUCCESS:
      // className = "bg-green-500 bg-opacity-50 rounded-md";
      color = "green";
      icon = React.createElement(IconCheck);
      break;
    case NOTI_TYPE.ERROR:
      // className = "bg-red-500 bg-opacity-75 rounded-md";
      color = "red";
      icon = React.createElement(IconX);
      break;
    default:
      break;
  }

  notifications.show({
    title,
    message,
    autoClose: 5000,
    withCloseButton: false,
    className,
    color,
    icon, // Pass the icon component here
    classNames: {
      title: "text-[#ffffff] font-bold text-[14px]",
      description: "text-[#ffffff] font-normal text-[12px]",
      root: "bg-[#112961] rounded-lg pl-5 ",
    },
  });
};
