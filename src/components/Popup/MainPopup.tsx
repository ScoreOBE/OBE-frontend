import { Button, Modal } from "@mantine/core";
import { ReactElement, ReactNode } from "react";
import { POPUP_TYPE } from "@/helpers/constants/enum";
import Icon from "@/components/Icon";
import DeleteIcon from "@/assets/icons/delete.svg?react";

type Props = {
  opened: boolean;
  onClose: () => void;
  action: () => void;
  type: POPUP_TYPE;
  title: ReactNode;
  message: ReactNode;
  labelButtonRight?: string;
  icon?: ReactElement;
};

export default function MainPopup({
  opened,
  onClose,
  action,
  title,
  message,
  labelButtonRight,
  icon,
  type,
}: Props) {
  const titleClassName = () => {
    switch (type) {
      case POPUP_TYPE.DELETE:
        return "text-[#FF4747]";
      case POPUP_TYPE.WARNING:
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
          ) : type == POPUP_TYPE.DELETE ? (
            <Icon IconComponent={DeleteIcon} className=" size-6 mr-2" />
          ) : (
            <></>
          )}
          {title}
        </div>
      }
      size="39.4vw"
      centered
      withCloseButton={false}
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
          {type === POPUP_TYPE.DELETE ? (
            <>
              <Button
                radius="10px"
                onClick={onClose}
                variant="subtle"
                color="#575757"
               className="text-[14px]"
              >
                Cancel
              </Button>{" "}
              <Button radius="10px" onClick={action}  className="text-[14px]" color="#FF4747">
                {labelButtonRight}
              </Button>
            </>
          ) : type == POPUP_TYPE.WARNING ? (
            <></>
          ) : (
            <></>
          )}{" "}
        </div>
      </div>
    </Modal>
  );
}
