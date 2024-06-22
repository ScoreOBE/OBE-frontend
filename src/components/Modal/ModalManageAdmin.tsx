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
import user from "@/store/user";
import { useAppSelector } from "@/store";

type Props = {
  opened: boolean;
  onClose: () => void;
};
export default function ModalManageAdmin({ opened, onClose }: Props) {
  const user = useAppSelector((state) => state.user);
  const [swapMethodAddCo, setSwapMethodAddCo] = useState(false);
  const [openedDropdown, setOpenedDropdown] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [instructorOption, setInstructorOption] = useState<any[]>([]);
  const closeModal = () => {
    setSwapMethodAddCo(false);
    onClose();
  };

  useEffect(() => {
    const fetchIns = async () => {
      let res = await getInstructor();
      res = res.filter((e: any) => e.id != user.id);
      setInstructorOption(
        res.map((e: IModelUser) => {
          return { label: `${e.firstNameEN} ${e.lastNameEN}`, value: e.id };
        })
      );
    };
    fetchIns();
  }, [onClose]);

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      closeOnClickOutside={false}
      withCloseButton={false}
      title="Management admin"
      size="45vw"
      radius={"12px"}
      centered
      transitionProps={{ transition: "pop" }}
      classNames={{
        title: "text-primary font-medium text-[18px]",
        header: "bg-[#F6F7FA]",
        content:
          "flex flex-col justify-center bg-[#F6F7FA] text-[14px] item-center px-2 overflow-hidden",
      }}
    >
      {" "}
      <div className="flex flex-col gap-5  flex-1 ">
        <div
          onClick={() => setSwapMethodAddCo(!swapMethodAddCo)}
          className="bg-[#e6e9ff] hover:bg-[#dee1fa] cursor-pointer  h-fit rounded-lg text-secondary flex justify-between items-center p-4   "
        >
          <div className="flex gap-6">
            <Icon IconComponent={AddCoIcon} className="text-secondary" />
            <p>
              Add Admin by using{" "}
              <span className="font-semibold">
                {swapMethodAddCo ? "Dropdown list" : "CMU Account"}
              </span>
            </p>
          </div>
          <IconChevronRight stroke={2} />
        </div>

        <div className="flex w-full items-end h-fit ">
          {swapMethodAddCo ? (
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
            //onClick={addCoIns}
          >
            Add
          </Button>
        </div>
        <div
          className="w-full flex flex-col bg-white border-secondary border-[1px]  rounded-md"
          style={{
            boxShadow: "0px 0px 4px 0px rgba(0, 0, 0, 0.25)",
          }}
        >
          <div className="bg-[#e6e9ff] flex gap-3 items-center rounded-t-md border-b-secondary border-[1px] px-4 py-3 text-secondary font-medium">
            <IconUsers /> Added Admin
          </div>
          <div className="flex flex-col max-h-[300px] h-fit w-full  p-4  overflow-y-scroll ">
            <Input
              leftSection={<TbSearch />}
              placeholder="Name"
              value={searchValue}
              onChange={(event) => setSearchValue(event.currentTarget.value)}
              className="focus:border-none px-1"
              classNames={{ input: "bg-gray-200 rounded-md border-none" }}
              rightSectionPointerEvents="all"
            />
            <div className="flex flex-col h-[200px] gap-2 overflow-y-scroll p-1">
              <div
                style={{
                  boxShadow: "0px 0px 4px 0px rgba(0, 0, 0, 0.25)",
                }}
                className="w-full items-center justify-between mt-2 h-fit py-3 px-4 rounded-md flex"
              >
                <div className="gap-4 flex items-center">
                  <IconUserCircle size={32} stroke={1} />
                  <div className="flex flex-col">
                    <p className="font-[500]">
                      {user.firstNameEN} {user.lastNameEN}
                    </p>
                    <p className="text-[#4E5150] text-[12px] font-normal">
                      {user.email}
                    </p>
                  </div>
                </div>
                <Button variant="outline" color="red" className=" rounded-full px-[7px]">
                <IconTrash className="h-5 w-5" stroke={1.5} />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Group className="flex w-full h-fit items-end mt-5 justify-end">
        <div>
          <Button
            color="#E3E5EB"
            className="rounded-[10px]  items-center text-black hover:text-black justify-center h-[36px]  border-0"
            justify="start"
            onClick={closeModal}
          >
            Cancel
          </Button>
        </div>
        <Button
          color="#6869AD"
          className="rounded-[10px] h-[36px] w-fit"
          //onClick={nextStep}
        >
          Done
        </Button>
      </Group>
    </Modal>
  );
}
