import Icon from "@/components/Icon";
import IconCheck from "@/assets/icons/Check2.svg?react";
import IconX from "@/assets/icons/x.svg?react";
import { notifications } from "@mantine/notifications";
import { NOTI_TYPE } from "../constants/enum";

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
      icon = <Icon IconComponent={IconCheck} />;
      break;
    case NOTI_TYPE.ERROR:
      // className = "bg-red-500 bg-opacity-75 rounded-md";
      color = "red";
      icon = <Icon IconComponent={IconX} />;
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
