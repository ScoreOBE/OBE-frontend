import { Button, Input, Modal, Select, TextInput } from "@mantine/core";
import AddCoIcon from "@/assets/icons/addCo.svg?react";
import {
  IconChevronRight,
  IconChevronDown,
  IconUsers,
  IconUserCircle,
  IconTrash,
  IconX,
} from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { TbSearch } from "react-icons/tb";
import Icon from "./Icon";

import { useAppSelector } from "@/store";
import { validateEmail } from "@/helpers/functions/validation";
import { NOTI_TYPE, ROLE } from "@/helpers/constants/enum";
import { IModelUser } from "@/models/ModelUser";
import { getInstructor, updateAdmin } from "@/services/user/user.service";
import { getUserName, showNotifications } from "@/helpers/functions/function";

type Props = {
  opened: boolean;
  role?: ROLE;
  action?: () => void;
  setUserList: (data: IModelUser[]) => void;
  setUserFilter?: (data: IModelUser[]) => void;
};

export default function ComproMangementIns({
  opened,
  role,
  action,
  setUserList,
  setUserFilter,
}: Props) {
  const user = useAppSelector((state) => state.user);
  const [swapMethodAddAdmin, setSwapMethodAddAdmin] = useState(false);
  const [openedDropdown, setOpenedDropdown] = useState(false);
  const [editUser, setEditUser] = useState<string | null>();
  const [invalidEmail, setInvalidEmail] = useState(false);
  const [instructorOption, setInstructorOption] = useState<any[]>([]);

  const fetchIns = async () => {
    const res = await getInstructor();
    if (res) {
      const insList = res.filter(
        (e: any) => e.id != user.id && e.role === ROLE.INSTRUCTOR
      );
      let adminList = res.filter((e: IModelUser) => {
        if (e.id !== user.id && e.role === ROLE.ADMIN) {
          return {
            id: e.id,
            firstNameEN: e.firstNameEN,
            lastNameEN: e.lastNameEN,
            email: e.email,
          };
        }
      });
      // Add current user to the top of the admin list
      if (user.role === ROLE.SUPREME_ADMIN || user.role === ROLE.ADMIN) {
        adminList = [
          {
            id: user.id,
            firstNameEN: user.firstNameEN,
            lastNameEN: user.lastNameEN,
            email: user.email,
          },
          ...adminList,
        ];
      }

      setInstructorOption(
        insList.map((e: IModelUser) => {
          return { label: getUserName(e, 1), value: e.id };
        })
      );
      setUserList(adminList);
      if (setUserFilter) setUserFilter(adminList);
    }
  };

  const addAdmin = async () => {
    if (editUser) {
      if (role) {
        const payload: Partial<IModelUser> = { role };
        if (swapMethodAddAdmin) {
          if (invalidEmail) return;
          payload.email = editUser;
        } else payload.id = editUser;
        const res = await updateAdmin(payload);
        if (res) {
          const name = res.firstNameEN?.length
            ? getUserName(res, 1)
            : res.email;
          setEditUser(null);
          fetchIns();
          showNotifications(
            NOTI_TYPE.SUCCESS,
            "Success",
            `${name} is an admin`
          );
        }
      }
    }
  };

  useEffect(() => {
    if (opened) {
      setEditUser(null);
      setSwapMethodAddAdmin(false);
      fetchIns();
    }
  }, [opened]);

  useEffect(() => {
    if (swapMethodAddAdmin) {
      if (editUser?.length) setInvalidEmail(!validateEmail(editUser));
      else setInvalidEmail(false);
    }
  }, [editUser]);

  return (
    <div
      className="flex flex-col gap-3 max-h-[320px] rounded-md h-fit w-full mt-2 p-4  "
      style={{
        boxShadow: "0px 0px 4px 0px rgba(0, 0, 0, 0.25)",
      }}
    >
      <div
        onClick={() => {
          setEditUser(null);
          setSwapMethodAddAdmin(!swapMethodAddAdmin);
        }}
        className="bg-[#e6e9ff] hover:bg-[#dee1fa] cursor-pointer  h-fit rounded-lg text-secondary flex justify-between items-center py-3 px-5  "
      >
        <div className="flex gap-6 items-center">
          <Icon IconComponent={AddCoIcon} className="text-secondary" />
          <p className="font-semibold">
            Add Admin by using
            <span className="font-extrabold">
              {swapMethodAddAdmin ? " Dropdown list" : " CMU Account"}
            </span>
          </p>
        </div>
        <IconChevronRight stroke={2} />
      </div>

      <div className="flex w-full  items-end h-fit ">
        {swapMethodAddAdmin ? (
          <TextInput
            withAsterisk={true}
            description="Make sure CMU account correct"
            label="CMU account"
            className="w-full border-none rounded-r-none"
            style={{ boxShadow: "0px 1px 4px 0px rgba(0, 0, 0, 0.05)" }}
            classNames={{ input: "!rounded-r-none" }}
            placeholder="example@cmu.ac.th"
            value={editUser!}
            onChange={(event) => setEditUser(event.target.value)}
          />
        ) : (
          <Select
            rightSectionPointerEvents="all"
            label="Select Admin"
            placeholder="Admin"
            data={instructorOption}
            allowDeselect
            searchable
            nothingFoundMessage="No result"
            className="w-full border-none "
            classNames={{
              input: " rounded-e-none  rounded-md ",
            }}
            rightSection={
              <template className="flex items-center gap-2 absolute right-2">
                {editUser && (
                  <IconX
                    size={"1.25rem"}
                    stroke={2}
                    className={`cursor-pointer`}
                    onClick={() => setEditUser(null)}
                  />
                )}
                <IconChevronDown
                  stroke={2}
                  className={`${
                    openedDropdown ? "rotate-180" : ""
                  } stroke-primary cursor-pointer`}
                  onClick={() => setOpenedDropdown(!openedDropdown)}
                />
              </template>
            }
            dropdownOpened={openedDropdown}
            // onDropdownOpen={() => setOpenedDropdown(true)}
            onDropdownClose={() => setOpenedDropdown(false)}
            value={editUser}
            onChange={setEditUser}
            onClick={() => setOpenedDropdown(!openedDropdown)}
          />
        )}

        <Button
          className="rounded-s-none min-w-fit border-l-0"
          color="#5768D5"
          disabled={!editUser?.length || (swapMethodAddAdmin && invalidEmail)}
          onClick={() => addAdmin()}
        >
          Add
        </Button>
      </div>
    </div>
  );
}
