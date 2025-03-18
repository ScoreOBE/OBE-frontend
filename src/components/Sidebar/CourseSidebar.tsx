import { useEffect, useState } from "react";
import {
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import { Alert, Button, Menu, Tooltip } from "@mantine/core";
import store, { useAppDispatch, useAppSelector } from "@/store";
import { RxDashboard } from "react-icons/rx";
import { ROUTE_PATH } from "@/helpers/constants/route";
import Icon from "@/components/Icon";
import IconLogout from "@/assets/icons/logout.svg?react";
import IconTQF3 from "@/assets/icons/TQF3.svg?react";
import IconTQF5 from "@/assets/icons/TQF5.svg?react";
import IconTQF from "@/assets/icons/TQF.svg?react";
import IconStudent from "@/assets/icons/student.svg?react";
import IconChevronLeft from "@/assets/icons/chevronLeft.svg?react";
import IconExclamationCircle from "@/assets/icons/exclamationCircle.svg?react";
import IconSkills from "@/assets/icons/briftcase.svg?react";
import IconChevronRight from "@/assets/icons/chevronRight.svg?react";
import { IModelUser } from "@/models/ModelUser";
import { getUserName, isMobile, sortData } from "@/helpers/functions/function";
import MainPopup from "../Popup/MainPopup";
import { COURSE_TYPE, ROLE } from "@/helpers/constants/enum";
import { getOneCourse } from "@/services/course/course.service";
import { resetDataTQF3, setSelectTqf3Topic } from "@/store/tqf3";
import { IModelTQF3 } from "@/models/ModelTQF3";
import { IModelSection } from "@/models/ModelCourse";
import { isEmpty, isEqual } from "lodash";
import { initialTqf3Part } from "@/helpers/functions/tqf3";
import { resetDataTQF5, setSelectTqf5Topic } from "@/store/tqf5";
import { IModelPLORequire } from "@/models/ModelCourseManagement";
import { setCourseList } from "@/store/course";

type Props = {
  onClickLeaveCourse: () => void;
};

export default function CourseSidebar({ onClickLeaveCourse }: Props) {
  const navigate = useNavigate();
  const { courseNo } = useParams();
  const [params, setParams] = useSearchParams();
  const path = useLocation().pathname;
  const prefix = `${ROUTE_PATH.COURSE}/${courseNo}`;
  const openSidebar = useAppSelector((state) => state.config.openSidebar);
  const user = useAppSelector((state) => state.user);
  const dashboard = useAppSelector((state) => state.config.dashboard);
  const course = useAppSelector((state) =>
    dashboard == ROLE.CURRICULUM_ADMIN
      ? state.allCourse.courses.find((e) => e.courseNo == courseNo)
      : state.course.courses.find((e) => e.courseNo == courseNo)
  );
  const dispatch = useAppDispatch();
  const [instructors, setInstructors] = useState<IModelUser[]>([]);
  const [coInstructors, setCoInstructors] = useState<IModelUser[]>([]);
  const [uniqTopic, setUniqTopic] = useState<string[]>([]);
  const tqf3 = useAppSelector((state) => state.tqf3);
  const tqf5 = useAppSelector((state) => state.tqf5);
  const [openAlertPopup, setOpenAlertPopup] = useState(false);
  const [tqf3Original, setTqf3Original] = useState<
    Partial<IModelTQF3> & { topic?: string; ploRequired?: IModelPLORequire[] }
  >();

  useEffect(() => {
    if (
      !course &&
      courseNo &&
      path.includes(ROUTE_PATH.COURSE) &&
      !path.includes(ROUTE_PATH.COURSE_SYLLABUS)
    ) {
      fetchOneCourse();
    }
  }, [courseNo]);

  useEffect(() => {
    if (course) {
      const temp: string[] = [];
      course.sections?.filter((sec) => {
        if (sec.topic && !temp.includes(sec.topic)) {
          temp.push(sec.topic);
        }
      });
      setUniqTopic(temp);
      if (!tqf3.topic || !temp.includes(tqf3.topic)) {
        dispatch(setSelectTqf3Topic(temp[0]));
      }
      if (!tqf5.topic || !temp.includes(tqf5.topic)) {
        dispatch(setSelectTqf5Topic(temp[0]));
      }
      const insList: any[] = [];
      const coInsList: any[] = [];
      course.sections.forEach((e: any) => {
        if (!insList.some((p: any) => p.id === e.instructor.id)) {
          insList.push({ ...e.instructor });
        }
      });
      course.sections.forEach((e: any) => {
        e.coInstructors.forEach((p: any) => {
          if (
            !insList.some((ins: any) => ins.id === p.id) &&
            !coInsList.some((coIns: any) => coIns.id === p.id)
          ) {
            coInsList.push({ ...p });
          }
        });
      });
      sortData(insList, "firstNameEN", "string");
      sortData(coInsList, "firstNameEN", "string");
      setInstructors(insList);
      setCoInstructors(coInsList);
    } else if (
      (store.getState().course.courses.length ||
        store.getState().allCourse.courses.length) &&
      !course
    ) {
      navigate(`${ROUTE_PATH.INS_DASHBOARD}?${params.toString()}`);
    }
  }, [course]);

  const fetchOneCourse = async () => {
    const res = await getOneCourse({
      year: params.get("year"),
      semester: params.get("semester"),
      courseNo,
    });
    if (res) {
      dispatch(setCourseList({ courses: [{ ...res }] }));
    }
  };

  const goToPage = (pathname: string, back?: boolean) => {
    navigate({
      pathname: back ? pathname : `${prefix}/${pathname}`,
      search: "?" + params.toString(),
    });
  };

  const fetchTqf3 = async () => {
    const resCourse = await getOneCourse({
      year: params.get("year"),
      semester: params.get("semester"),
      courseNo,
    });
    if (resCourse) {
      if (resCourse.type == COURSE_TYPE.SEL_TOPIC.en) {
        const sectionTdf3 = resCourse.sections.find(
          (sec: IModelSection) => sec.topic == tqf3.topic
        )?.TQF3;
        setTqf3Original({
          topic: tqf3.topic,
          ...sectionTdf3,
        });
      } else {
        setTqf3Original({
          topic: tqf3.topic,
          ...resCourse.TQF3!,
        });
      }
    }
  };

  useEffect(() => {
    const changePart: string[] = [];
    if (tqf3Original) {
      for (let i = 1; i <= 7; i++) {
        const part = `part${i}` as keyof IModelTQF3;
        if (
          !isEmpty(tqf3[part]) &&
          ((isEmpty(tqf3Original[part]) &&
            !isEqual(tqf3[part], initialTqf3Part(tqf3, part))) ||
            (tqf3Original[part] && !isEqual(tqf3Original[part], tqf3[part])))
        ) {
          changePart.push(part);
        }
      }
      if (changePart.length && tqf3.id) {
        setOpenAlertPopup(true);
      } else {
        dispatch(resetDataTQF3());
        dispatch(resetDataTQF5());
        goToPage(
          dashboard == ROLE.CURRICULUM_ADMIN
            ? `${ROUTE_PATH.ADMIN_DASHBOARD}/${ROUTE_PATH.TQF}`
            : ROUTE_PATH.INS_DASHBOARD,
          true
        );
      }
    }
  }, [tqf3Original]);

  return (
    <>
      <MainPopup
        opened={openAlertPopup}
        onClose={() => setOpenAlertPopup(false)}
        action={() => {
          dispatch(resetDataTQF3());
          dispatch(resetDataTQF5());
          setOpenAlertPopup(false);
          goToPage(
            dashboard == ROLE.CURRICULUM_ADMIN
              ? `${ROUTE_PATH.ADMIN_DASHBOARD}/${ROUTE_PATH.TQF}`
              : ROUTE_PATH.INS_DASHBOARD,
            true
          );
        }}
        type="unsaved"
        labelButtonRight={`Keep editing`}
        labelButtonLeft="Leave without saving"
        title={`TQF 3 unsaved changes?`}
        message={
          <>
            <Alert
              variant="light"
              color="red"
              title={`You have unsaved changes. If you leave now, these changes will be lost.`}
              icon={<Icon IconComponent={IconExclamationCircle} />}
              classNames={{ icon: "size-6" }}
            ></Alert>
          </>
        }
      />
      <div
        className={`flex text-white flex-col h-full gap-[26px] acerSwift:max-macair133:gap-6 ${
          openSidebar ? "" : "items-center"
        }`}
      >
        <Tooltip
          transitionProps={{ transition: "fade-right", duration: 200 }}
          classNames={{
            tooltip:
              "font-semibold text-[15px] py-2 bg-default stroke-default border-default",
          }}
          label={`Back to ${
            dashboard === ROLE.CURRICULUM_ADMIN
              ? "Curriculum Admin Dashboard"
              : "Your Courses"
          }`}
          position="right-end"
          withArrow
          arrowPosition="side"
          arrowOffset={15}
          arrowSize={10}
          opacity={openSidebar ? 0 : 1}
        >
          <div
            className={`w-fit hover:underline cursor-pointer font-bold gap-2 text-b3 acerSwift:max-macair133:text-b4 flex ${
              openSidebar
                ? "justify-start -translate-x-[5px]"
                : "p-1 justify-center items-center rounded-full text-white hover:bg-white hover:text-black"
            }`}
            onClick={() => fetchTqf3()}
          >
            <Icon
              IconComponent={IconChevronLeft}
              className={`${
                openSidebar ? "size-5 acerSwift:max-macair133:size-4" : ""
              }`}
            />
            {openSidebar &&
              `Back to ${
                dashboard == ROLE.CURRICULUM_ADMIN
                  ? "Curriculum Admin Dashboard"
                  : "Your Courses"
              }`}
          </div>
        </Tooltip>

        <div className="flex flex-col w-full gap-5 ">
          {openSidebar && (
            <div className="flex flex-col flex-1 font-bold gap-1 ">
              <p className="text-lg acerSwift:max-macair133:!text-b1">
                {course?.courseNo} ({params.get("semester")}/
                {params.get("year")?.slice(-2)})
              </p>
              <p className="text-b3 acerSwift:max-macair133:!text-b4 font-semibold text-pretty max-w-full acerSwift:max-macair133:max-w-[160px]">
                {course?.courseName}
              </p>
            </div>
          )}
          <div
            className={`flex flex-col ${
              openSidebar
                ? "gap-2"
                : "gap-3 w-full justify-center items-center text-center"
            }`}
          >
            {dashboard == ROLE.INSTRUCTOR && (
              <Tooltip
                transitionProps={{
                  transition: "fade-right",
                  duration: 200,
                }}
                classNames={{
                  tooltip:
                    " font-semibold text-[15px] py-2 bg-default stroke-default border-default",
                }}
                label="Scores"
                position="right-end"
                withArrow
                arrowPosition="side"
                arrowOffset={15}
                arrowSize={10}
                opacity={openSidebar ? 0 : 1}
              >
                <Button
                  onClick={() => goToPage(ROUTE_PATH.EVALUATION)}
                  leftSection={
                    openSidebar && (
                      <Icon
                        IconComponent={IconTQF}
                        className="mr-0.5 acerSwift:max-macair133:!size-4"
                      />
                    )
                  }
                  className={`!text-b3 acerSwift:max-macair133:!text-b4 acerSwift:max-macair133:!h-[30px] flex justify-start items-center transition-colors duration-300 focus:border-none ${
                    path.includes(ROUTE_PATH.EVALUATION)
                      ? "bg-[#F0F0F0] text-primary hover:bg-[#F0F0F0] hover:text-primary"
                      : "text-white bg-transparent hover:text-tertiary hover:bg-[#F0F0F0]"
                  } ${
                    openSidebar ? "!w-full" : "!rounded-full !h-fit !w-fit p-2"
                  }`}
                >
                  {openSidebar ? (
                    "Scores"
                  ) : (
                    <Icon
                      IconComponent={IconTQF}
                      className="  acerSwift:max-macair133:!size-4"
                    />
                  )}
                </Button>
              </Tooltip>
            )}{" "}
            {dashboard == ROLE.INSTRUCTOR && (
              <Tooltip
                transitionProps={{
                  transition: "fade-right",
                  duration: 200,
                }}
                classNames={{
                  tooltip:
                    " font-semibold text-[15px] py-2 bg-default stroke-default border-default",
                }}
                label="Roster"
                position="right-end"
                withArrow
                arrowPosition="side"
                arrowOffset={15}
                arrowSize={10}
                opacity={openSidebar ? 0 : 1}
              >
                <Button
                  onClick={() => goToPage(ROUTE_PATH.ROSTER)}
                  leftSection={
                    openSidebar && (
                      <Icon
                        IconComponent={IconStudent}
                        className="size-[19px] stroke-1 acerSwift:max-macair133:size-4"
                      />
                    )
                  }
                  className={`!text-b3 acerSwift:max-macair133:!text-b4 acerSwift:max-macair133:!h-[30px] flex justify-start items-center transition-colors duration-300 focus:border-none ${
                    path.includes(ROUTE_PATH.ROSTER)
                      ? "bg-[#F0F0F0] text-primary hover:bg-[#F0F0F0] hover:text-primary"
                      : "text-white bg-transparent hover:text-tertiary hover:bg-[#F0F0F0]"
                  } ${
                    openSidebar ? "!w-full" : "!rounded-full !h-fit !w-fit p-2"
                  }`}
                >
                  {openSidebar ? (
                    "Roster"
                  ) : (
                    <Icon
                      IconComponent={IconStudent}
                      className="size-[19px] !stroke-[2px] acerSwift:max-macair133:size-4"
                    />
                  )}
                </Button>
              </Tooltip>
            )}
            {dashboard == ROLE.INSTRUCTOR && (
              <Tooltip
                transitionProps={{
                  transition: "fade-right",
                  duration: 200,
                }}
                classNames={{
                  tooltip:
                    " font-semibold text-[15px] py-2 bg-default stroke-default border-default",
                }}
                label="Sections"
                position="right-end"
                withArrow
                arrowPosition="side"
                arrowOffset={15}
                arrowSize={10}
                opacity={openSidebar ? 0 : 1}
              >
                <Button
                  onClick={() => goToPage(ROUTE_PATH.SECTION)}
                  leftSection={
                    openSidebar && (
                      <RxDashboard
                        size={18}
                        className="acerSwift:max-macair133:size-4"
                      />
                    )
                  }
                  className={`!text-b3 acerSwift:max-macair133:!text-b4 acerSwift:max-macair133:!h-[30px] flex justify-start items-center transition-colors duration-300 focus:border-none ${
                    path.includes(ROUTE_PATH.SECTION)
                      ? "bg-[#F0F0F0] text-primary hover:bg-[#F0F0F0] hover:text-primary"
                      : "text-white bg-transparent hover:text-tertiary hover:bg-[#F0F0F0]"
                  } ${
                    openSidebar ? "!w-full" : "!rounded-full !h-fit !w-fit p-2"
                  }`}
                >
                  {openSidebar ? (
                    "Sections"
                  ) : (
                    <RxDashboard
                      size={18}
                      className="acerSwift:max-macair133:size-4"
                    />
                  )}
                </Button>
              </Tooltip>
            )}
            {/* {dashboard == ROLE.INSTRUCTOR && (
              <Button
                onClick={() => goToPage(ROUTE_PATH.SKILLS)}
                leftSection={
                  <Icon
                    IconComponent={IconSkills}
                    className="size-[20px] stroke-[1.5px] acerSwift:max-macair133:size-4 -ml-0.5"
                  />
                }
                className={`!w-full !text-b3 acerSwift:max-macair133:!text-b4 acerSwift:max-macair133:!h-[30px] flex justify-start items-center transition-colors duration-300 focus:border-none ${
                  path.includes(ROUTE_PATH.SKILLS)
                    ? "bg-[#F0F0F0] text-primary hover:bg-[#F0F0F0] hover:text-primary"
                    : "text-white bg-transparent hover:text-tertiary hover:bg-[#F0F0F0]"
                }`}
              >
                Skills
              </Button>
            )} */}
            {user.role != ROLE.TA && (
              <>
                <Menu
                  trigger="hover"
                  openDelay={100}
                  clickOutsideEvents={["mousedown"]}
                  classNames={{ item: "text-[#3e3e3e] h-8 w-full" }}
                  position="right"
                  transitionProps={{ transition: "pop", duration: 0 }}
                >
                  <Menu.Target>
                    <Tooltip
                      transitionProps={{
                        transition: "fade-right",
                        duration: 200,
                      }}
                      classNames={{
                        tooltip:
                          " font-semibold text-[15px] py-2 bg-default stroke-default border-default",
                      }}
                      label="TQF 3"
                      position="right-end"
                      withArrow
                      arrowPosition="side"
                      arrowOffset={15}
                      arrowSize={10}
                      opacity={openSidebar ? 0 : 1}
                    >
                      <Button
                        onClick={() => {
                          goToPage(ROUTE_PATH.TQF3);
                        }}
                        leftSection={
                          openSidebar && (
                            <Icon
                              IconComponent={IconTQF3}
                              className="size-5 translate-x-[1px] acerSwift:max-macair133:size-4"
                            />
                          )
                        }
                        rightSection={
                          course?.type == COURSE_TYPE.SEL_TOPIC.en &&
                          uniqTopic.length > 1 && (
                            <Icon
                              IconComponent={IconChevronRight}
                              className={`size-5 absolute flex ${
                                openSidebar ? "right-2" : ""
                              }`}
                            />
                          )
                        }
                        className={`!text-b3 acerSwift:max-macair133:!text-b4 flex justify-start items-center transition-colors duration-300 focus:border-none ${
                          path.includes(ROUTE_PATH.TQF3)
                            ? "bg-[#F0F0F0] text-primary hover:bg-[#F0F0F0] hover:text-primary"
                            : "text-white bg-transparent hover:text-tertiary hover:bg-[#f0f0f0]"
                        } ${
                          openSidebar
                            ? "!w-full acerSwift:max-macair133:!h-[30px]"
                            : "!rounded-full !h-fit !w-fit p-2"
                        }`}
                      >
                        {openSidebar ? (
                          "Syllabus (TQF 3)"
                        ) : (
                          <Icon
                            IconComponent={IconTQF3}
                            className="size-5 translate-x-[2px] acerSwift:max-macair133:size-4"
                          />
                        )}
                      </Button>
                    </Tooltip>
                  </Menu.Target>
                  {course?.type == COURSE_TYPE.SEL_TOPIC.en &&
                    uniqTopic.length > 1 && (
                      <Menu.Dropdown
                        className="!z-50 py-2 !font-semibold max-w-fit translate-x-[22px]  bg-white"
                        style={{ boxShadow: "rgba(0, 0, 0, 0.35) 0px 2px 8px" }}
                      >
                        {uniqTopic.length > 1 && (
                          <div className="flex gap-[2px] flex-col  ">
                            <p className="my-1 text-[14px] pl-2">TQF 3</p>
                            <Menu.Divider />
                            {uniqTopic.map((topic, index) => (
                              <Menu.Item
                                key={index}
                                className="justify-between bg-transparent !max-w-full    py-4  !h-[30px] flex items-center  border-white text-default !font-extrabold transition-colors duration-300 hover:bg-[#F0F0F0] hover:text-tertiary"
                                variant="outline"
                                onClick={() => {
                                  if (topic !== tqf3.topic) {
                                    dispatch(setSelectTqf3Topic(topic));
                                  }
                                  goToPage(ROUTE_PATH.TQF3);
                                }}
                              >
                                <div className=" flex  !font-semibold  flex-col justify-start items-start gap-[7px]">
                                  <p className="text-ellipsis overflow-hidden whitespace-nowrap !font-semibold text-[12px]">
                                    {topic}
                                  </p>
                                </div>
                              </Menu.Item>
                            ))}
                          </div>
                        )}
                      </Menu.Dropdown>
                    )}
                </Menu>
                <Menu
                  trigger="hover"
                  openDelay={100}
                  clickOutsideEvents={["mousedown"]}
                  classNames={{ item: "text-[#3e3e3e] h-8 w-full" }}
                  position="right"
                  transitionProps={{ transition: "pop", duration: 0 }}
                >
                  <Menu.Target>
                    <Tooltip
                      transitionProps={{
                        transition: "fade-right",
                        duration: 200,
                      }}
                      classNames={{
                        tooltip:
                          " font-semibold text-[15px] py-2 bg-default stroke-default border-default",
                      }}
                      label="TQF 5"
                      position="right-end"
                      withArrow
                      arrowPosition="side"
                      arrowOffset={15}
                      arrowSize={10}
                      opacity={openSidebar ? 0 : 1}
                    >
                      <Button
                        onClick={() => {
                          goToPage(ROUTE_PATH.TQF5);
                        }}
                        leftSection={
                          openSidebar && (
                            <Icon
                              IconComponent={IconTQF5}
                              className="size-5 translate-x-[1px]  acerSwift:max-macair133:size-4"
                            />
                          )
                        }
                        rightSection={
                          course?.type == COURSE_TYPE.SEL_TOPIC.en &&
                          uniqTopic.length > 1 && (
                            <Icon
                              IconComponent={IconChevronRight}
                              className={`size-5 absolute flex acerSwift:max-macair133:size-4 ${
                                openSidebar ? "right-2" : ""
                              }`}
                            />
                          )
                        }
                        className={`!text-b3 acerSwift:max-macair133:!text-b4 mb-1 flex justify-start items-center transition-colors duration-300 focus:border-none group ${
                          path.includes(ROUTE_PATH.TQF5)
                            ? "bg-[#F0F0F0] text-primary hover:bg-[#F0F0F0] hover:text-primary"
                            : "text-white bg-transparent hover:text-tertiary hover:bg-[#F0F0F0]"
                        } ${
                          openSidebar
                            ? "!w-full acerSwift:max-macair133:!h-[30px]"
                            : "!rounded-full !h-fit !w-fit p-2"
                        }`}
                      >
                        {openSidebar ? (
                          "Evaluation (TQF 5)"
                        ) : (
                          <Icon
                            IconComponent={IconTQF5}
                            className="size-5 translate-x-[2px] acerSwift:max-macair133:size-4"
                          />
                        )}
                      </Button>
                    </Tooltip>
                  </Menu.Target>
                  {course?.type == COURSE_TYPE.SEL_TOPIC.en &&
                    uniqTopic.length > 1 && (
                      <Menu.Dropdown
                        className="!z-50 py-2 !font-semibold max-w-fit translate-x-[22px] bg-white"
                        style={{ boxShadow: "rgba(0, 0, 0, 0.35) 0px 2px 8px" }}
                      >
                        {uniqTopic.length > 1 && (
                          <div className="flex gap-[2px] flex-col  ">
                            <p className="my-1 text-[14px] pl-2">TQF 5</p>
                            <Menu.Divider />
                            {uniqTopic.map((topic, index) => (
                              <Menu.Item
                                key={index}
                                className="justify-between bg-transparent !max-w-full  py-4  !h-[30px] flex items-center  border-white text-default !font-extrabold transition-colors duration-300 hover:bg-[#F0F0F0] hover:text-tertiary group"
                                variant="outline"
                                onClick={() => {
                                  if (topic !== tqf5.topic) {
                                    dispatch(setSelectTqf5Topic(topic));
                                  }
                                  goToPage(ROUTE_PATH.TQF5);
                                }}
                              >
                                <div className=" flex  !font-semibold  flex-col justify-start items-start gap-[7px]">
                                  <p className="text-ellipsis overflow-hidden whitespace-nowrap !font-semibold text-[12px]">
                                    {topic}
                                  </p>
                                </div>
                              </Menu.Item>
                            ))}
                          </div>
                        )}
                      </Menu.Dropdown>
                    )}
                </Menu>
              </>
            )}
          </div>
        </div>

        {openSidebar && (
          <>
            <div className="flex  flex-col gap-2">
              <p className="text-b2 font-bold mb-1 acerSwift:max-macair133:mb-0 acerSwift:max-macair133:text-b3">
                Instructor
              </p>
              <div className="max-h-[120px] flex flex-col gap-1 acerSwift:max-macair133:overflow-y-auto">
                {instructors.map((item, index) => {
                  return (
                    <p
                      key={index}
                      className="text-pretty font-medium text-b4 acerSwift:max-macair133:text-b5"
                    >
                      {getUserName(item, 1)}
                    </p>
                  );
                })}
              </div>
            </div>
            {!!coInstructors.length && (
              <div className="flex  flex-col gap-2 acerSwift:max-macair133:hidden">
                <p className="text-b2 font-bold mb-1 acerSwift:max-macair133:mb-0 acerSwift:max-macair133:text-b3 bg-red">
                  Co-Instructor
                </p>
                <div className="max-h-[140px] acerSwift:max-macair133:max-h-[10px] gap-1 flex flex-col  overflow-y-auto acerSwift:max-macair133:text-b5">
                  {coInstructors.map((item, index) => {
                    return (
                      <p
                        key={index}
                        className="text-pretty font-medium text-[12px]"
                      >
                        {getUserName(item, 1)}
                      </p>
                    );
                  })}
                </div>
              </div>
            )}
          </>
        )}
        {dashboard == ROLE.INSTRUCTOR &&
          course &&
          !course?.sections.find(
            (sec: any) => sec.instructor.email === user.email
          ) && (
            <div
              className={`flex w-full gap-2 justify-end flex-col flex-1 ${
                openSidebar ? "" : "items-center text-center"
              }`}
            >
              {openSidebar && (
                <p className="text-b2 text-white font-bold acerSwift:max-macair133:text-b3">
                  Course Action
                </p>
              )}
              {!isMobile && (
                <Tooltip
                  transitionProps={{
                    transition: "fade-right",
                    duration: 200,
                  }}
                  classNames={{
                    tooltip:
                      " font-semibold text-[15px] py-2 bg-default stroke-default border-default",
                  }}
                  label="Leave Course"
                  position="right-end"
                  withArrow
                  arrowPosition="side"
                  arrowOffset={15}
                  arrowSize={10}
                  opacity={openSidebar ? 0 : 1}
                >
                  <Button
                    onClick={onClickLeaveCourse}
                    leftSection={
                      openSidebar && (
                        <Icon
                          IconComponent={IconLogout}
                          className="size-5 stroke-[2px] acerSwift:max-macair133:size-4"
                        />
                      )
                    }
                    className={`text-[#ffffff] bg-transparent hover:bg-[#d55757] flex justify-start items-center transition-colors duration-300 focus:border-none ${
                      openSidebar
                        ? "!w-full !h-9 acerSwift:max-macair133:!h-8"
                        : "!h-fit !w-fit p-2 !rounded-full"
                    }`}
                  >
                    {openSidebar ? (
                      <div className="flex flex-col justify-start w-full items-start gap-[7px] ">
                        <p className="font-medium text-b3 acerSwift:max-macair133:text-b4">
                          Leave from Course
                        </p>
                      </div>
                    ) : (
                      <Icon
                        IconComponent={IconLogout}
                        className="size-5 stroke-[2px] acerSwift:max-macair133:size-4"
                      />
                    )}
                  </Button>
                </Tooltip>
              )}
            </div>
          )}
      </div>
    </>
  );
}
