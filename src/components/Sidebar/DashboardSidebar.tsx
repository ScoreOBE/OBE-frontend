import { useEffect, useState } from "react";
import { Button, Modal, Select, Tooltip } from "@mantine/core";
import { useAppDispatch, useAppSelector } from "@/store";
import Icon from "@/components/Icon";
import IconCalendar from "@/assets/icons/calendar.svg?react";
import { HiOutlineBookOpen } from "react-icons/hi";
import { IModelAcademicYear } from "@/models/ModelAcademicYear";
import { AcademicYearRequestDTO } from "@/services/academicYear/dto/academicYear.dto";
import { getAcademicYear } from "@/services/academicYear/academicYear.service";
import { setAcademicYear } from "@/store/academicYear";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { ROUTE_PATH } from "@/helpers/constants/route";
import IconSO from "@/assets/icons/SO.svg?react";
import IconTQF from "@/assets/icons/TQF.svg?react";
import IconBooks from "@/assets/icons/books.svg?react";
import IconCLO from "@/assets/icons/targetArrow.svg?react";
import IconSpiderChart from "@/assets/icons/spiderChart.svg?react";
import { ROLE } from "@/helpers/constants/enum";
import { RxDashboard } from "react-icons/rx";
import { isMobile } from "@/helpers/functions/function";

export default function DashboardSidebar() {
  const path = useLocation().pathname;
  const [params, setParams] = useSearchParams();
  const navigate = useNavigate();
  const openSidebar = useAppSelector((state) => state.config.openSidebar);
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
    if (
      academicYear.length &&
      !params.get("year") &&
      !params.get("semester") &&
      !selectedTerm
    ) {
      setTerm(academicYear[0]);
    }
  }, [user, academicYear]);

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
          if (
            ![ROUTE_PATH.STD_DASHBOARD, ROUTE_PATH.COURSE_SYLLABUS].some((e) =>
              path.includes(e)
            )
          ) {
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
  };

  const gotoPage = (newPath: string) => {
    navigate({
      pathname: path.replace(path.split("/")[2], newPath),
      search: "?" + params.toString(),
    });
  };

  const stdGotoPage = (prefix: string, next: string = "") => {
    navigate({
      pathname: `${prefix}${next}`,
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
      <div className="flex text-white flex-col gap-11  acerSwift:max-macair133:gap-9">
        {openSidebar && user.id && (
          <div className="text-sm acerSwift:max-macair133:text-b4 flex flex-col gap-[6px]">
            <p className="font-semibold">Welcome to ScoreOBE+</p>

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
        )}

        <div className="flex flex-col w-full justify-center items-center gap-3">
          {openSidebar && (
            <p
              className={`text-b2 acerSwift:max-macair133:text-b3 font-semibold ${
                openSidebar ? "w-full" : ""
              }`}
            >
              Course
            </p>
          )}
          <Tooltip
            transitionProps={{ transition: "fade-right", duration: 200 }}
            classNames={{
              tooltip:
                "font-semibold text-[15px] py-2 bg-default stroke-default border-default",
            }}
            label="Semester"
            position="right-end"
            withArrow
            arrowPosition="side"
            arrowOffset={15}
            arrowSize={10}
            opacity={openSidebar ? 0 : 1}
          >
            <Button
              className={`bg-transparent flex justify-start items-center border-none text-white transition-colors duration-300 hover:bg-[#F0F0F0] hover:text-tertiary focus:border-none ${
                openSidebar
                  ? "px-3 py-1 !w-full !h-[50px]"
                  : "!rounded-full !h-fit !w-fit p-2"
              }`}
              leftSection={
                openSidebar && (
                  <Icon className="-mt-4 mr-1" IconComponent={IconCalendar} />
                )
              }
              variant="default"
              onClick={() => setOpenFilterTerm(true)}
            >
              {openSidebar ? (
                <div className="flex flex-col justify-start items-start gap-[7px]">
                  <p className="font-medium text-b2  acerSwift:max-macair133:text-b3">
                    Semester
                  </p>
                  <p className="font-normal text-b4  acerSwift:max-macair133:text-b5">
                    Course (
                    {`${params.get("semester") || ""}/${
                      params.get("year")?.slice(-2) || ""
                    }`}
                    )
                  </p>
                </div>
              ) : (
                <Icon className="size-5" IconComponent={IconCalendar} />
              )}
            </Button>
          </Tooltip>
        </div>

        {path.includes(ROUTE_PATH.ADMIN_DASHBOARD) && (
          <div className="flex flex-col w-full justify-center items-center gap-3">
            {openSidebar && (
              <p
                className={`text-b2 font-semibold ${
                  openSidebar ? "w-full" : ""
                }`}
              >
                Menu
              </p>
            )}
            <div
              className={`flex flex-col w-full justify-center items-center ${
                openSidebar ? "gap-2" : "gap-3"
              }`}
            >
              <Tooltip
                transitionProps={{
                  transition: "fade-right",
                  duration: 200,
                }}
                classNames={{
                  tooltip:
                    "font-semibold text-[15px] py-2 bg-default stroke-default border-default",
                }}
                label="TQF"
                position="right-end"
                withArrow
                arrowPosition="side"
                arrowOffset={15}
                arrowSize={10}
                opacity={openSidebar ? 0 : 1}
              >
                <Button
                  onClick={() => gotoPage(ROUTE_PATH.TQF)}
                  leftSection={
                    openSidebar && (
                      <Icon
                        className=" size-4 mr-[5px]"
                        IconComponent={IconTQF}
                      />
                    )
                  }
                  className={`!text-[13px] flex justify-start items-center transition-colors duration-300 focus:border-none group
              ${
                path.includes(ROUTE_PATH.TQF)
                  ? "bg-[#F0F0F0] text-primary hover:bg-[#F0F0F0] hover:text-primary"
                  : "text-white bg-transparent hover:text-tertiary hover:bg-[#F0F0F0]"
              } ${openSidebar ? "!w-full" : "!rounded-full !h-fit !w-fit p-2"}`}
                >
                  {openSidebar ? (
                    "TQF"
                  ) : (
                    <Icon className="size-4" IconComponent={IconTQF} />
                  )}
                </Button>
              </Tooltip>
              <Tooltip
                transitionProps={{
                  transition: "fade-right",
                  duration: 200,
                }}
                classNames={{
                  tooltip:
                    "font-semibold text-[15px] py-2 bg-default stroke-default border-default",
                }}
                label="CLO"
                position="right-end"
                withArrow
                arrowPosition="side"
                arrowOffset={15}
                arrowSize={10}
                opacity={openSidebar ? 0 : 1}
              >
                <Button
                  onClick={() => gotoPage(ROUTE_PATH.CLO)}
                  leftSection={
                    openSidebar && (
                      <Icon
                        IconComponent={IconCLO}
                        className=" size-[21px] mr-[1px] -translate-x-[2px]"
                      />
                    )
                  }
                  className={`!text-[13px] flex justify-start items-center transition-colors duration-300 focus:border-none group
                 ${
                   path.includes(ROUTE_PATH.CLO)
                     ? "bg-[#F0F0F0] text-primary hover:bg-[#F0F0F0] hover:text-primary"
                     : "text-white bg-transparent hover:text-tertiary hover:bg-[#F0F0F0]"
                 } ${
                    openSidebar ? "!w-full" : "!rounded-full !h-fit !w-fit p-2"
                  }`}
                >
                  {openSidebar ? (
                    "CLO"
                  ) : (
                    <Icon IconComponent={IconCLO} className="size-[21px]" />
                  )}
                </Button>
              </Tooltip>
              <Tooltip
                transitionProps={{
                  transition: "fade-right",
                  duration: 200,
                }}
                classNames={{
                  tooltip:
                    "font-semibold text-[15px] py-2 bg-default stroke-default border-default",
                }}
                label="PLO"
                position="right-end"
                withArrow
                arrowPosition="side"
                arrowOffset={15}
                arrowSize={10}
                opacity={openSidebar ? 0 : 1}
              >
                <Button
                  onClick={() => gotoPage(ROUTE_PATH.PLO)}
                  leftSection={
                    openSidebar && (
                      <Icon IconComponent={IconSO} className=" size-[18px]" />
                    )
                  }
                  className={`!text-[13px] flex justify-start items-center transition-colors duration-300 focus:border-none group
                 ${
                   path.includes(ROUTE_PATH.PLO)
                     ? "bg-[#F0F0F0] text-primary hover:bg-[#F0F0F0] hover:text-primary"
                     : "text-white bg-transparent hover:text-tertiary hover:bg-[#F0F0F0]"
                 } ${
                    openSidebar ? "!w-full" : "!rounded-full !h-fit !w-fit p-2"
                  }`}
                >
                  {openSidebar ? (
                    <p className="pl-1">PLO</p>
                  ) : (
                    <Icon IconComponent={IconSO} className="size-[18px]" />
                  )}
                </Button>
              </Tooltip>
            </div>
          </div>
        )}
        {[ROUTE_PATH.STD_DASHBOARD, ROUTE_PATH.COURSE_SYLLABUS].some((e) =>
          path.includes(e)
        ) && (
          <div className="flex flex-col w-full justify-center items-center gap-3">
            {openSidebar && user.id && (
              <p
                className={`text-b2 font-semibold ${
                  openSidebar ? "w-full" : ""
                }`}
              >
                Menu
              </p>
            )}
            <div
              className={`flex flex-col w-full justify-center items-center ${
                openSidebar ? "gap-2" : "gap-3"
              }`}
            >
              {user.id && (
                <Tooltip
                  transitionProps={{
                    transition: "fade-right",
                    duration: 200,
                  }}
                  classNames={{
                    tooltip:
                      "font-semibold text-[15px] py-2 bg-default stroke-default border-default",
                  }}
                  label="Dashboard"
                  position="right-end"
                  withArrow
                  arrowPosition="side"
                  arrowOffset={15}
                  arrowSize={10}
                  opacity={openSidebar ? 0 : 1}
                >
                  <Button
                    onClick={() => stdGotoPage(ROUTE_PATH.STD_DASHBOARD, "")}
                    leftSection={openSidebar && <RxDashboard size={18} />}
                    className={`!text-[13px] flex justify-start items-center transition-colors duration-300 focus:border-none ${
                      ![ROUTE_PATH.PLO, ROUTE_PATH.COURSE_SYLLABUS].some((e) =>
                        path.includes(e)
                      )
                        ? "bg-[#F0F0F0] text-primary hover:bg-[#F0F0F0] hover:text-primary"
                        : "text-white bg-transparent hover:text-tertiary hover:bg-[#F0F0F0]"
                    } ${
                      openSidebar
                        ? "!w-full"
                        : "!rounded-full !h-fit !w-fit p-2"
                    }`}
                  >
                    {openSidebar ? "Dashboard" : <RxDashboard size={20} />}
                  </Button>
                </Tooltip>
              )}
              { user.id && (
                <Tooltip
                  transitionProps={{
                    transition: "fade-right",
                    duration: 200,
                  }}
                  classNames={{
                    tooltip:
                      "font-semibold text-[15px] py-2 bg-default stroke-default border-default",
                  }}
                  label="Course Syllabus"
                  position="right-end"
                  withArrow
                  arrowPosition="side"
                  arrowOffset={15}
                  arrowSize={10}
                  opacity={openSidebar ? 0 : 1}
                >
                  <Button
                    onClick={() => stdGotoPage(ROUTE_PATH.COURSE_SYLLABUS)}
                    leftSection={openSidebar && <Icon IconComponent={IconBooks} className=" stroke-[1.3px] size-[22px] -ml-[2px]" />}
                    className={`!text-[13px] flex justify-start items-center transition-colors duration-300 focus:border-none ${
                      path.includes(ROUTE_PATH.COURSE_SYLLABUS)
                        ? "bg-[#F0F0F0] text-primary hover:bg-[#F0F0F0] hover:text-primary"
                        : "text-white bg-transparent hover:text-tertiary hover:bg-[#F0F0F0]"
                    } ${
                      openSidebar
                        ? "!w-full"
                        : "!rounded-full !h-fit !w-fit p-2"
                    }`}
                  >
                    {openSidebar ? (
                      "Course Spec"
                    ) : (
                      <Icon IconComponent={IconBooks} className="stroke-[1.3px] size-[22px]"/>
                    )}
                  </Button>
                </Tooltip>
              )}
              {user.id && (
                <Tooltip
                  transitionProps={{
                    transition: "fade-right",
                    duration: 200,
                  }}
                  classNames={{
                    tooltip:
                      "font-semibold text-[15px] py-2 bg-default stroke-default border-default",
                  }}
                  label="Overall PLO"
                  position="right-end"
                  withArrow
                  arrowPosition="side"
                  arrowOffset={15}
                  arrowSize={10}
                  opacity={openSidebar ? 0 : 1}
                >
                  <Button
                    onClick={() =>
                      stdGotoPage(
                        ROUTE_PATH.STD_DASHBOARD,
                        `/${ROUTE_PATH.PLO}`
                      )
                    }
                    leftSection={
                      openSidebar && (
                        <Icon
                          IconComponent={IconSpiderChart}
                          className="size-[18px] -translate-x-[1px] stroke-1"
                        />
                      )
                    }
                    className={`!text-[13px] flex justify-start items-center transition-colors duration-300 focus:border-none ${
                      path.includes(ROUTE_PATH.PLO)
                        ? "bg-[#F0F0F0] text-primary hover:bg-[#F0F0F0] hover:text-primary"
                        : "text-white bg-transparent hover:text-tertiary hover:bg-[#F0F0F0]"
                    } ${
                      openSidebar
                        ? "!w-full"
                        : "!rounded-full !h-fit !w-fit p-2"
                    }`}
                  >
                    {openSidebar ? (
                      "Overall PLO"
                    ) : (
                      <Icon
                        IconComponent={IconSpiderChart}
                        className="size-5 stroke-1"
                      />
                    )}
                  </Button>
                </Tooltip>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
