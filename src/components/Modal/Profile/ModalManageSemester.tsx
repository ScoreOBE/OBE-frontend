import { Button, Modal, PasswordInput, TextInput } from "@mantine/core";
import { IconUsers } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { TbSearch } from "react-icons/tb";
import {
  activeAcademicYear,
  createAcademicYear,
  getAcademicYear,
} from "@/services/academicYear/academicYear.service";
import { NOTI_TYPE, SEMESTER } from "@/helpers/constants/enum";
import { IModelAcademicYear } from "@/models/ModelAcademicYear";
import {
  AcademicYearRequestDTO,
  CreateAcademicYearRequestDTO,
} from "@/services/academicYear/dto/academicYear.dto";
import { showNotifications } from "@/helpers/functions/function";
import { useAppDispatch } from "@/store";
import { setAcademicYear } from "@/store/academicYear";
import { isEqual } from "lodash";

type Props = {
  opened: boolean;
  onClose: () => void;
};
export default function ModalManageSemester({ opened, onClose }: Props) {
  const dispatch = useAppDispatch();
  const [searchValue, setSearchValue] = useState("");
  const [yearList, setYearList] = useState<IModelAcademicYear[]>([]);
  const [yearFilter, setYearFilter] = useState<any>({});
  const [semesterList, setSemesterlist] = useState<any>({});
  const [selectSemester, setSelectSemester] =
    useState<CreateAcademicYearRequestDTO>();
  const [openActivateModal, setOpenActivateModal] = useState(false);
  const [activateSemester, setActivateSemester] =
    useState<IModelAcademicYear>();
  const [textActivate, setTextActivate] = useState("");

  useEffect(() => {
    if (opened) {
      fetchSemester();
    }
  }, [opened]);

  useEffect(() => {
    const keyFilter = Object.keys(semesterList).filter((year) =>
      year.replace("a", "").includes(searchValue)
    );
    let filter: any = {};
    keyFilter.map((year) => {
      filter[year] = semesterList[year];
    });

    setYearFilter(filter);
  }, [searchValue]);

  const fetchSemester = async () => {
    let payload = new AcademicYearRequestDTO();
    payload.manage = true;
    const res: IModelAcademicYear[] = await getAcademicYear(payload);
    if (res) {
      setYearList(res);
      const semester =
        res[0].semester === SEMESTER[2] ? SEMESTER[0] : res[0].semester + 1;
      const year = semester === SEMESTER[0] ? res[0].year + 1 : res[0].year;
      setSelectSemester({ year, semester });

      //Group by Year
      const semestersByYear = res.reduce(
        (acc: any, academicYearList: IModelAcademicYear) => {
          const termActive = res.find((term) => term.isActive);
          const year: string = academicYearList.year.toString() + "a";
          if (!acc[year]) {
            acc[year] = [];
          }
          acc[year].push({
            ...academicYearList,
            disabled:
              academicYearList.isActive ||
              termActive?.year! > academicYearList.year ||
              (termActive?.year! == academicYearList.year &&
                termActive?.semester! > academicYearList.semester),
          });
          return acc;
        },
        {}
      );

      setSemesterlist(semestersByYear);
      setYearFilter(semestersByYear);
    }
  };

  const onClickActivate = async (e: IModelAcademicYear) => {
    const res = await activeAcademicYear(e.id);
    if (res) {
      showNotifications(
        NOTI_TYPE.SUCCESS,
        "Activate",
        `Activate ${e.semester}, ${e.year} successful`
      );
      setSelectSemester(undefined);
      const res = await getAcademicYear(new AcademicYearRequestDTO());
      dispatch(setAcademicYear(res));
      setOpenActivateModal(false);
      fetchSemester();
    }
  };

  const onClickAdd = async () => {
    if (selectSemester) {
      const active = yearList.find((semester) => semester.isActive);

      if (!active) {
        showNotifications(NOTI_TYPE.ERROR, "No active semester found", "ihjj");
        return;
      }

      let newSemester = active.semester + 3;
      let newYear = active.year;
      // Adjust the year if the semester exceeds 3
      if (newSemester > 3) {
        newYear += Math.floor((newSemester - 1) / 3);
        newSemester = newSemester % 3 || 3;
      }

      const limit = { semester: newSemester, year: newYear };
      if (
        limit.year < selectSemester.year ||
        (limit.year === selectSemester.year &&
          limit.semester < selectSemester.semester)
      ) {
        showNotifications(
          NOTI_TYPE.ERROR,
          "Cannot add more than 3 semesters",
          "You cannot add more than 3 semesters from the active semester."
        );
        return;
      }

      const res = await createAcademicYear(selectSemester);
      if (res) {
        showNotifications(
          NOTI_TYPE.SUCCESS,
          "Add Success",
          `Add Semester ${selectSemester.semester}, ${selectSemester.year} successful`
        );
        setSelectSemester(undefined);
        fetchSemester();
      }
    }
  };

  return (
    <>
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
                {Object.keys(yearFilter).map((year) => (
                  <div
                    key={year}
                    className="border-[1px] border-[#C8CFF7] rounded-md bg-white overflow-clip flex flex-col w-full items-center justify-between"
                  >
                    <div className="flex flex-col w-full items-center">
                      {yearFilter[year].map((semester: any, index: number) => (
                        <div
                          key={semester.id}
                          className={`flex flex-row items-center h-[56px]  px-4 w-full justify-between
                            ${
                              semester.isActive
                                ? "bg-[#E5E8FF]"
                                : "bg-[#ffffff]"
                            }`}
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
                                semester.isActive
                                  ? "text-secondary"
                                  : "text-black"
                              }`}
                            >
                              {semester.semester}
                            </p>
                          </div>
                          <Button
                            variant="outline"
                            color="#5768D5"
                            size="xs"
                            className={`rounded-lg ${
                              semester.isActive && "border-none"
                            }`}
                            disabled={semester.disabled}
                            onClick={() => {
                              setActivateSemester(semester);
                              onClose();
                              setOpenActivateModal(true);
                            }}
                          >
                            {semester.isActive ? "Currently" : "Activate"}
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <Button
            className="rounded-s-[4px] min-w-fit h-[36px] w-full "
            color="#5768D5"
            onClick={onClickAdd}
          >
            Add Semester {selectSemester?.semester}, {selectSemester?.year}
          </Button>
        </div>
      </Modal>
      <Modal
        opened={openActivateModal}
        size="42vw"
        title={`Activate semester ${activateSemester?.semester}/${activateSemester?.year}`}
        transitionProps={{ transition: "pop" }}
        centered
        onClose={() => setOpenActivateModal(false)}
      >
        <TextInput
          label={`To confirm, type "semester${activateSemester?.semester}year${activateSemester?.year}" in the box below`}
          value={textActivate}
          classNames={{ label: " select-none" }}
          onChange={(event) => setTextActivate(event.target.value)}
        ></TextInput>
        <Button
          color="#5768D5"
          disabled={
            !isEqual(
              `semester${activateSemester?.semester}year${activateSemester?.year}`,
              textActivate
            )
          }
          onClick={() => onClickActivate(activateSemester!)}
          className="rounded-s-[4px] mt-4 min-w-fit h-[36px]  border-none w-full"
        >
          Activate this semester
        </Button>
      </Modal>
    </>
  );
}
