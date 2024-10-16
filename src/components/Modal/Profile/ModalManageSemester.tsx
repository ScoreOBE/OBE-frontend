import { Alert, Button, Modal, TextInput } from "@mantine/core";
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
import { useAppDispatch, useAppSelector } from "@/store";
import { setAcademicYear } from "@/store/academicYear";
import { isEqual } from "lodash";
import Icon from "@/components/Icon";
import CalendarIcon from "@/assets/icons/calendar.svg?react";
import exclamationCircle from "@/assets/icons/exclamationCircle.svg?react";
import plus from "@/assets/icons/plus2.svg?react";

type Props = {
  opened: boolean;
  onClose: () => void;
};
export default function ModalManageSemester({ opened, onClose }: Props) {
  const academicYear = useAppSelector((state) => state.academicYear[0]);
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
          const nextSemester: any = {};
          nextSemester.semester = (termActive?.semester! + 1) % 3 || 3;
          nextSemester.year =
            nextSemester.semester == 1
              ? termActive?.year! + 1
              : termActive?.year!;
          const year: string = academicYearList.year.toString() + "a";
          if (!acc[year]) {
            acc[year] = [];
          }

          acc[year].push({
            ...academicYearList,
            disabled: !(
              nextSemester.semester == academicYearList.semester &&
              nextSemester.year == academicYearList.year
            ),
            // academicYearList.isActive ||
            // termActive?.year! > academicYearList.year ||
            // (termActive?.year! == academicYearList.year &&
            //   termActive?.semester! > academicYearList.semester),
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
      setTextActivate("");
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
        title="Management Semester"
        size="42vw"
        centered
        transitionProps={{ transition: "pop" }}
        classNames={{
          content:
            "flex flex-col justify-start bg-[#F6F7FA] text-[14px]  item-center px-2 pb-2 overflow-hidden max-h-[100%] ",
        }}
      >
        <div className="flex flex-col gap-5 flex-1">
          {/* Added Semester */}
          <div
            className="w-full  flex flex-col bg-white border-secondary  border-[1px]  rounded-md"
            style={{
              boxShadow: "0px 0px 4px 0px rgba(0, 0, 0, 0.25)",
            }}
          >
            <div className="bg-[#e7eaff] flex gap-3 items-center rounded-t-md border-b-secondary border-[1px] py-3 px-5 text-secondary font-semibold">
              <Icon IconComponent={CalendarIcon} /> Added Semester
            </div>
            {/* Show List Of Semester */}
            <div className="flex flex-col gap-2  w-full h-[400px]  p-4  overflow-y-hidden">
              <TextInput
                leftSection={<TbSearch />}
                size="xs"
                placeholder="Year"
                value={searchValue}
                onChange={(event) => setSearchValue(event.currentTarget.value)}
                rightSectionPointerEvents="all"
              />
              {/* List of Semester */}

              <div className="flex flex-col gap-3  p-1 overflow-y-auto">
                {Object.keys(yearFilter).map((year) => (
                  <div
                    key={year}
                    className="border-[1px] rounded-md border-[#e6e6e6] bg-white overflow-clip flex flex-col w-full items-center justify-between"
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
                              <p className="font-medium text-[#4E5150] text-[12px]">
                                Year
                              </p>
                              <p className="font-semibold  text-[14px]">
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
                              className={`font-semibold  text-[14px] ${
                                semester.isActive ? "text-secondary" : ""
                              }`}
                            >
                              {semester.semester}
                            </p>
                          </div>
                          <Button
                            variant="outline"
                            className={`${
                              semester.isActive &&
                              "text-secondary bg-[#E5E8FF] px-4"
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
            leftSection={<Icon IconComponent={plus} className="h-5 w-5 -mr-1 stroke-[2px]" />}
            className="!rounded-s-[4px] font-semibold  min-w-fit !h-[36px] !w-full "
            onClick={onClickAdd}
          >
            Add Semester {selectSemester?.semester}, {selectSemester?.year}
          </Button>
        </div>
      </Modal>
      <Modal
        opened={openActivateModal}
        onClose={() => {
          setOpenActivateModal(false);
          setTextActivate("");
        }}
        closeOnClickOutside={false}
        size="47vw"
        title={`Activate semester ${activateSemester?.semester}/${activateSemester?.year}`}
        transitionProps={{ transition: "pop" }}
        centered
      >
        <Alert
          variant="light"
          color="red"
          title={`After you activate semester ${activateSemester?.semester}/${activateSemester?.year}, semester ${academicYear?.semester}/${academicYear?.year} cannot be reactivated. This means that instructor can't make any changes to them courses for that semester.  `}
         icon={<Icon IconComponent={exclamationCircle} className="size-6" />}
        
          className="mb-5"
        ></Alert>
        <TextInput
          label={`To confirm, type "semester${activateSemester?.semester}year${activateSemester?.year}" in the box below`}
          value={textActivate}
          classNames={{ label: "select-none" }}
          onChange={(event) => setTextActivate(event.target.value)}
        ></TextInput>
        <Button
          disabled={
            !isEqual(
              `semester${activateSemester?.semester}year${activateSemester?.year}`,
              textActivate
            )
          }
          onClick={() => onClickActivate(activateSemester!)}
          className="mt-4 min-w-fit !h-[36px] !w-full"
        >
          Activate this semester
        </Button>
      </Modal>
    </>
  );
}
