import { Button, Input, Modal, Select, TextInput } from "@mantine/core";
import AddCoIcon from "@/assets/icons/addCo.svg?react";
import { IconChevronDown, IconUsers } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { TbSearch } from "react-icons/tb";
import Icon from "../Icon";
import {
  activeAcademicYear,
  createAcademicYear,
  getAcademicYear,
} from "@/services/academicYear/academicYear.service";
import { useAppSelector } from "@/store";
import { NOTI_TYPE, SEMESTER } from "@/helpers/constants/enum";

import { IModelAcademicYear } from "@/models/ModelAcademicYear";
import {
  AcademicYearRequestDTO,
  CreateAcademicYearRequestDTO,
} from "@/services/academicYear/dto/academicYear.dto";
import { showNotifications, sortData } from "@/helpers/functions/function";
import academicYear from "@/store/academicYear";

type Props = {
  opened: boolean;
  onClose: () => void;
};
export default function ModalManageSemester({ opened, onClose }: Props) {
  const [searchValue, setSearchValue] = useState("");
  const [semesterList, setSemesterlist] = useState<any>({});
  const [selectSemester, setSelectSemester] =
    useState<CreateAcademicYearRequestDTO>();

  const fetchSemester = async () => {
    let payload = new AcademicYearRequestDTO();
    payload.manage = true;
    const res = await getAcademicYear(payload);
    const semester =
      res[0].semester === SEMESTER[2] ? SEMESTER[0] : res[0].semester + 1;
    const year = semester === SEMESTER[0] ? res[0].year + 1 : res[0].year;
    setSelectSemester({ year, semester });

      //Group by Year
      const semestersByYear = res.reduce((acc: any, academicYearList: any) => {
        const year: string = academicYearList.year.toString() + "a";

        if (!acc[year]) {
          acc[year] = [];
        }
        acc[year].push(academicYearList);

        return acc;
      }, {});

      setSemesterlist(semestersByYear);
    }
  };

  useEffect(() => {
    if (opened && !selectSemester) {
      fetchSemester();
      console.log(selectSemester);
    }
  }, [opened, selectSemester]);

  const onClickActivate = async (e: IModelAcademicYear) => {
    const res = await activeAcademicYear(e.id);
    if (res) {
      showNotifications(
        NOTI_TYPE.SUCCESS,
        "Activate",
        `Activate ${e.semester}, ${e.year} successful`
      );
      setSelectSemester(undefined);
    }
  };

  const onClickAdd = async () => {
    if (selectSemester) {
      const res = await createAcademicYear(selectSemester);
      if (res) {
        showNotifications(
          NOTI_TYPE.SUCCESS,
          "Add Success",
          `Add Semester ${selectSemester.semester}, ${selectSemester.year} successful`
        );
        setSelectSemester(undefined);
      }
    }
  };

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
        <Button
          className="rounded-s-md min-w-fit w-full border-l-0"
          color="#5768D5"
          onClick={onClickAdd}
        >
          Add Semester {selectSemester?.semester}, {selectSemester?.year}
        </Button>

        {/* Added Semester */}
        <div
          className="w-full  flex flex-col bg-white border-secondary border-[1px]  rounded-md"
          style={{
            boxShadow: "0px 0px 4px 0px rgba(0, 0, 0, 0.25)",
          }}
        >
          <div className="bg-[#e7eaff] flex gap-3 items-center rounded-t-md border-b-secondary border-[1px] py-3 px-5 text-secondary font-semibold">
            <IconUsers /> Added Semester
          </div>
          {/* Show List Of Semester */}
          <div className="flex flex-col gap-2  w-full h-[350px]  p-4  overflow-y-hidden">
            <TextInput
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
                        className={`flex flex-row items-center h-[56px]  px-4 w-full justify-between
                            ${e.isActive ? "bg-[#E5E8FF]" : "bg-[#ffffff]"} `}
                      >
                        {index === 0 ? (
                          <div className="w-10">
                            <p className="font-medium text-[#4E5150] text-[10px]">
                              Year
                            </p>
                            <p className="font-semibold text-black text-[14px]">
                              {year.slice(0, -1)}
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
                            className={`font-semibold text-black text-[14px] ${
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
                            className="rounded-lg !border-none  w-[78px]"
                          >
                            Currently
                          </Button>
                        ) : (
                          <Button
                            variant="outline"
                            color="#5768D5"
                            size="xs"
                            className="rounded-lg"
                            onClick={() => onClickActivate(e)}
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
