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
      <div className="flex flex-col gap-11">
        <Button
          className="hover:font-bold hover:bg-transparent p-0 flex justify-start"
          color="none"
          radius={"md"}
          onClick={goToDashboard}
        >
          <IconChevronLeft viewBox="8 0 24 24" />
          Back to Your Course
        </Button>

        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-2">
            <p className="font-semibold text-lg">
              {course?.courseNo} ({params.get("semester")}/
              {params.get("year")?.slice(-2)})
            </p>
            <p className="text-[11px]">{course?.courseName}</p>
          </div>
          <div className="flex flex-col gap-2">
            <Button
              leftSection={<RxDashboard size={18} />}
              className="font-normal bg-transparent w-full flex justify-start items-center px-3 py-1 border-none rounded-lg text-white transition-colors duration-300 hover:bg-[#F0F0F0] hover:text-primary focus:border-none group"
            >
              Sections
            </Button>
            <Button
              leftSection={<Icon IconComponent={TQF3} className="h-5 w-5" />}
              className="font-normal bg-transparent w-full flex justify-start items-center px-3 py-1 border-none rounded-lg text-white transition-colors duration-300 hover:bg-[#F0F0F0] hover:text-primary focus:border-none group"
            >
              TQF 3
            </Button>
            <Button
              leftSection={<Icon IconComponent={TQF5} className="h-5 w-5" />}
              className="font-normal bg-transparent w-full flex justify-start items-center px-3 py-1 border-none rounded-lg text-white transition-colors duration-300 hover:bg-[#F0F0F0] hover:text-primary focus:border-none group"
            >
              TQF 5
            </Button>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <p className="text-sm font-semibold">Instructors</p>
          {instructors.map((item) => {
            return (
              <p key={item.id} className="text-wrap text-[11px]">
                {item.firstNameEN} {item.lastNameEN}
              </p>
            );
          })}
        </div>
      </div>
    </>
  );
}
