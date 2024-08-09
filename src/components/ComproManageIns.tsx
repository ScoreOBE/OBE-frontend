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
import { IModelUser } from "@/models/ModelUser";
import { getInstructor, updateAdmin } from "@/services/user/user.service";
import { useAppSelector } from "@/store";
import { NOTI_TYPE, ROLE } from "@/helpers/constants/enum";
import { validateEmail } from "@/helpers/functions/validation";
import { getUserName, showNotifications } from "@/helpers/functions/function";

export default function ComproMangementIns() {
  const user = useAppSelector((state) => state.user);
  const [swapMethodAddAdmin, setSwapMethodAddAdmin] = useState(false);
  const [openedDropdown, setOpenedDropdown] = useState(false);
  const [instructorOption, setInstructorOption] = useState<any[]>([]);
  const [editUser, setEditUser] = useState<string | null>();
  const [invalidEmail, setInvalidEmail] = useState(false);
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
        <div className="flex flex-row items-end  p-3 px-4 w-full bg-white border-[1px]  rounded-md">
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
            // onClick={() => editAdmin(editUser!, ROLE.ADMIN)}
          >
            Add
          </Button>
        </div>
      </div>
    </div>
  );
}
