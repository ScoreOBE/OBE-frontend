import { useEffect, useState } from "react";
import cmulogo from "@/assets/image/cmuLogo.png";
import { Button, Modal, Select } from "@mantine/core";
import { useAppSelector } from "@/store";
import Icon from "./Icon";
import { FaChevronDown } from "react-icons/fa6";
import CalendarIcon from "@/assets/icons/calendar.svg?react";
import { useDisclosure } from "@mantine/hooks";

export default function Sidebar() {
  const [openedFilterTerm, { open: openFilterTerm, close: closeFilterTerm }] =
    useDisclosure(false);
  const academicYear = useAppSelector((state) => state.academicYear);
  const termOption = academicYear.map((e) => {
    return { label: `${e.semester}/${e.year}`, value: e.id };
  });
  const [selectedTerm, setSelectedTerm] = useState(termOption[0]);

  useEffect(() => {
    if (academicYear.length) {
      setSelectedTerm(termOption[0]);
    }
  }, [academicYear]);

  return (
    <div className="w-[270px] h-screen flex justify-center font-sf-pro ">
      <Modal
        opened={openedFilterTerm}
        onClose={closeFilterTerm}
        closeOnClickOutside={false}
        title="Filter"
        size="400px"
        centered
      >
        <Select
          label="Semester"
          data={termOption}
          value={selectedTerm?.value}
          onChange={(_value, option) => setSelectedTerm(option)}
          allowDeselect={false}
          withCheckIcon={false}
          radius="md"
          my="md"
          bd={"none"}
          classNames={{label: "text-primary"}}
          rightSection={<FaChevronDown fill="#6869AD" />}
          // onDropdownOpen={()=>}
        />
        <Button w={"100%"} color="#6869AD">
          OK
        </Button>
      </Modal>

      <div className="absolute top-5 flex flex-col gap-10 text-white ">
        <img src={cmulogo} alt="CMULogo" className="h-[24px]" />

        {/* instructor dashboard */}
        <div className="flex flex-col gap-11">
          <div className="text-sm flex flex-col gap-[6px]">
            <p className="font-semibold">Welcome to CMU OBE!</p>
            <div className="font-normal flex flex-col gap-[2px]">
              <p>
                Your courses are waiting
                <br />
                on the right to jump in!
                <br />
                Account? Top right menu
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <p className="text-md font-semibold">Course</p>
            <Button
              className="bg-transparent w-full h-[50px] flex justify-start items-center  px-3 py-1 border-none rounded-lg text-white transition-colors duration-300 hover:bg-[#F0F0F0] hover:text-primary focus:border-none group"
              leftSection={
                <Icon
                  className="-mt-4 mr-1 hover:stroke-primary"
                  IconComponent={CalendarIcon}
                />
              }
              variant="default"
              onClick={openFilterTerm}
            >
              <div className="flex flex-col justify-start items-start gap-[7px]">
                <p className="font-medium text-[14px]">Semester</p>
                <p className="font-normal text-[12px]">
                  Course ({selectedTerm?.label})
                </p>
              </div>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
