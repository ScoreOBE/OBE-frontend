import { Button, Input, Modal, TextInput } from "@mantine/core";
import { IconUserCircle, IconTrash } from "@tabler/icons-react";
import { ReactElement, useEffect, useState } from "react";
import { TbSearch } from "react-icons/tb";
import { AiOutlineSwap } from "react-icons/ai";
import Icon from "../Icon";
import InfoIcon from "@/assets/icons/info.svg?react";
import { IModelUser } from "@/models/ModelUser";
import { getInstructor, updateSAdmin } from "@/services/user/user.service";
import { useAppDispatch, useAppSelector } from "@/store";
import { POPUP_TYPE, ROLE } from "@/helpers/constants/enum";
import { setUser } from "@/store/user";
import { showNotifications } from "@/helpers/functions/function";

type Props = {
  opened: boolean;
  onClose: () => void;
  action: () => void;
  type: POPUP_TYPE;
  title: string;
  message: ReactElement;
};

export default function MainPopup({
  opened,
  onClose,
  action,
  title,
  message,
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
      title={title}
      size="35.5vw"
      centered
      withCloseButton={false}
      transitionProps={{ transition: "pop" }}
      classNames={{
        title: `${titleClassName()}`,
        content:
          "flex flex-col  justify-start bg-[#F6F7FA] text-[14px] item-center px-2 pb-2 overflow-hidden ",
      }}
    >
      <div className="flex flex-col">
        {message}
        <div className="flex gap-2 mt-5 justify-end">
          {type === POPUP_TYPE.DELETE ? (
            <>
              <Button radius="10px" onClick={onClose} variant="subtle" color="#575757">
                Cancel
              </Button>{" "}
              <Button radius="10px" onClick={action} color="#FF4747">
                Delete
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
