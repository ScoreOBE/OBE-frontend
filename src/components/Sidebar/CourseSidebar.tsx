import { useEffect, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { Alert, Button } from "@mantine/core";
import { useAppDispatch, useAppSelector } from "@/store";
import { RxDashboard } from "react-icons/rx";
import {
  IconChevronLeft,
  IconExclamationCircle,
  IconLogout,
} from "@tabler/icons-react";
import Icon from "@/components/Icon";
import LeaveIcon from "@/assets/icons/leave.svg?react";
import { ROUTE_PATH } from "@/helpers/constants/route";
import TQF3 from "@/assets/icons/TQF3.svg?react";
import TQF5 from "@/assets/icons/TQF5.svg?react";
import { IModelCourse } from "@/models/ModelCourse";
import { removeCourse } from "@/store/course";
import { IModelUser } from "@/models/ModelUser";
import { getUserName, showNotifications } from "@/helpers/functions/function";
import MainPopup from "../Popup/MainPopup";
import { NOTI_TYPE, POPUP_TYPE } from "@/helpers/constants/enum";
import { leaveCourse } from "@/services/course/course.service";
import { useDisclosure } from "@mantine/hooks";

export default function CourseSidebar() {
  const navigate = useNavigate();
  const [params, setParams] = useSearchParams();
  const path = useLocation().pathname;
  const courseNo = path.split("/")[2];
  const prefix = `${ROUTE_PATH.COURSE}/${courseNo}`;
  const user = useAppSelector((state) => state.user);
  const courseList = useAppSelector((state) => state.course.courses);
  const dispatch = useAppDispatch();
  const [course, setCourse] = useState<IModelCourse>();
  const [instructors, setInstructors] = useState<IModelUser[]>([]);
  const [coInstructors, setCoInstructors] = useState<IModelUser[]>([]);
  const [openMainPopup, { open: openedMainPopup, close: closeMainPopup }] =
    useDisclosure(false);

  useEffect(() => {
    if (courseList.length && courseNo) {
      const findCourse = courseList.find((e) => e.courseNo == courseNo);
      setCourse(findCourse);
      const insList: any[] = [];
      const coInsList: any[] = [];
      findCourse?.sections.forEach((e: any) => {
        if (!insList.map((p: any) => p.id).includes(e.instructor.id)) {
          insList.push({ ...e.instructor });
        }
      });
      findCourse?.sections.forEach((e: any) => {
        e.coInstructors.forEach((p: any) => {
          if (
            !insList.map((p: any) => p.id).includes(p.id) &&
            !coInsList.map((p: any) => p.id).includes(p.id)
          ) {
            coInsList.push({ ...p });
          }
        });
      });
      setInstructors(insList);
      setCoInstructors(coInsList);
    }
  }, [courseList, courseNo]);

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
      navigate(ROUTE_PATH.DASHBOARD_INS);
    }
  };

  return (
    <>
      <MainPopup
        opened={openMainPopup}
        onClose={closeMainPopup}
        action={() => onClickLeaveCourse(course?.id!)}
        type={POPUP_TYPE.DELETE}
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
              classNames={{ title: "-mt-[2px]", icon: 'size-6' }}
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
              className={`font-semibold w-full h-8 text-[13px] flex justify-start items-center border-none rounded-[8px] transition-colors duration-300 focus:border-none group
              ${
                !path.includes(ROUTE_PATH.TQF3 || ROUTE_PATH.TQF5)
                  ? // ![ROUTE_PATH.TQF3, ROUTE_PATH.TQF5].includes(path)
                    "bg-[#F0F0F0] text-primary hover:bg-[#F0F0F0] hover:text-primary"
                  : "text-white bg-transparent hover:text-tertiary hover:bg-[#F0F0F0]"
              }`}
            >
              Sections
            </Button>
            <Button
              onClick={() => goToPage(ROUTE_PATH.TQF3)}
              leftSection={<Icon IconComponent={TQF3} className="h-5 w-5" />}
              className={`font-semibold w-full h-8 text-[13px] flex justify-start items-center border-none rounded-[8px] transition-colors duration-300 focus:border-none group
                ${
                  path.includes(ROUTE_PATH.TQF3)
                    ? "bg-[#F0F0F0] text-primary hover:bg-[#F0F0F0] hover:text-primary"
                    : "text-white bg-transparent hover:text-tertiary hover:bg-[#F0F0F0]"
                }`}
            >
              TQF 3
            </Button>
            <Button
              leftSection={<Icon IconComponent={TQF5} className="h-5 w-5" />}
              className={`font-semibold w-full h-8 text-[13px] mb-2 flex justify-start items-center border-none rounded-[8px] transition-colors duration-300 focus:border-none group
                ${
                  path.startsWith(ROUTE_PATH.TQF5)
                    ? "bg-[#F0F0F0] text-primary hover:bg-[#F0F0F0] hover:text-primary"
                    : "text-white bg-transparent hover:text-tertiary hover:bg-[#F0F0F0]"
                }`}
            >
              TQF 5
            </Button>
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
            <div className="flex  w-full gap-2 justify-end flex-col flex-1">
              <p className="text-b2 text-white font-bold">Course Action</p>
              <Button
                onClick={() => {
                  openedMainPopup();
                }}
                leftSection={<IconLogout className="h-5 w-5" stroke={1.5} />}
                className="font-semibold text-[#ffffff] bg-transparent hover:bg-[#d55757] w-full h-9 flex justify-start items-center border-none rounded-[8px] transition-colors duration-300 focus:border-none group"
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
