import { useEffect, useState } from "react";
import {
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import { Alert, Button, Group, Menu, Modal, Select } from "@mantine/core";
import store, { useAppDispatch, useAppSelector } from "@/store";
import { RxDashboard } from "react-icons/rx";
import {
  IconChevronLeft,
  IconExclamationCircle,
  IconLogout,
  IconChevronRight,
} from "@tabler/icons-react";
import Icon from "@/components/Icon";
import LeaveIcon from "@/assets/icons/leave.svg?react";
import { ROUTE_PATH } from "@/helpers/constants/route";
import TQF3 from "@/assets/icons/TQF3.svg?react";
import TQF5 from "@/assets/icons/TQF5.svg?react";
import { removeCourse } from "@/store/course";
import { IModelUser } from "@/models/ModelUser";
import { getUserName, showNotifications } from "@/helpers/functions/function";
import MainPopup from "../Popup/MainPopup";
import { COURSE_TYPE, NOTI_TYPE } from "@/helpers/constants/enum";
import { leaveCourse } from "@/services/course/course.service";
import { useDisclosure } from "@mantine/hooks";
import { setDataTQF3 } from "@/store/tqf3";

export default function CourseSidebar() {
  const navigate = useNavigate();
  const { courseNo } = useParams();
  const [params, setParams] = useSearchParams();
  const path = useLocation().pathname;
  const prefix = `${ROUTE_PATH.COURSE}/${courseNo}`;
  const user = useAppSelector((state) => state.user);
  const course = useAppSelector((state) =>
    state.course.courses.find((e) => e.courseNo == courseNo)
  );
  const dispatch = useAppDispatch();
  const [instructors, setInstructors] = useState<IModelUser[]>([]);
  const [coInstructors, setCoInstructors] = useState<IModelUser[]>([]);
  const [openModalSelectTopic, setOpenModalSelectTopic] = useState(false);
  const [uniqTopic, setUniqTopic] = useState<string[]>([]);
  const [selectedTopic, setSelectedTopic] = useState<string>();
  const tqf3Topic = useAppSelector((state) => state.tqf3.topic);
  const [openMainPopup, { open: openedMainPopup, close: closeMainPopup }] =
    useDisclosure(false);

  useEffect(() => {
    if (course) {
      const temp: string[] = [];
      course.sections?.filter((sec) => {
        if (sec.topic && !temp.includes(sec.topic)) {
          temp.push(sec.topic);
        }
      });
      setUniqTopic(temp);
      setSelectedTopic(temp[0]);
      if (tqf3Topic != temp[0]) {
        dispatch(setDataTQF3({ topic: temp[0] }));
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
      setInstructors(insList);
      setCoInstructors(coInsList);
    } else if (store.getState().course.courses.length && !course) {
      navigate(`${ROUTE_PATH.DASHBOARD_INS}?${params.toString()}`);
    }
  }, [course]);

  const goToPage = (pathname: string, back?: boolean) => {
    navigate({
      pathname: back ? pathname : `${prefix}/${pathname}`,
      search: "?" + params.toString(),
    });
  };

  const onClickLeaveCourse = async (id: string) => {
    const res = await leaveCourse(id);
    if (res) {
      dispatch(removeCourse(res.id));
      closeMainPopup();
      showNotifications(NOTI_TYPE.SUCCESS, "Leave Course Success", ``);
      navigate(`${ROUTE_PATH.DASHBOARD_INS}?${params.toString()}`);
    }
  };

  return (
    <>
      <MainPopup
        opened={openMainPopup}
        onClose={closeMainPopup}
        action={() => onClickLeaveCourse(course?.id!)}
        type="delete"
        labelButtonRight={`Leave ${course?.courseNo}`}
        icon={
          <Icon IconComponent={LeaveIcon} className=" -translate-x-1 size-8" />
        }
        title={`Leaving ${course?.courseNo} Course`}
        message={
          <>
            <Alert
              variant="light"
              color="red"
              title={` After you leave ${course?.courseNo} course, you won't have access to Assignments, Score, TQF document and Grades in this course `}
              icon={<IconExclamationCircle />}
              classNames={{ icon: "size-6" }}
              className="mb-5"
            ></Alert>
            <div className="flex flex-col  ">
              <p className="text-b3  text-[#808080]">Course no.</p>
              <p className=" -translate-y-[2px] text-b1">{`${course?.courseNo}`}</p>
            </div>
            <div className="flex flex-col mt-3 ">
              <p className="text-b3  text-[#808080]">Course name</p>
              <p className=" -translate-y-[2px] text-b1">{`${course?.courseName}`}</p>
            </div>
          </>
        }
      />
      {/* <Modal
        title="Select Topic"
        transitionProps={{ transition: "pop" }}
        size="32vw"
        centered
        classNames={{
          content: "flex flex-col overflow-hidden pb-2  max-h-full h-fit",
          body: "flex flex-col overflow-hidden max-h-full h-fit",
        }}
        closeOnClickOutside={false}
        opened={openModalSelectTopic}
        onClose={() => setOpenModalSelectTopic(false)}
      >
        <div className="flex flex-col gap-8">
          <Select
            label="Select topic to manage TQF"
            placeholder="Course"
            size="xs"
            searchable
            data={uniqTopic}
            value={selectedTopic}
            onChange={(event) => setSelectedTopic(event!)}
          />
          <div className="flex justify-end w-full">
            <Group className="flex w-full h-fit items-end justify-end">
              <div>
                <Button
                  variant="subtle"
                  onClick={() => {
                    setOpenModalSelectTopic(false);
                    setSelectedTopic(tqf3Topic);
                  }}
                >
                  Cancel
                </Button>
              </div>
              <Button
                onClick={() => {
                  if (selectedTopic !== tqf3Topic) {
                    dispatch(setDataTQF3({ topic: selectedTopic }));
                  }
                  setOpenModalSelectTopic(false);
                }}
                disabled={selectedTopic === tqf3Topic}
              >
                Change
              </Button>
            </Group>
          </div>
        </div>
      </Modal> */}
      <div className="flex text-white flex-col h-full  gap-[26px]">
        <div
          className="hover:underline cursor-pointer font-bold  text-[13px] p-0 flex justify-start"
          onClick={() => goToPage(ROUTE_PATH.DASHBOARD_INS, true)}
        >
          <IconChevronLeft size={20} viewBox="8 0 24 24" />
          Back to Your Course
        </div>

        <div className="flex flex-col gap-5 ">
          <div className="flex flex-col flex-1 font-bold gap-1 ">
            <p className="text-lg">
              {course?.courseNo} ({params.get("semester")}/
              {params.get("year")?.slice(-2)})
            </p>
            <p className="text-[13px] font-semibold text-pretty max-w-full">
              {course?.courseName}
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <Button
              onClick={() => goToPage(ROUTE_PATH.SECTION)}
              leftSection={<RxDashboard size={18} />}
              className={`!w-full !text-[13px] flex justify-start items-center transition-colors duration-300 focus:border-none group
              ${
                !path.includes(ROUTE_PATH.TQF3 || ROUTE_PATH.TQF5)
                  ? // ![ROUTE_PATH.TQF3, ROUTE_PATH.TQF5].includes(path)
                    "bg-[#F0F0F0] text-primary hover:bg-[#F0F0F0] hover:text-primary"
                  : "text-white bg-transparent hover:text-tertiary hover:bg-[#F0F0F0]"
              }`}
            >
              Sections
            </Button>

            <Menu
              trigger="hover"
              openDelay={100}
              clickOutsideEvents={["mousedown"]}
              classNames={{ item: "text-[#3e3e3e] h-8 w-full" }}
              position="right"
              transitionProps={{ transition: "pop", duration: 0 }}
            >
              <Menu.Target>
                <Button
                  onClick={() => {
                    goToPage(ROUTE_PATH.TQF3);
                  }}
                  leftSection={
                    <Icon IconComponent={TQF3} className="h-5 w-5" />
                  }
                  rightSection={ course?.type == COURSE_TYPE.SEL_TOPIC.en &&
                    <IconChevronRight
                    
                      className="h-5 right-2 absolute  flex  w-5"
                    /> 
                  }
                  className={`!w-full !text-[13px]  flex justify-start items-center transition-colors duration-300 focus:border-none group
                ${
                  path.includes(ROUTE_PATH.TQF3)
                    ? "bg-[#F0F0F0] text-primary hover:bg-[#F0F0F0] hover:text-primary"
                    : "text-white bg-transparent hover:text-tertiary hover:bg-[#F0F0F0]"
                }`}
                >
                  TQF 3
                </Button>
              </Menu.Target>
              {course?.type == COURSE_TYPE.SEL_TOPIC.en && (
                <Menu.Dropdown
                  className="!z-50 py-2 !font-semibold max-w-fit translate-x-[22px]  bg-white"
                  style={{ boxShadow: "rgba(0, 0, 0, 0.35) 0px 2px 8px" }}
                >
                  {uniqTopic.length > 1 && (
                    <div className="flex gap-[2px] flex-col  ">
                     
                      {uniqTopic.map((topic) => (
                        <Menu.Item
                          className="justify-between bg-transparent !max-w-full    py-4  !h-[30px] flex items-center  border-white text-default !font-extrabold transition-colors duration-300 hover:bg-[#F0F0F0] hover:text-tertiary group"
                          variant="outline"
                          onClick={() => {
                            if (topic !== tqf3Topic) {
                              dispatch(setDataTQF3({ topic }));
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
                <Button
                  leftSection={
                    <Icon IconComponent={TQF5} className="h-5 w-5" />
                  }
                  rightSection={ course?.type == COURSE_TYPE.SEL_TOPIC.en &&
                    <IconChevronRight
                    
                      className="h-5 right-2 absolute  flex  w-5"
                    /> 
                  }
                  className={`!w-full !text-[13px] mb-2 flex justify-start items-center transition-colors duration-300 focus:border-none group
                ${
                  path.startsWith(ROUTE_PATH.TQF5)
                    ? "bg-[#F0F0F0] text-primary hover:bg-[#F0F0F0] hover:text-primary"
                    : "text-white bg-transparent hover:text-tertiary hover:bg-[#F0F0F0]"
                }`}
                >
                  TQF 5
                </Button>
                
              </Menu.Target>
              {course?.type == COURSE_TYPE.SEL_TOPIC.en && (
                <Menu.Dropdown
                  className="!z-50 py-2 !font-semibold max-w-fit translate-x-[22px] bg-white"
                  style={{ boxShadow: "rgba(0, 0, 0, 0.35) 0px 2px 8px" }}
                >
                  {uniqTopic.length > 1 && (
                    <div className="flex gap-[2px] flex-col  ">
                      <p className="my-1 text-[14px] pl-2">
                        TQF 5 Topic in {courseNo}
                      </p>
                      {uniqTopic.map((topic) => (
                        <Menu.Item
                          className="justify-between bg-transparent !max-w-full    py-4  !h-[30px] flex items-center  border-white text-default !font-extrabold transition-colors duration-300 hover:bg-[#F0F0F0] hover:text-tertiary group"
                          variant="outline"
                          onClick={() => {
                            if (topic !== tqf3Topic) {
                              dispatch(setDataTQF3({ topic }));
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
          </div>
        </div>

        <div className="flex  flex-col gap-2 mt-5">
          <p className="text-b2 font-bold mb-1">Owner Section</p>
          <div className="max-h-[120px] flex flex-col gap-1 overflow-y-auto">
            {instructors.map((item, index) => {
              return (
                <p key={index} className="text-pretty font-medium text-[12px]">
                  {getUserName(item, 1)}
                </p>
              );
            })}{" "}
          </div>
        </div>
        {!!coInstructors.length && (
          <div className="flex  flex-col gap-2">
            <p className="text-b2 font-bold mb-1">Co-Instructor</p>
            <div className="max-h-[140px] gap-1 flex flex-col  overflow-y-auto">
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
        {course &&
          !course?.sections.find(
            (sec: any) => sec.instructor.email === user.email
          ) && (
            <div className="flex w-full gap-2 justify-end flex-col flex-1">
              <p className="text-b2 text-white font-bold">Course Action</p>
              <Button
                onClick={() => {
                  openedMainPopup();
                }}
                leftSection={<IconLogout className="size-5" stroke={1.5} />}
                className="text-[#ffffff] bg-transparent hover:bg-[#d55757] !w-full !h-9 flex justify-start items-center transition-colors duration-300 focus:border-none group"
              >
                <div className="flex flex-col justify-start w-full items-start gap-[7px]">
                  <p className="font-medium text-[13px]">Leave from Course</p>
                </div>
              </Button>
            </div>
          )}
      </div>
    </>
  );
}
