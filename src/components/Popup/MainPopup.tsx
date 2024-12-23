import { Button, Modal } from "@mantine/core";
import { ReactElement, ReactNode } from "react";
import Icon from "@/components/Icon";
import IconDelete from "@/assets/icons/delete.svg?react";
import IconWarning from "@/assets/icons/infoTri.svg?react";
import { useAppSelector } from "@/store";

type popupType = "delete" | "warning" | "unsaved";

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
      case "unsaved":
        return "text-[#1f69f3]";
    }
  };
  const loading = useAppSelector((state) => state.loading.loadingOverlay);
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
            <Icon
              IconComponent={IconDelete}
              className=" size-6 mr-2 acerSwift:max-macair133:!text-b1"
            />
          ) : type == "warning" ? (
            <Icon IconComponent={IconWarning} className=" size-6 mr-2" />
          ) : (
            <></>
          )}
          {title}
        </div>
      }
      size="auto"
      centered
      transitionProps={{ transition: "pop" }}
      classNames={{
        title: `${titleClassName()}  acerSwift:max-macair133:!text-b1`,

        content:
          "flex flex-col justify-start font-medium leading-[24px] text-b2 acerSwift:max-macair133:!text-b3 item-center  overflow-hidden max-w-[42vw] min-w-[32vw] w-fit",
      }}
    >
      <div className="flex flex-col">
        {message}
        <div className="flex gap-2 mt-5 justify-end">
          {type === "delete" ? (
            <>
              <Button
                variant="subtle"
                className="!text-b3 acerSwift:max-macair133:!text-b5"
                onClick={onClose}
                loading={loading}
              >
                Cancel
              </Button>
              <Button
                color="red"
                className="!text-b3 acerSwift:max-macair133:!text-b5"
                onClick={action}
                loading={loading}
              >
                {labelButtonRight}
              </Button>
            </>
          ) : type == "unsaved" ? (
            <>
              <Button
                variant="subtle"
                className="!text-b3 acerSwift:max-macair133:!text-b5"
                onClick={
                  labelButtonLeft === "Leave without saving" ? action : onClose
                }
              >
                {labelButtonLeft ? labelButtonLeft : "Cancel"}
              </Button>
              <Button
                color="#1f69f3"
                className="!text-b3 acerSwift:max-macair133:!text-b5"
                onClick={labelButtonRight === "Keep editing" ? onClose : action}
              >
                {labelButtonRight}
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="subtle"
                className="!text-b3 acerSwift:max-macair133:!text-b5"
                onClick={
                  labelButtonLeft === "Leave without saving" ? action : onClose
                }
              >
                {labelButtonLeft ? labelButtonLeft : "Cancel"}
              </Button>
              <Button
                color="#F58722"
                className="!text-b3 acerSwift:max-macair133:!text-b5"
                onClick={labelButtonRight === "Keep editing" ? onClose : action}
              >
                {labelButtonRight}
              </Button>
            </>
          )}
        </div>
      </div>
    </Modal>
  );
}
