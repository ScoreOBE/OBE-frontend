import { useNavigate } from "react-router-dom";
import CourseIcon from "@/assets/icons/course.svg?react";
import SOIcon from "@/assets/icons/SO.svg?react";
import { IconChevronLeft } from "@tabler/icons-react";
import { ROUTE_PATH } from "@/helpers/constants/route";

export default function CourseSidebar() {
  const navigate = useNavigate();

  return (
    <>
      <div className="flex text-white flex-col h-full  gap-[32px]">
        <div
          className="hover:underline cursor-pointer font-bold  text-[13px] p-0 flex justify-start"
          onClick={() => navigate(ROUTE_PATH.DASHBOARD_INS)}
        >
          <IconChevronLeft size={20} viewBox="8 0 24 24" />
          Back to Your Course
        </div>

        <div className="text-sm flex flex-col gap-[3px]">
          <p className="font-semibold">Welcome to</p>
          <p className="font-semibold">Course Management!</p>
        </div>
      </div>
    </>
  );
}
