import { useEffect, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@mantine/core";
import { useAppDispatch, useAppSelector } from "@/store";
import CourseIcon from "@/assets/icons/course.svg?react";
import SOIcon from "@/assets/icons/SO.svg?react";

import { IconChevronLeft, IconLogout } from "@tabler/icons-react";

import { ROUTE_PATH } from "@/helpers/constants/route";
import { IModelCourse } from "@/models/ModelCourse";
import { setCourseList } from "@/store/course";
import { IModelUser } from "@/models/ModelUser";
import { getUserName } from "@/helpers/functions/function";

export default function CourseSidebar() {
  const navigate = useNavigate();
  const path = useLocation().pathname;
  const courseNo = path.split("/").pop();
  const user = useAppSelector((state) => state.user);
  const courseList = useAppSelector((state) => state.course);
  const dispatch = useAppDispatch();
  const [course, setCourse] = useState<IModelCourse>();
  const [instructors, setInstructors] = useState<IModelUser[]>([]);

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
    if (courseList.length == 1) dispatch(setCourseList([]));
    navigate(ROUTE_PATH.DASHBOARD_INS);
  };

  return (
    <>
      <div className="flex text-white flex-col h-full  gap-[32px]">
        <div
          className="hover:underline cursor-pointer font-bold  text-[13px] p-0 flex justify-start"
          onClick={goToDashboard}
        >
          <IconChevronLeft size={20} viewBox="8 0 24 24" />
          Back to Your Course
        </div>

        <div className="text-sm flex flex-col gap-[3px]">
          <p className="font-semibold">Welcome to</p>
          <p className="font-semibold">Course Management!</p>
        </div>

        <div className="flex flex-col gap-5 ">
          <div className="flex flex-col gap-2">
            <Button
              leftSection={<CourseIcon />}
              className={`font-semibold w-full h-8 flex justify-start text-[13px] items-center border-none rounded-[8px] transition-colors duration-300 focus:border-none group
              ${
                path.startsWith(ROUTE_PATH.COURSE_MANAGEMENT)
                  ? "bg-[#F0F0F0] text-primary hover:bg-[#F0F0F0] hover:text-primary"
                  : "text-white bg-transparent hover:text-tertiary hover:bg-[#F0F0F0]"
              }`}
            >
              Dashboard
            </Button>
            <Button
              leftSection={<SOIcon />}
              className={`font-semibold w-full h-8 flex justify-start text-[13px] items-center border-none rounded-[8px] transition-colors duration-300 focus:border-none group
              ${
                path.startsWith(ROUTE_PATH.COURSE_MANAGEMENT_MAP)
                  ? "bg-[#F0F0F0] text-primary hover:bg-[#F0F0F0] hover:text-primary"
                  : "text-white bg-transparent hover:text-tertiary hover:bg-[#F0F0F0]"
              }`}
            >
              Map PLO required
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
