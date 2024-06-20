import { useEffect, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@mantine/core";
import { useAppDispatch, useAppSelector } from "@/store";
import { RxDashboard } from "react-icons/rx";
import { IconChevronLeft } from "@tabler/icons-react";

import { ROUTE_PATH } from "@/helpers/constants/route";
import Icon from "../Icon";
import TQF3 from "@/assets/icons/TQF3.svg?react";
import TQF5 from "@/assets/icons/TQF5.svg?react";
import { IModelCourse } from "@/models/ModelCourse";
import { setCourseList } from "@/store/course";
import { IModelUser } from "@/models/ModelUser";

export default function CourseSidebar() {
  const navigate = useNavigate();
  const path = useLocation().pathname;
  const courseNo = parseInt(path.split("/").pop()!);
  const [params, setParams] = useSearchParams();
  const user = useAppSelector((state) => state.user);
  const courseList = useAppSelector((state) => state.course);
  const dispatch = useAppDispatch();
  const [course, setCourse] = useState<IModelCourse>();
  const [instructors, setInstructors] = useState<IModelUser[]>([]);

  useEffect(() => {
    if (!params.get("year"))
      navigate(ROUTE_PATH.DASHBOARD_INS, { replace: true });

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
      <div className="flex flex-col gap-[27px]">
        <Button
          className="hover:font-bold hover:bg-transparent p-0 flex justify-start"
          color="none"
          radius={"md"}
          onClick={goToDashboard}
        >
          <IconChevronLeft viewBox="8 0 24 24" />
          Back to Your Course
        </Button>

        <div className="flex flex-col gap-5">
          <div className="flex flex-col flex-1 font-semibold gap-1 ">
            <p className="text-lg">
              {course?.courseNo} ({params.get("semester")}/
              {params.get("year")?.slice(-2)})
            </p>
            <p className="text-[13px] text-pretty max-w-full">
              {course?.courseName}
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <Button
              leftSection={<RxDashboard size={18} />}
              className={`font-medium w-full h-8 flex justify-start items-center border-none rounded-lg transition-colors duration-300 focus:border-none group
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
              className={`font-medium w-full h-8 flex justify-start items-center border-none rounded-lg transition-colors duration-300 focus:border-none group
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
              className={`font-medium w-full h-8 flex justify-start items-center border-none rounded-lg transition-colors duration-300 focus:border-none group
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

        <div className="flex flex-col gap-3 mt-5">
          <p className="text-md font-semibold">Instructors</p>
          {instructors.map((item) => {
            return (
              <p key={item.id} className="text-pretty text-[13px] ps-2">
                {item.firstNameEN} {item.lastNameEN}
              </p>
            );
          })}
        </div>
      </div>
    </>
  );
}
