import { Button, Modal, TextInput } from "@mantine/core";
import { useEffect, useState } from "react";
import { TbSearch } from "react-icons/tb";
import { IModelUser } from "@/models/ModelUser";
import { useAppSelector } from "@/store";
import { NOTI_TYPE, ROLE } from "@/helpers/constants/enum";
import { getUserName, showNotifications } from "@/helpers/functions/function";
import CompoManageIns from "@/components/CompoManageIns";
import { updateAdmin } from "@/services/user/user.service";
import userCicle from "@/assets/icons/userCircle.svg?react";
import users from "@/assets/icons/users.svg?react";
import Icon from "@/components/Icon";

type Props = {
  opened: boolean;
  onClose: () => void;
};
export default function ModalManageAdmin({ opened, onClose }: Props) {
  const user = useAppSelector((state) => state.user);
  const [searchValue, setSearchValue] = useState("");
  const [adminList, setAdminList] = useState<IModelUser[]>([]);
  const [adminFilter, setAdminFilter] = useState<IModelUser[]>([]);
  const [isNewFetch, setIsNewFetch] = useState(false);

  useEffect(() => {
    if (opened) {
      setSearchValue("");
    }
  }, [opened]);

  useEffect(() => {
    setAdminFilter(
      adminList.filter(
        (admin) =>
          `${getUserName(admin, 2)}`.includes(searchValue.toLowerCase()) ||
          admin.email.toLowerCase().includes(searchValue.toLowerCase())
      )
    );
  }, [searchValue, adminList]);

  const deleteAdmin = async (id: string) => {
    const payload: Partial<IModelUser> = { id, role: ROLE.INSTRUCTOR };
    const res = await updateAdmin(payload);
    if (res) {
      setIsNewFetch(true);
      setAdminList(adminList.filter((admin) => admin.id !== res.id));
      const name = res.firstNameEN?.length ? getUserName(res, 1) : res.email;
      showNotifications(
        NOTI_TYPE.SUCCESS,
        "Delete success",
        `${name} is deleted from admin`
      );
    }
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title="Management Admin"
      size="45vw"
      centered
      transitionProps={{ transition: "pop" }}
      classNames={{
        content:
          "flex flex-col justify-start bg-[#F6F7FA] text-[14px] item-center px-2 pb-2 overflow-hidden max-h-fit ",
      }}
    >
      <div className="flex flex-1 flex-col h-full ">
        <CompoManageIns
          opened={opened}
          type="admin"
          newFetch={isNewFetch}
          setNewFetch={setIsNewFetch}
          setUserList={setAdminList}
          setUserFilter={setAdminFilter}
        />

        {/* Added Admin */}
        <div className="w-full  flex flex-col bg-white border-secondary border-[1px]  rounded-md">
          <div className="bg-[#e7eaff] flex gap-3 items-center rounded-t-md border-b-secondary border-[1px] px-4 py-3 text-secondary font-semibold">
            <Icon IconComponent={users} /> Added Admin
          </div>
          {/* Show List Of Admin */}
          <div className="flex flex-col gap-2 w-full h-[400px]   p-4 py-3  overflow-y-hidden">
            <TextInput
              leftSection={<TbSearch />}
              placeholder="Name / CMU account"
              size="xs"
              value={searchValue}
              onChange={(event: any) =>
                setSearchValue(event.currentTarget.value)
              }
              rightSectionPointerEvents="all"
            />
            {/* List of Admin */}
            <div className="flex flex-col overflow-y-auto p-1">
              {adminFilter.map((admin, index) => (
                <div
                  key={index}
                  className="w-full items-center last:border-none border-b-[1px] justify-between  p-3  flex"
                >
                  <div className="gap-3 flex items-center">
                    <Icon
                      IconComponent={userCicle}
                      className=" size-8 stroke-1 -translate-x-1"
                    />
                    <div className="flex flex-col">
                      <p className="font-semibold text-[14px] text-tertiary">
                        {getUserName(admin, 1)}
                      </p>
                      <p className="text-secondary text-[12px] font-normal">
                        {admin.email}
                      </p>
                    </div>
                  </div>
                  {admin.firstNameEN === user.firstNameEN &&
                  admin.lastNameEN === user.lastNameEN ? (
                    <p className="mr-1 text-secondary text-[14px] font-normal">
                      You
                    </p>
                  ) : (
                    <Button
                      color="red"
                      variant="outline"
                      onClick={() => deleteAdmin(admin.id)}
                    >
                      Delete
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}
