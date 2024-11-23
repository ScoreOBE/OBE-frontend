import { useEffect, useState } from "react";
import { Button, Modal, Select } from "@mantine/core";
import { useAppDispatch, useAppSelector } from "@/store";
import Icon from "@/components/Icon";
import IconCalendar from "@/assets/icons/calendar.svg?react";
import { IModelAcademicYear } from "@/models/ModelAcademicYear";
import { AcademicYearRequestDTO } from "@/services/academicYear/dto/academicYear.dto";
import { getAcademicYear } from "@/services/academicYear/academicYear.service";
import { setAcademicYear } from "@/store/academicYear";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { getCourse } from "@/services/course/course.service";
import { CourseRequestDTO } from "@/services/course/dto/course.dto";
import { setCourseList } from "@/store/course";
import { setLoading } from "@/store/loading";
import { ROUTE_PATH } from "@/helpers/constants/route";
import { setAllCourseList } from "@/store/allCourse";
import IconSO from "@/assets/icons/SO.svg?react";
import IconTQF from "@/assets/icons/TQF.svg?react";
import IconCLO from "@/assets/icons/targetArrow.svg?react";
import IconSpiderChart from "@/assets/icons/spiderChart.svg?react";
import { ROLE } from "@/helpers/constants/enum";
import { RxDashboard } from "react-icons/rx";
import { getEnrollCourse } from "@/services/student/student.service";
import { setEnrollCourseList } from "@/store/enrollCourse";

export default function DashboardSidebar() {
  const path = useLocation().pathname;
  const [params, setParams] = useSearchParams();
  const navigate = useNavigate();
  const user = useAppSelector((state) => state.user);
  const academicYear = useAppSelector((state) => state.academicYear);
  const dispatch = useAppDispatch();
  const termOption = academicYear.map((e) => {
    return `${e.semester}/${e.year}`;
  });
  const [openFilterTerm, setOpenFilterTerm] = useState(false);
  const checkAcademic = (term: string, data?: IModelAcademicYear) => {
    return (
      term.split("/")[0] ==
        (data ? data.semester.toString() : params.get("semester")) &&
      term.split("/")[1] == (data ? data.year.toString() : params.get("year"))
    );
  };
  const [selectedTerm, setSelectedTerm] = useState<any>(
    termOption.find((term) => checkAcademic(term))
  );

  useEffect(() => {
    if (!user.termsOfService) return;
    if (
      academicYear.length &&
      !params.get("year") &&
      !params.get("semester") &&
      !selectedTerm
    ) {
      setTerm(academicYear[0]);
    } else if (!academicYear.length) {
      fetchAcademicYear();
    }
  }, [user.termsOfService, academicYear]);

  useEffect(() => {
    if (user.termsOfService) {
      switch (user.role) {
        case ROLE.INSTRUCTOR:
          if (path.includes(ROUTE_PATH.ADMIN_DASHBOARD)) {
            navigate({
              pathname: ROUTE_PATH.INS_DASHBOARD,
              search: "?" + params.toString(),
            });
          }
          break;
        case ROLE.STUDENT:
          if (!path.includes(ROUTE_PATH.STD_DASHBOARD)) {
            navigate({
              pathname: ROUTE_PATH.STD_DASHBOARD,
              search: "?" + params.toString(),
            });
          }
          break;
      }
    }
  }, [user, path]);

  useEffect(() => {
    if (
      termOption &&
      params.get("year") &&
      params.get("semester") &&
      !selectedTerm
    ) {
      setSelectedTerm(termOption.find((term) => checkAcademic(term)));
    }
  }, [termOption, params]);

  useEffect(() => {
    if (!openFilterTerm) {
      setSelectedTerm(termOption.find((term) => checkAcademic(term)));
    }
  }, [openFilterTerm]);

  const fetchCourse = async (year: number, semester: number) => {
    dispatch(setLoading(true));
    if (user.role != ROLE.STUDENT) {
      const payloadCourse = new CourseRequestDTO();
      const res = await getCourse({
        ...payloadCourse,
        year,
        semester,
        manage: path.includes(ROUTE_PATH.ADMIN_DASHBOARD),
      });
      if (res) {
        if (path.includes(ROUTE_PATH.ADMIN_DASHBOARD)) {
          dispatch(setAllCourseList(res));
        } else {
          dispatch(setCourseList(res));
        }
      }
    }
    if (user.studentId) {
      const res = await getEnrollCourse({ year, semester });
      if (res) {
        dispatch(setEnrollCourseList(res));
      }
    }
    dispatch(setLoading(false));
  };

  const fetchAcademicYear = async () => {
    const res = await getAcademicYear(new AcademicYearRequestDTO());
    if (res) {
      dispatch(setAcademicYear(res));
      if (!params.get("year") && !params.get("semester") && !selectedTerm) {
        setTerm(res[0]);
      }
    }
  };

  const setTerm = (data: IModelAcademicYear) => {
    setParams({
      year: data.year.toString(),
      semester: data.semester.toString(),
    });
    setSelectedTerm(termOption.find((term) => checkAcademic(term, data)));
  };

  const confirmFilterTerm = async () => {
    setOpenFilterTerm(false);
    const term = academicYear.find((e) => checkAcademic(selectedTerm, e))!;
    setTerm(term);
    fetchCourse(term.year, term.semester);
  };

  const gotoPage = (newPath: string) => {
    navigate({
      pathname: path.replace(path.split("/")[2], newPath),
      search: "?" + params.toString(),
    });
  };

  const stdGotoPage = (next: string) => {
    navigate({
      pathname: `${path.split("/")[1]}${next}`,
      search: "?" + params.toString(),
    });
  };

  return (
    <>
      <Modal
        opened={openFilterTerm}
        onClose={() => setOpenFilterTerm(false)}
        title="Filter"
        size="400px"
        centered
        transitionProps={{ transition: "pop" }}
      >
        <Select
          label="Semester"
          data={termOption}
          value={selectedTerm}
          onChange={setSelectedTerm}
          allowDeselect={false}
          withCheckIcon={false}
          className="mb-7 w-1/2"
          classNames={{
            label: "font-medium mb-1",
            input: "text-primary font-medium",
            option: "hover:bg-[#DDDDF6] text-primary font-medium",
          }}
        />
        <Button className="!w-full" onClick={() => confirmFilterTerm()}>
          OK
        </Button>
      </Modal>
      <div className="flex text-white flex-col gap-11">
        <div className="text-sm flex flex-col gap-[6px]">
          <p className="font-semibold">Welcome to ScoreOBE +</p>
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
          <p className="text-b2 font-semibold">Course</p>
          <Button
            className="bg-transparent !w-full !h-[50px] flex justify-start items-center px-3 py-1 border-none text-white transition-colors duration-300 hover:bg-[#F0F0F0] hover:text-tertiary focus:border-none group"
            leftSection={
              <Icon className="-mt-4 mr-1" IconComponent={IconCalendar} />
            }
            variant="default"
            onClick={() => setOpenFilterTerm(true)}
          >
            <div className="flex flex-col justify-start items-start gap-[7px]">
              <p className="font-medium text-[14px]">Semester</p>
              <p className="font-normal text-[12px]">
                Course (
                {`${params.get("semester") || ""}/${
                  params.get("year")?.slice(-2) || ""
                }`}
                )
              </p>
            </div>
          </Button>
        </div>

        {path.includes(ROUTE_PATH.ADMIN_DASHBOARD) && (
          <div className="flex flex-col gap-3">
            <p className="text-b2 font-semibold">Menu</p>
            <div className="flex flex-col gap-2">
              <Button
                onClick={() => gotoPage(ROUTE_PATH.TQF)}
                leftSection={
                  <Icon className=" size-4 mr-[5px]" IconComponent={IconTQF} />
                }
                className={`!w-full !text-[13px] flex justify-start items-center transition-colors duration-300 focus:border-none group
              ${
                path.includes(ROUTE_PATH.TQF)
                  ? "bg-[#F0F0F0] text-primary hover:bg-[#F0F0F0] hover:text-primary"
                  : "text-white bg-transparent hover:text-tertiary hover:bg-[#F0F0F0]"
              }`}
              >
                TQF
              </Button>
              <Button
                onClick={() => gotoPage(ROUTE_PATH.CLO)}
                leftSection={
                  <Icon
                    IconComponent={IconCLO}
                    className=" size-[21px] mr-[1px] -translate-x-[2px]"
                  />
                }
                className={`!w-full !text-[13px] flex justify-start items-center transition-colors duration-300 focus:border-none group
                 ${
                   path.includes(ROUTE_PATH.CLO)
                     ? "bg-[#F0F0F0] text-primary hover:bg-[#F0F0F0] hover:text-primary"
                     : "text-white bg-transparent hover:text-tertiary hover:bg-[#F0F0F0]"
                 }`}
              >
                <p>CLO</p>
              </Button>
              <Button
                onClick={() => gotoPage(ROUTE_PATH.PLO)}
                leftSection={
                  <Icon IconComponent={IconSO} className=" size-[18px]" />
                }
                className={`!w-full !text-[13px] flex justify-start items-center transition-colors duration-300 focus:border-none group
                 ${
                   path.includes(ROUTE_PATH.PLO)
                     ? "bg-[#F0F0F0] text-primary hover:bg-[#F0F0F0] hover:text-primary"
                     : "text-white bg-transparent hover:text-tertiary hover:bg-[#F0F0F0]"
                 }`}
              >
                <p className="pl-1">PLO</p>
              </Button>
            </div>
          </div>
        )}
        {path.includes(ROUTE_PATH.STD_DASHBOARD) && (
          <div className="flex flex-col gap-3">
            <p className="text-b2 font-semibold">Menu</p>
            <div className="flex flex-col gap-2">
              <Button
                onClick={() => stdGotoPage("")}
                leftSection={<RxDashboard size={18} />}
                className={`!w-full !text-[13px] flex justify-start items-center transition-colors duration-300 focus:border-none group ${
                  !path.includes(ROUTE_PATH.PLO)
                    ? "bg-[#F0F0F0] text-primary hover:bg-[#F0F0F0] hover:text-primary"
                    : "text-white bg-transparent hover:text-tertiary hover:bg-[#F0F0F0]"
                }`}
              >
                Dashboard
              </Button>
              <Button
                onClick={() => stdGotoPage(`/${ROUTE_PATH.PLO}`)}
                leftSection={
                  <Icon
                    IconComponent={IconSpiderChart}
                    className="size-[18px] -translate-x-[1px] stroke-1"
                  />
                }
                className={`!w-full !text-[13px] flex justify-start items-center transition-colors duration-300 focus:border-none group ${
                  path.includes(ROUTE_PATH.PLO)
                    ? "bg-[#F0F0F0] text-primary hover:bg-[#F0F0F0] hover:text-primary"
                    : "text-white bg-transparent hover:text-tertiary hover:bg-[#F0F0F0]"
                }`}
              >
                <p className="">Overall PLO</p>
              </Button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
