import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@mantine/core";
import CourseIcon from "@/assets/icons/course.svg?react";
import SOIcon from "@/assets/icons/SO.svg?react";
import { IconChevronLeft } from "@tabler/icons-react";
import { ROUTE_PATH } from "@/helpers/constants/route";

export default function PLOSidebar() {
  const navigate = useNavigate();
  const path = useLocation().pathname;

  const goToDashboard = () => {
    navigate(ROUTE_PATH.DASHBOARD_INS);
  };

  const ploCollection = [{collection: 1}, {collection: 2}]

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
          <p className="font-semibold">PLO Management!</p>
        </div>

        <div className="flex flex-col gap-5 ">
          <div className="flex flex-col gap-2">
            <Button
              onClick={() => navigate(ROUTE_PATH.PLO_MANAGEMENT)}
              leftSection={<CourseIcon />}
              className={`font-semibold w-full h-8 flex justify-start text-[13px] items-center border-none rounded-[8px] transition-colors duration-300 focus:border-none group
              ${
                path.includes(ROUTE_PATH.PLO_MANAGEMENT) &&
                !path.includes(`${ROUTE_PATH.PLO_MANAGEMENT}/`)
                  ? "bg-[#F0F0F0] text-primary hover:bg-[#F0F0F0] hover:text-primary"
                  : "text-white bg-transparent hover:text-tertiary hover:bg-[#F0F0F0]"
              }`}
            >
              Dashboard
            </Button>

            {ploCollection.map((collection, index) => <Button
              onClick={() => navigate(`${ROUTE_PATH.PLO_MANAGEMENT}/${index+1}`)}
              leftSection={<CourseIcon />}
              className={`font-semibold w-full h-8 flex justify-start text-[13px] items-center border-none rounded-[8px] transition-colors duration-300 focus:border-none group
              ${
               
                path.includes(`${ROUTE_PATH.PLO_MANAGEMENT}/${index+1}`)
                  ? "bg-[#F0F0F0] text-primary hover:bg-[#F0F0F0] hover:text-primary"
                  : "text-white bg-transparent hover:text-tertiary hover:bg-[#F0F0F0]"
              }`}
            >
              PLO Collection {index+1}
            </Button>)}
            {/* <Button
              onClick={() => navigate(ROUTE_PATH.COURSE_MANAGEMENT_MAP)}
              leftSection={<SOIcon />}
              className={`font-semibold w-full h-8 flex justify-start text-[13px] items-center border-none rounded-[8px] transition-colors duration-300 focus:border-none group
              ${
                path.includes(ROUTE_PATH.COURSE_MANAGEMENT_MAP)
                  ? "bg-[#F0F0F0] text-primary hover:bg-[#F0F0F0] hover:text-primary"
                  : "text-white bg-transparent hover:text-tertiary hover:bg-[#F0F0F0]"
              }`}
            >
              Map PLO required
            </Button> */}
          </div>
        </div>
      </div>
    </>
  );
}
