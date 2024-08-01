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
export default function ModalManageSemester({ opened, onClose }: Props) {
  const user = useAppSelector((state) => state.user);
  const [openedDropdown, setOpenedDropdown] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [instructorOption, setInstructorOption] = useState<any[]>([]);
  const [adminList, setAdminList] = useState<any[]>([]);

  useEffect(() => {
    const fetchSemester = async () => {
      // let res = await getInstructor();
      // Add current user to the top of the admin list
      // if (user.role === ROLE.SUPREME_ADMIN || user.role === ROLE.ADMIN) {
      //   adminList = [
      //     {
      //       firstNameEN: user.firstNameEN,
      //       lastNameEN: user.lastNameEN,
      //       value: user.id,
      //       email: user.email,
      //     },
      //     ...adminList,
      //   ];
      // }
      // setInstructorOption(
      //   insList.map((e: IModelUser) => {
      //     return { label: `${e.firstNameEN} ${e.lastNameEN}`, value: e.id };
      //   })
      // );
      // setAdminList(
      //   adminList.map((e: IModelUser) => {
      //     return {
      //       firstNameEN: e.firstNameEN,
      //       lastNameEN: e.lastNameEN,
      //       value: e.id,
      //       email: e.email,
      //     };
      //   })
      // );
    };
    if (opened) {
      fetchSemester();
    }
  }, [opened]);

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      closeOnClickOutside={false}
      title="Management Semester"
      size="42vw"
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
          className="flex flex-col gap-1  p-4   bg-white border-[1px]  rounded-md"
          style={{
            boxShadow: "0px 0px 4px 0px rgba(0, 0, 0, 0.25)",
          }}
        >
          <div className="flex w-full items-end h-fit ">
            <Select
              rightSectionPointerEvents="none"
              label="Select Semester to add"
              defaultDropdownOpened={false}
              placeholder="Select Semester"
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
            />

            <Button className="rounded-s-none w-[12%]" color="#5768D5">
              Add
            </Button>
          </div>
          <p className="text-[#575757] font-10px;">
            Add courses for the{" "}
            <span className="text-[#5768D5;]">next 3 semesters</span> from the
            current semester.
          </p>
        </div>

        {/* Added Admin */}
        <div
          className="w-full  flex flex-col bg-white border-secondary border-[1px]  rounded-md"
          style={{
            boxShadow: "0px 0px 4px 0px rgba(0, 0, 0, 0.25)",
          }}
        >
          <div className="bg-[#e6e9ff] flex gap-3 items-center rounded-t-md border-b-secondary border-[1px] px-4 py-3 text-secondary font-medium">
            <IconUsers /> Management Semester
          </div>
          {/* Show List Of Semester */}
          <div className="flex flex-col gap-4  w-full h-[330px]  p-4  overflow-y-hidden">
            <Input
              leftSection={<TbSearch />}
              placeholder="Year"
              value={searchValue}
              onChange={(event) => setSearchValue(event.currentTarget.value)}
              className="focus:border-none px-1"
              classNames={{ input: "bg-gray-200 rounded-md border-none" }}
              rightSectionPointerEvents="all"
            />
            {/* List of Semester */}
            <div
              className="flex flex-col gap-1  p-4  h-full  bg-white border-[1px]  rounded-md"
              style={{
                boxShadow: "0px 0px 2px 0px rgba(0, 0, 0, 0.25)",
              }}
            >
              <div className="flex flex-col gap-2 rounded-3xl p-1">
                <div className="border-[1px] border-[#C8CFF7] rounded-xl overflow-clip flex flex-col w-full items-center justify-between ">
                  <div className="flex flex-row items-center justify-between px-4 py-2  w-full  bg-[#F3F3F3]">
                    <div>
                      <p className="font-medium text-[#4E5150] text-[12px]">
                        Year
                      </p>
                      <p className="font-semibold text-black text-[16px]">
                        2567
                      </p>
                    </div>

                    <div>
                      <p className="font-medium text-[#4E5150] text-[12px]">
                        Semester
                      </p>
                      <p className="font-semibold text-black text-[16px]">3</p>
                    </div>
                    <Button
                      variant="filled"
                      color="#5768D5"
                      className="rounded-xl px-[10px] text-white font-normal"
                    >
                      Activate
                    </Button>
                  </div>
                  <div className="flex flex-row items-center justify-between gap-[156px] px-4 py-2  w-full  bg-[#F3F3F3]">
                    <div>
                      <p className="font-medium text-[#4E5150] text-[12px]">
                        Year
                      </p>
                      <p className="font-semibold text-black text-[16px]">
                        2567
                      </p>
                    </div>

                    <div>
                      <p className="font-medium text-[#4E5150] text-[12px]">
                        Semester
                      </p>
                      <p className="font-semibold text-black text-[16px]">3</p>
                    </div>
                    <Button
                      variant="filled"
                      color="#5768D5"
                      className="rounded-xl px-[10px] text-white font-normal"
                    >
                      Activate
                    </Button>
                  </div>
                  <div className="flex flex-row items-center justify-between gap-[156px] px-4 py-2  w-full  bg-[#F3F3F3]">
                    <div>
                      <p className="font-medium text-[#4E5150] text-[12px]">
                        Year
                      </p>
                      <p className="font-semibold text-black text-[16px]">
                        2567
                      </p>
                    </div>

                    <div>
                      <p className="font-medium text-[#4E5150] text-[12px]">
                        Semester
                      </p>
                      <p className="font-semibold text-black text-[16px]">3</p>
                    </div>
                    <Button
                      variant="filled"
                      color="#5768D5"
                      className="rounded-xl px-[10px] text-white font-normal"
                    >
                      Activate
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}
