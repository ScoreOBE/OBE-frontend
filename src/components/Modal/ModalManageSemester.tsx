import { Button, Input, Modal, Select } from "@mantine/core";
import AddCoIcon from "@/assets/icons/addCo.svg?react";
import { IconChevronDown, IconUsers } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { TbSearch } from "react-icons/tb";
import Icon from "../Icon";
import { getAcademicYear } from "@/services/academicYear/academicYear.service";
import { useAppSelector } from "@/store";
import { SEMESTER } from "@/helpers/constants/enum";

import { IModelAcademicYear } from "@/models/ModelAcademicYear";
import { AcademicYearRequestDTO } from "@/services/academicYear/dto/academicYear.dto";

type Props = {
  opened: boolean;
  onClose: () => void;
};
export default function ModalManageSemester({ opened, onClose }: Props) {
  const [openedDropdown, setOpenedDropdown] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [semesterList, setSemesterlist] = useState<any>([]);
  const [termOption, setTermOption] = useState<any[]>([]);

  useEffect(() => {
    const fetchSemester = async () => {
      let payload = new AcademicYearRequestDTO();
      payload.manage = true;
      const res = await getAcademicYear(payload);
      const academicYearList = res.map((e: IModelAcademicYear) => {
        return {
          value: e.id,
          year: e.year,
          semester: e.semester,
          isActive: e.isActive,
        };
      });
      //Group by Year
      const semestersByYear = academicYearList.reduce(
        (acc: any, academicYearList: any) => {
          if (!acc[academicYearList.year]) {
            acc[academicYearList.year] = [];
          }
          acc[academicYearList.year].push(academicYearList);
          return acc;
        },
        {}
      );
      setSemesterlist(semestersByYear);
    };

    if (opened) {
      fetchSemester();
      console.log(semesterList);
      console.log(Object.keys(semesterList));
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

        {/* Added Semester */}
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

            <div className="flex flex-col gap-2 rounded-3xl p-1 overflow-y-auto">
              {Object.keys(semesterList).map((year) => (
                <div
                  key={year}
                  className="border-[2px] border-[#C8CFF7] rounded-xl overflow-clip flex flex-col w-full items-center justify-between"
                >
                  <div className="flex flex-col w-full items-center">
                    {semesterList[year].map((e: any, index: number) => (
                      <div
                        key={e.id}
                        className={`flex flex-row items-center h-16  px-4 py-2 w-full justify-between
                            ${e.isActive ? "bg-[#E5E8FF]" : "bg-[#F3F3F3]"} `}
                      >
                        {index === 0 ? (
                          <div>
                            <p className="font-medium text-[#4E5150] text-[12px]">
                              Year
                            </p>
                            <p className="font-semibold text-black text-[16px]">
                              {year}
                            </p>
                          </div>
                        ) : (
                          <div className="w-10"></div>
                        )}
                        <div>
                          <p className="font-medium text-[#4E5150] text-[12px]">
                            Semester
                          </p>
                          <p
                            className={`font-semibold text-black text-[16px] ${
                              e.isActive ? "text-secondary" : "text-black"
                            }`}
                          >
                            {e.semester}
                          </p>
                        </div>

                        {e.isActive ? (
                          <Button
                            disabled
                            variant="filled"
                            color="#C8CFF7"
                            className="rounded-xl w-[85px] px-[10px] bg-[#C8CFF7] text-[#6869AD] font-normal"
                          >
                            Currently
                          </Button>
                        ) : (
                          <Button
                            variant="filled"
                            color="#5768D5"
                            className="rounded-xl w-[85px] px-[10px] text-white font-normal"
                          >
                            Activate
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}
