import { useEffect, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@mantine/core";
import { useAppDispatch, useAppSelector } from "@/store";
import { RxDashboard } from "react-icons/rx";
import { IconChevronLeft, IconLogout } from "@tabler/icons-react";
import Icon from "@/components/Icon";
import LeaveIcon from "@/assets/icons/leave.svg?react";
import { ROUTE_PATH } from "@/helpers/constants/route";
import TQF3 from "@/assets/icons/TQF3.svg?react";
import TQF5 from "@/assets/icons/TQF5.svg?react";
import { IModelCourse } from "@/models/ModelCourse";
import { removeCourse, setCourseList } from "@/store/course";
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
  const courseNo = path.split("/").pop();
  const user = useAppSelector((state) => state.user);
  const courseList = useAppSelector((state) => state.course);
  const dispatch = useAppDispatch();
  const [course, setCourse] = useState<IModelCourse>();
  const [instructors, setInstructors] = useState<IModelUser[]>([]);
  const [openMainPopup, { open: openedMainPopup, close: closeMainPopup }] =
    useDisclosure(false);

  useEffect(() => {
    if (courseList.length && courseNo) {
      const findCourse = courseList.find((e) => e.courseNo == courseNo);
      setCourse(findCourse);
      const insList: any[] = [];
      findCourse?.sections.forEach((e: any) => {
        if (!insList.map((p: any) => p.email).includes(e.instructor.email)) {
          insList.push({ id: user.id, ...e.instructor });
        }
        e.coInstructors.forEach((p: any) => {
          if (!insList.map((p: any) => p.email).includes(p.email)) {
            insList.push({ id: user.id, ...p });
          }
        });
      });
      setInstructors(insList);
    }
  }, [courseList, courseNo]);

  const goToDashboard = () => {
    navigate(
      {
        pathname: ROUTE_PATH.DASHBOARD_INS,
        search: "?" + params.toString(),
      },
      { state: { fetchCourse: true } }
    );
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
        title={`Leaving ${course?.courseNo} Course?`}
        message={
          <p className=" font-medium">
            You won't have access to assignments, score, TQF and grades. <br />{" "}
            <span>Are you sure you want to leave? </span>
          </p>
        }
      />
      <div className="flex text-white flex-col h-full  gap-[32px]">
        <div
          className="hover:underline cursor-pointer font-bold  text-[13px] p-0 flex justify-start"
          onClick={goToDashboard}
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
              leftSection={<RxDashboard size={18} />}
              className={`font-semibold w-full h-8 text-[13px] flex justify-start items-center border-none rounded-[8px] transition-colors duration-300 focus:border-none group
              ${
                path.startsWith(ROUTE_PATH.COURSE)
                  ? "bg-[#F0F0F0] text-primary hover:bg-[#F0F0F0] hover:text-primary"
                  : "text-white bg-transparent hover:text-tertiary hover:bg-[#F0F0F0]"
              }`}
            >
              Sections
            </Button>
            <Button
              leftSection={<Icon IconComponent={TQF3} className="h-5 w-5" />}
              className={`font-semibold w-full h-8 text-[13px] flex justify-start items-center border-none rounded-[8px] transition-colors duration-300 focus:border-none group
                ${
                  path.startsWith(ROUTE_PATH.TQF3)
                    ? "bg-[#F0F0F0] text-primary hover:bg-[#F0F0F0] hover:text-primary"
                    : "text-white bg-transparent hover:text-tertiary hover:bg-[#F0F0F0]"
                }`}
            >
              TQF 3
            </Button>
            <Button
              leftSection={<Icon IconComponent={TQF5} className="h-5 w-5" />}
              className={`font-semibold w-full h-8 text-[13px] flex justify-start items-center border-none rounded-[8px] transition-colors duration-300 focus:border-none group
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
          <p className="text-b2 font-bold mb-1">Instructors</p>
          {instructors.map((item) => {
            return (
              <p key={item.id} className="text-pretty font-medium text-[12px]">
                {getUserName(item, 1)}
              </p>
            );
          })}
        </div>
        {course &&
          !course?.sections.find(
            (sec: any) => sec.instructor.email === user.email
          ) && (
            <div className="flex  w-full gap-2 justify-end flex-col flex-1">
              <p className="text-[14px] text-white font-bold">Course Action</p>
              <Button
                onClick={() => {
                  openedMainPopup();
                }}
                leftSection={<IconLogout className="h-5 w-5" stroke={1.5} />}
                className="font-semibold text-[#ffffff] bg-transparent hover:bg-[#d55757] w-full h-8 flex justify-start items-center border-none rounded-[8px] transition-colors duration-300 focus:border-none group"
              >
                <div className="flex flex-col justify-start w-full items-start gap-[7px]">
                  <p className="font-semibold text-[13px]">Leave from Course</p>
                </div>
              </Button>
            </div>
          )}
      </div>
    </>
  );
}
