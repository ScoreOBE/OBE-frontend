import { Button, Input, Modal, TextInput } from "@mantine/core";
import { IconUserCircle, IconTrash } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { TbSearch } from "react-icons/tb";
import { AiOutlineSwap } from "react-icons/ai";
import { IoIosInformationCircleOutline } from "react-icons/io";
import Icon from "../Icon";
import InfoIcon from "@/assets/icons/info.svg?react";
import { IModelUser } from "@/models/ModelUser";
import { getInstructor, updateSAdmin } from "@/services/user/user.service";
import { useAppDispatch, useAppSelector } from "@/store";
import { ROLE } from "@/helpers/constants/enum";
import { setUser } from "@/store/user";
import { showNotifications } from "@/helpers/functions/function";

type Props = {
  opened: boolean;
  onClose: () => void;
};

export default function ModalChangeSupremeAdmin({ opened, onClose }: Props) {
  const user = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();
  const [searchValue, setSearchValue] = useState("");
  const [adminList, setAdminList] = useState<any[]>([]);
  const [adminFilter, setAdminFilter] = useState<IModelUser[]>([]);

  useEffect(() => {
    if (opened) {
      setSearchValue("");
      fetchIns();
    }
  }, [opened]);

  useEffect(() => {
    setAdminFilter(
      adminList.filter(
        (admin) =>
          `${admin.firstNameEN.toLowerCase()} ${admin.lastNameEN.toLowerCase()}`.includes(
            searchValue.toLowerCase()
          ) || admin.email.toLowerCase().includes(searchValue.toLowerCase())
      )
    );
  }, [searchValue]);

  const fetchIns = async () => {
    const res = await getInstructor();
    const list = res.filter((e: IModelUser) => {
      if (e.id !== user.id && e.role === ROLE.ADMIN) {
        return {
          id: e.id,
          firstNameEN: e.firstNameEN,
          lastNameEN: e.lastNameEN,
          email: e.email,
        };
      }
    });
    setAdminList(list);
    setAdminFilter(list);
  };

  const editSAdmin = async (id: string) => {
    const res = await updateSAdmin({ id });
    if (res) {
      const name = res.newSAdmin.firstNameEN?.length
        ? `${res.newSAdmin.firstNameEN} ${res.newSAdmin.lastNameEN}`
        : res.newSAdmin.email;
      dispatch(setUser(res.user));
      showNotifications("success", "Success", `${name} is an supreme admin`);
      onClose();
    }
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      closeOnClickOutside={true}
      title="Managemet Supreme Admin"
      size="43vw"
      centered
      transitionProps={{ transition: "pop" }}
      classNames={{
        content:
          "flex flex-col    justify-start bg-[#F6F7FA] text-[14px] item-center px-2 pb-2 overflow-hidden ",
      }}
    >
      <div className="bg-[#C7EBFF] items-center gap-4 flex rounded-md py-3 px-5 mb-5 ">
        <Icon IconComponent={InfoIcon} />
        <p className="text-[#0067A0] font-semibold">
          Changing the Supreme Admin{" "}
          <span className=" font-extrabold"> will revoke </span> your current
          supreme admin status.
        </p>
      </div>
      <div
        className=" max-h-[500px]  flex flex-col bg-white border-secondary border-[1px]  rounded-md"
        style={{
          boxShadow: "0px 0px 4px 0px rgba(0, 0, 0, 0.25)",
        }}
      >
        {/* Show List Of Admin */}
        <div className="flex  flex-col gap-2  flex-1  p-4  overflow-y-hidden">
          <TextInput
            leftSection={<TbSearch />}
            placeholder="Name / CMU account"
            value={searchValue}
            size="xs"
            onChange={(event: any) => setSearchValue(event.currentTarget.value)}
            rightSectionPointerEvents="all"
          />

          {/* List of Admin */}
          <div className="flex flex-1 flex-col gap-2  overflow-y-auto p-1">
            {adminFilter.map((admin) => (
              <div
                key={admin.id}
                style={{
                  boxShadow: "0px 0px 4px 0px rgba(0, 0, 0, 0.25)",
                }}
                className="flex flex-1 items-center justify-between mt-2 py-3 px-4 rounded-md"
              >
                <div className="gap-3 flex items-center">
                  <IconUserCircle size={32} stroke={1} />
                  <div className="flex flex-col">
                    <p className="font-semibold text-[14px] text-tertiary">
                      {admin.firstNameEN} {admin.lastNameEN}
                    </p>
                    <p className="text-secondary text-[12px] font-normal">
                      {admin.email}
                    </p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  color="#5768D5"
                  size="xs"
                  className=" rounded-lg gap"
                  onClick={() => editSAdmin(admin.id)}
                  leftSection={
                    <AiOutlineSwap className=" stroke-[20px] size-4" />
                  }
                >
                  Change
                </Button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Modal>
  );
}
