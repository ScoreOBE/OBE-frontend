import { Button, Modal } from "@mantine/core";
import { ReactElement, ReactNode } from "react";
import Icon from "@/components/Icon";
import DeleteIcon from "@/assets/icons/delete.svg?react";

type popupType = "delete" | "warning";

type Props = {
  opened: boolean;
  onClose: () => void;
  action: () => void;
  type: popupType;
  title: ReactNode;
  message: ReactNode;
  labelButtonRight?: string;
  labelButtonLeft?: string;
  icon?: ReactElement;
};

export default function MainPopup({
  opened,
  onClose,
  action,
  title,
  message,
  labelButtonRight,
  labelButtonLeft,
  icon,
  type,
}: Props) {
  const titleClassName = () => {
    switch (type) {
      case "delete":
        return "text-[#FF4747]";
      case "warning":
        return "text-[#F58722]";
    }
  };
  return (
    <Modal
      opened={opened}
      onClose={onClose}
      closeOnClickOutside={true}
      title={
        <div className="flex items-center">
          {icon ? (
            icon
          ) : type == "delete" ? (
            <Icon IconComponent={DeleteIcon} className=" size-6 mr-2" />
          ) : (
            <></>
          )}
          {title}
        </div>
      }
      size="42vw"
      centered
      transitionProps={{ transition: "pop" }}
      classNames={{
        title: `${titleClassName()}`,
        content:
          "flex flex-col justify-start   font-medium leading-[24px] text-[14px] item-center  overflow-hidden ",
      }}
    >
      <div className="flex flex-col">
        {message}
        <div className="flex gap-2 mt-5 justify-end">
          {type === "delete" ? (
            <>
              <Button
                variant="subtle"
                className="!text-[13px]"
                onClick={onClose}
              >
                Cancel
              </Button>
              <Button color="red" className="!text-[13px]" onClick={action}>
                {labelButtonRight}
              </Button>
            </>
          ) : type == "warning" ? (
            <>
              <Button
                variant="subtle"
                className="!text-[13px]"
                onClick={
                  labelButtonLeft === "Leave without saving" ? action : onClose
                }
              >
                {labelButtonLeft ? labelButtonLeft : "Cancel"}
              </Button>
              <Button
                color="#F58722"
                className="!text-[13px]"
                onClick={labelButtonRight === "Keep editing" ? onClose : action}
              >
                {labelButtonRight}
              </Button>
            </>
          ) : (
            <></>
          )}{" "}
        </div>
      </div>
    </Modal>
  );
}
