import {
  Button,
  Checkbox,
  Group,
  Input,
  Modal,
  Select,
  TextInput,
} from "@mantine/core";
import AddCoIcon from "@/assets/icons/addCo.svg?react";
import {
  IconChevronRight,
  IconChevronDown,
  IconUsers,
  IconUserCircle,
  IconTrash,
} from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { TbSearch } from "react-icons/tb";
import Icon from "../Icon";
import { IModelUser } from "@/models/ModelUser";
import { getInstructor } from "@/services/user/user.service";
import { useAppSelector } from "@/store";
import { ROLE } from "@/helpers/constants/enum";
import { updateUser } from "@/services/user/user.service";
import { log } from "console";

type Props = {
  opened: boolean;
  onClose: () => void;
};
export default function ModalManageAdmin({ opened, onClose }: Props) {
  const user = useAppSelector((state) => state.user);
  const [swapMethodAddAdmin, setSwapMethodAddAdmin] = useState(false);
  const [openedDropdown, setOpenedDropdown] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [instructorOption, setInstructorOption] = useState<any[]>([]);
  const [adminList, setAdminList] = useState<any[]>([]);

  const closeModal = () => {
    setSwapMethodAddAdmin(false);
    onClose();
  };

  const addAdmin = async () => {};

  useEffect(() => {
    const fetchIns = async () => {
      let res = await getInstructor();
      let insList = res.filter(
        (e: any) => e.id != user.id && e.role === ROLE.INSTRUCTOR
      );
      let adminList = res.filter(
        (e: any) => e.id != user.id && e.role === ROLE.ADMIN
      );

      // Add current user to the top of the admin list
      if (user.role === ROLE.SUPREME_ADMIN || user.role === ROLE.ADMIN) {
        adminList = [
          {
            firstNameEN: user.firstNameEN,
            lastNameEN: user.lastNameEN,
            value: user.id,
            email: user.email,
          },
          ...adminList,
        ];
      }

      setInstructorOption(
        insList.map((e: IModelUser) => {
          return { label: `${e.firstNameEN} ${e.lastNameEN}`, value: e.id };
        })
      );
      setAdminList(
        adminList.map((e: IModelUser) => {
          return {
            firstNameEN: e.firstNameEN,
            lastNameEN: e.lastNameEN,
            value: e.id,
            email: e.email,
          };
        })
      );
    };
    if (opened) {
      fetchIns();
    }
  }, [opened]);

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      closeOnClickOutside={false}
      title="Management admin"
      size="45vw"
      radius={"12px"}
      centered
      transitionProps={{ transition: "pop" }}
      classNames={{
        title: "text-primary font-medium text-[18px]",
        header: "bg-[#F6F7FA]",
        content:
          "flex flex-col justify-start bg-[#F6F7FA] text-[14px] item-center px-2 pb-2 overflow-hidden max-h-[90%] ",
      }}
    >
      <div className="flex flex-col gap-5 flex-1">
        <div
          onClick={() => setSwapMethodAddAdmin(!swapMethodAddAdmin)}
          className="bg-[#e6e9ff] hover:bg-[#dee1fa] cursor-pointer  h-fit rounded-lg text-secondary flex justify-between items-center p-4   "
        >
          <div className="flex gap-6 items-center">
            <Icon IconComponent={AddCoIcon} className="text-secondary" />
            <p>
              Add Admin by using{" "}
              <span className="font-semibold">
                {swapMethodAddAdmin ? "Dropdown list" : "CMU Account"}
              </span>
            </p>
          </div>
          <IconChevronRight stroke={2} />
        </div>

        <div className="flex w-full items-end h-fit ">
          {swapMethodAddAdmin ? (
            <TextInput
              label={
                <p>
                  Add Admin via CMU account{" "}
                  <span className=" text-red-500">
                    (make sure CMU account correct)
                  </span>
                </p>
              }
              className="w-full border-none "
              style={{ boxShadow: "0px 1px 4px 0px rgba(0, 0, 0, 0.05)" }}
              classNames={{
                label: "font-medium mb-1 text-[14px] text-[#3E3E3E]",
                input:
                  "text-primary font-medium focus:border-primary rounded-e-none cursor-pointer",
              }}
              placeholder="example@cmu.ac.th"
            ></TextInput>
          ) : (
            <Select
              rightSectionPointerEvents="none"
              label="Select Admin to add"
              defaultDropdownOpened={false}
              placeholder="Select Admin"
              data={instructorOption}
              allowDeselect
              withCheckIcon={false}
              searchable
              className="w-full border-none "
              style={{ boxShadow: "0px 1px 4px 0px rgba(0, 0, 0, 0.05)" }}
              classNames={{
                label: "font-medium mb-1 text-[14px] text-[#3E3E3E]",
                input:
                  "text-primary font-medium focus:border-primary rounded-e-none cursor-pointer",
                option: "hover:bg-[#DDDDF6] text-primary font-medium",
                dropdown: "drop-shadow-[0_0px_4px_rgba(0,0,0,0.30)]",
              }}
              rightSection={
                <IconChevronDown
                  className={`${
                    openedDropdown ? "rotate-180" : ""
                  } stroke-primary stroke-2`}
                />
              }
              onDropdownOpen={() => setOpenedDropdown(true)}
              onDropdownClose={() => setOpenedDropdown(false)}
              //value={insInput?.value}
              //onChange={(value, option) => setInsInput(option)}
            />
          )}
          <Button
            className="rounded-s-none w-[12%]"
            color="#5768D5"
            onClick={() => addAdmin()}
          >
            Add
          </Button>
        </div>

        {/* Added Admin */}
        <div
          className="w-full  flex flex-col bg-white border-secondary border-[1px]  rounded-md"
          style={{
            boxShadow: "0px 0px 4px 0px rgba(0, 0, 0, 0.25)",
          }}
        >
          <div className="bg-[#e6e9ff] flex gap-3 items-center rounded-t-md border-b-secondary border-[1px] px-4 py-3 text-secondary font-medium">
            <IconUsers /> Added Admin
          </div>
          {/* Show List Of Admin */}
          <div className="flex flex-col  w-full h-[330px]  p-4  overflow-y-hidden">
            <Input
              leftSection={<TbSearch />}
              placeholder="Name"
              value={searchValue}
              onChange={(event) => setSearchValue(event.currentTarget.value)}
              className="focus:border-none px-1"
              classNames={{ input: "bg-gray-200 rounded-md border-none" }}
              rightSectionPointerEvents="all"
            />
            {/* List of Admin */}
            <div className="flex flex-col gap-2 overflow-y-scroll p-1">
              {adminList.map((e) => (
                <div
                  style={{
                    boxShadow: "0px 0px 4px 0px rgba(0, 0, 0, 0.25)",
                  }}
                  className="w-full items-center justify-between mt-2 py-3 px-4 rounded-md flex"
                >
                  <div className="gap-4 flex items-center">
                    <IconUserCircle size={32} stroke={1} />
                    <div className="flex flex-col">
                      <p className="font-[500]">
                        {e.firstNameEN} {e.lastNameEN}
                      </p>
                      <p className="text-[#4E5150] text-[12px] font-normal">
                        {e.email}
                      </p>
                    </div>
                  </div>
                  {e.firstNameEN === user.firstNameEN &&
                  e.lastNameEN === user.lastNameEN ? (
                    <p className="mr-1 text-[#C0C0C0] text-[16px] font-normal">
                      You
                    </p>
                  ) : (
                    <Button
                      variant="outline"
                      color="red"
                      className=" rounded-full px-[7px]"
                    >
                      <IconTrash className="h-5 w-5" stroke={1.5} />
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
