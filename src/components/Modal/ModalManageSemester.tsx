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
import { sortData } from "@/helpers/functions/function";

type Props = {
  opened: boolean;
  onClose: () => void;
};
export default function ModalManageSemester({ opened, onClose }: Props) {
  const [openedDropdown, setOpenedDropdown] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [semesterList, setSemesterlist] = useState<any>([]);
  const [termOption, setTermOption] = useState<any[]>([]);
  const [selectSemester, setSelectSemester] = useState();

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
      // const t = Object.keys(semestersByYear).sort((a: any, b: any) => b - a)
      // console.log(t);
      
      // const t = Object.keys(semestersByYear)
      //   .sort((a: any, b: any) => b - a)
      //   .reduce((obj:any, key:any) => {
      //     obj[key] = semestersByYear[key];
      //     return obj
      //   });
      // console.log(t);

      setSemesterlist(semestersByYear);
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
      centered
      transitionProps={{ transition: "pop" }}
      classNames={{
        content:
          "flex flex-col justify-start bg-[#F6F7FA] text-[14px] item-center px-2 pb-2 overflow-hidden max-h-[90%] ",
      }}
    >
      <div className="flex flex-col gap-5 flex-1">
        <div
          className="flex flex-col gap-1  p-3 px-4   bg-white border-[1px]  rounded-md"
          style={{
            boxShadow: "0px 0px 4px 0px rgba(0, 0, 0, 0.25)",
          }}
        >
          <div className="flex w-full items-end h-fit ">
            <Select
              rightSectionPointerEvents="none"
              label="Select Semester"
              defaultDropdownOpened={false}
              placeholder="Semester"
              allowDeselect
              withCheckIcon={false}
              searchable
              className="w-full  "
              classNames={{
                input: "!rounded-r-none",
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

            <Button
              className="rounded-s-none min-w-fit border-l-0"
              color="#5768D5"
              disabled={!selectSemester}
            >
              Add
            </Button>
          </div>
          <p className="text-tertiary font-normal text-[11px]">
            Add semester for the{" "}
            <span className="text-secondary font-semibold">
              next 3 semesters
            </span>{" "}
            from the current semester.
          </p>
        </div>

        {/* Added Semester */}
        <div
          className="w-full  flex flex-col bg-white border-secondary border-[1px]  rounded-md"
          style={{
            boxShadow: "0px 0px 4px 0px rgba(0, 0, 0, 0.25)",
          }}
        >
          <div className="bg-[#e6e9ff] flex gap-3 items-center rounded-t-md border-b-secondary border-[1px] py-3 px-5 text-secondary font-semibold">
            <IconUsers /> Added Semester
          </div>
          {/* Show List Of Semester */}
          <div className="flex flex-col gap-2  w-full h-[350px]  p-4  overflow-y-hidden">
            <Input
              leftSection={<TbSearch />}
              size="xs"
              placeholder="Year"
              value={searchValue}
              onChange={(event) => setSearchValue(event.currentTarget.value)}
              rightSectionPointerEvents="all"
            />
            {/* List of Semester */}

            <div className="flex flex-col gap-2  p-1 overflow-y-auto">
              {Object.keys(semesterList).map((year) => (
                <div
                  key={year}
                  className="border-[1px] border-[#C8CFF7] rounded-md bg-white overflow-clip flex flex-col w-full items-center justify-between"
                >
                  <div className="flex flex-col w-full items-center">
                    {semesterList[year].map((e: any, index: number) => (
                      <div
                        key={e.id}
                        className={`flex flex-row items-center h-16  px-4 py-2 w-full justify-between
                            ${e.isActive ? "bg-[#E5E8FF]" : "bg-[#ffffff]"} `}
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
                            size="xs"
                            variant="filled"
                            className="rounded-lg !border-none  text-white  bg-secondary"
                          >
                            Currently
                          </Button>
                        ) : (
                          <Button
                            variant="outline"
                            color="#5768D5"
                            size="xs"
                            className="rounded-lg "
                          >
                            Activate
                          </Button>
                        )}
                        {/* <Button
                      variant="outline"
                      color="red"
                      size="xs"
                      className=" rounded-lg"
                      onClick={() => editAdmin(admin.id, ROLE.INSTRUCTOR)}
                      leftSection={
                        <IconTrash className=" size-4" stroke={1.5} />
                      }
                    >
                      Delete
                    </Button> */}
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
