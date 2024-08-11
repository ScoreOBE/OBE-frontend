import { Button, Modal } from "@mantine/core";
import { ReactElement, ReactNode } from "react";
import Icon from "@/components/Icon";
import DeleteIcon from "@/assets/icons/delete.svg?react";

type Props = {
  opened: boolean;
  onClose: () => void;
  action?: () => void;
  title: ReactNode;
};

export default function MainPopup({ opened, onClose, action, title }: Props) {
  return (
    <Modal
      opened={opened}
      onClose={onClose}
      closeOnClickOutside={true}
      title={<div className="flex items-center">{title}</div>}
      size="39vw"
      centered
      withCloseButton={false}
      transitionProps={{ transition: "pop" }}
      classNames={{
        title:
          " ",
        content:
          "flex flex-col justify-start   font-medium leading-[24px] text-[14px] item-center  overflow-hidden ",
      }}
    >
      <div className="flex flex-col">
        <div className="flex gap-2 mt-5 justify-end">
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
            <Button
              radius="10px"
              onClick={action}
              className="text-[14px]"
              color="#5768d5"
            >
              Done
            </Button>
          </>
        </div>
      </div>
    </Modal>
  );
}
