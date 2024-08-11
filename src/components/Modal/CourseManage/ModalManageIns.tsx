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
import Icon from "@/components/Icon";
import { IModelUser } from "@/models/ModelUser";
import { getInstructor, updateAdmin } from "@/services/user/user.service";
import { useAppSelector } from "@/store";
import { NOTI_TYPE, ROLE } from "@/helpers/constants/enum";
import { validateEmail } from "@/helpers/functions/validation";
import {
  getSection,
  getUserName,
  showNotifications,
} from "@/helpers/functions/function";
import { Tabs } from "@mantine/core";
import { IModelSectionManagement } from "@/models/ModelCourseManagement";

type Props = {
  opened: boolean;
  onClose: () => void;
  data: Partial<IModelSectionManagement> & Record<string, any>;
};
export default function ModalManageIns({ opened, onClose, data = {} }: Props) {
  const user = useAppSelector((state) => state.user);
  const [swapMethodAddAdmin, setSwapMethodAddAdmin] = useState(false);
  const [openedDropdown, setOpenedDropdown] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [instructorOption, setInstructorOption] = useState<any[]>([]);
  const [adminList, setAdminList] = useState<IModelUser[]>([]);
  const [adminFilter, setAdminFilter] = useState<IModelUser[]>([]);
  const [editUser, setEditUser] = useState<string | null>();
  const [invalidEmail, setInvalidEmail] = useState(false);

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
      setAdminList(adminList);
      setAdminFilter(adminList);
    }
  };

  const editAdmin = async (id: string, role: ROLE) => {
    const payload: Partial<IModelUser> = { role };
    if (swapMethodAddAdmin && role === ROLE.ADMIN) {
      if (invalidEmail) return;
      payload.email = id;
    } else payload.id = id;
    const res = await updateAdmin(payload);
    if (res) {
      const name = res.firstNameEN?.length ? getUserName(res, 1) : res.email;
      const message =
        res.role == ROLE.ADMIN
          ? `${name} is an admin`
          : `Delete ${name} from admin`;
      setEditUser(null);
      fetchIns();
      showNotifications(NOTI_TYPE.SUCCESS, "Success", message);
    }
  };

  useEffect(() => {
    if (opened) {
      setEditUser(null);
      setSearchValue("");
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

  useEffect(() => {
    setAdminFilter(
      adminList.filter(
        (admin) =>
          `${getUserName(admin, 2)}`.includes(searchValue.toLowerCase()) ||
          admin.email.toLowerCase().includes(searchValue.toLowerCase())
      )
    );
  }, [searchValue]);

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      closeOnClickOutside={false}
      title={
        <div className="flex flex-col gap-2">
          <p>Management Instructor</p>{" "}
          <p className="text-b2 font-medium text-[#575757]">
            {data.courseNo} Section {getSection(data.sectionNo)}
          </p>{" "}
        </div>
      }
      size="45vw"
      centered
      transitionProps={{ transition: "pop" }}
      classNames={{
        content:
          "flex flex-col justify-start bg-[#F6F7FA] text-[14px] item-center px-2 pb-2 overflow-hidden max-h-fit ",
      }}
    >
      <Tabs color="#5768d5" defaultValue="mainInstructor">
        <Tabs.List>
          <Tabs.Tab value="mainInstructor">Owner course</Tabs.Tab>
          <Tabs.Tab value="coInstructor">Co-Instructor</Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="mainInstructor">
          <div className="flex flex-col h-full gap-4  mt-4  flex-1 ">
            <div
              style={{
                boxShadow: "0px 0px 4px 0px rgba(0, 0, 0, 0.25)",
              }}
              className="flex gap-3 items-center rounded-md border-secondary border-[1px] px-4 py-3 text-secondary font-semibold"
            >
              <IconUserCircle
                size={32}
                className=" -translate-x-1"
                stroke={1}
              />
              <div className="flex flex-col">
                <p className="text-[#575757]">
                  {getUserName(data.instructor , 1)}
                </p>
                <p className="text-[12px] ">
                  Owner Section {getSection(data.sectionNo)}{" "}
                </p>
              </div>
            </div>

            <div
              className="flex flex-col gap-3 max-h-[320px] rounded-md h-fit w-full p-4  "
              style={{
                boxShadow: "0px 0px 4px 0px rgba(0, 0, 0, 0.25)",
              }}
            >
              <div
                onClick={() => {
                  setEditUser(null);
                  setSwapMethodAddAdmin(!swapMethodAddAdmin);
                }}
                className="bg-[#e6e9ff] hover:bg-[#dee1fa] cursor-pointer  h-fit rounded-lg text-secondary flex justify-between items-center p-4  "
              >
                <div className="flex gap-6 items-center">
                  <Icon IconComponent={AddCoIcon} className="text-secondary" />
                  <p className="font-semibold">
                    Change Owner section by using
                    <span className="font-extrabold">
                      {swapMethodAddAdmin ? " Dropdown list" : " CMU Account"}
                    </span>
                  </p>
                </div>
                <IconChevronRight stroke={2} />
              </div>

              <div className="flex w-full  items-end h-fit ">
                <div className="flex flex-row items-end  w-full bg-white   rounded-md">
                  {swapMethodAddAdmin ? (
                    <TextInput
                      withAsterisk={true}
                      description="Make sure CMU account correct"
                      label="CMU account"
                      className="w-full border-none rounded-r-none"
                      style={{
                        boxShadow: "0px 1px 4px 0px rgba(0, 0, 0, 0.05)",
                      }}
                      classNames={{ input: "!rounded-r-none" }}
                      placeholder="example@cmu.ac.th"
                      value={editUser!}
                      onChange={(event) => setEditUser(event.target.value)}
                    />
                  ) : (
                    <Select
                      rightSectionPointerEvents="all"
                      label="Select Owner section"
                      placeholder="Owner course"
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
                    disabled={
                      !editUser?.length || (swapMethodAddAdmin && invalidEmail)
                    }
                    onClick={() => editAdmin(editUser!, ROLE.ADMIN)}
                  >
                    Change
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </Tabs.Panel>
      </Tabs>
    </Modal>
  );
}
