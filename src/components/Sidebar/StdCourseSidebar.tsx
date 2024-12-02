import {
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import { Button } from "@mantine/core";
import { useAppDispatch, useAppSelector } from "@/store";
import Icon from "@/components/Icon";
import IconChevronLeft from "@/assets/icons/chevronLeft.svg?react";
import IconList from "@/assets/icons/list.svg?react";
import IconArrow from "@/assets/icons/targetArrow.svg?react";
import IconHistogram from "@/assets/icons/histogram.svg?react";
import IconSpiderChart from "@/assets/icons/spiderChart.svg?react";
import { ROUTE_PATH } from "@/helpers/constants/route";
import { getUserName } from "@/helpers/functions/function";
import Loading from "../Loading/Loading";

export default function StdCourseSidebar() {
  const { courseNo, name } = useParams();
  const navigate = useNavigate();
  const [params, setParams] = useSearchParams();
  const path = useLocation().pathname;
  const course = useAppSelector((state) =>
    state.enrollCourse.courses.find((c) => c.courseNo == courseNo)
  );
  const loading = useAppSelector((state) => state.loading.loading);
  const dispatch = useAppDispatch();

  const gotoPage = (newPath: string, back?: boolean) => {
    navigate({
      pathname: back
        ? newPath
        : `${ROUTE_PATH.STD_DASHBOARD}/${courseNo}/${newPath}`,
      search: "?" + params.toString(),
    });
  };

  return loading ? (
    <Loading />
  ) : (
    <div className="flex text-white flex-col h-full  gap-[26px]">
      {!name && (
        <div
          className="hover:underline cursor-pointer font-bold gap-2 -translate-x-[5px]  text-[13px] p-0 flex justify-start"
          onClick={() => gotoPage(ROUTE_PATH.STD_DASHBOARD, true)}
        >
          <Icon IconComponent={IconChevronLeft} className="size-5" />
          Back to Dashboard
        </div>
      )}
      <div className="flex flex-col gap-5 ">
        <div className="flex flex-col flex-1 font-bold gap-1 ">
          {name && <p className="text-lg">{name}</p>}
          <p
            className={
              name
                ? "text-[14px] font-semibold text-pretty max-w-full"
                : "text-lg"
            }
          >
            {courseNo} (
            {`${params?.get("semester")}/${params?.get("year")?.slice(-2)}`})
          </p>
          <p className="text-[13px] font-semibold text-pretty max-w-full">
            {course?.courseName}
          </p>
        </div>
        {!name && (
          <div className="flex flex-col gap-2">
            <Button
              onClick={() => gotoPage(ROUTE_PATH.EVALUATION)}
              leftSection={<Icon IconComponent={IconList} />}
              className={`!w-full !text-[13px] flex justify-start items-center transition-colors duration-300 focus:border-none group
              ${
                path.includes(ROUTE_PATH.EVALUATION)
                  ? "bg-[#F0F0F0] text-primary hover:bg-[#F0F0F0] hover:text-primary"
                  : "text-white bg-transparent hover:text-tertiary hover:bg-[#F0F0F0]"
              }`}
            >
              Evaluations
            </Button>
            <Button
              onClick={() => gotoPage(ROUTE_PATH.HISTOGRAM)}
              leftSection={
                <Icon
                  IconComponent={IconHistogram}
                  className="pb-1 pl-[2px] size-[22px]"
                />
              }
              className={`!w-full !text-[13px] flex justify-start items-center transition-colors duration-300 focus:border-none group ${
                path.includes(ROUTE_PATH.HISTOGRAM)
                  ? "bg-[#F0F0F0] text-primary hover:bg-[#F0F0F0] hover:text-primary"
                  : "text-white bg-transparent hover:text-tertiary hover:bg-[#F0F0F0]"
              }`}
            >
              <p className="pl-[3px]">Chart</p>
            </Button>
            <Button
              onClick={() => gotoPage(ROUTE_PATH.CLO)}
              leftSection={
                <Icon
                  IconComponent={IconArrow}
                  className=" stroke-[1.5px] size-[22px] "
                />
              }
              className={`!w-full !text-[13px] flex justify-start items-center transition-colors duration-300 focus:border-none group ${
                path.includes(ROUTE_PATH.CLO)
                  ? "bg-[#F0F0F0] text-primary hover:bg-[#F0F0F0] hover:text-primary"
                  : "text-white bg-transparent hover:text-tertiary hover:bg-[#F0F0F0]"
              }`}
            >
              <p className="pl-[3px]">CLO</p>
            </Button>
            <Button
              onClick={() => gotoPage(ROUTE_PATH.PLO)}
              leftSection={
                <Icon
                  IconComponent={IconSpiderChart}
                  className="pb-1 pl-[2px] size-[22px]"
                />
              }
              className={`!w-full !text-[13px] flex justify-start items-center transition-colors duration-300 focus:border-none group ${
                path.includes(ROUTE_PATH.PLO)
                  ? "bg-[#F0F0F0] text-primary hover:bg-[#F0F0F0] hover:text-primary"
                  : "text-white bg-transparent hover:text-tertiary hover:bg-[#F0F0F0]"
              }`}
            >
              <p className="pl-[3px]">PLO</p>
            </Button>
          </div>
        )}
      </div>

      <div className="flex  flex-col gap-2 mt-5">
        <p className="text-b2 font-bold mb-1">Owner section</p>
        <div className="max-h-[120px] flex flex-col gap-1 overflow-y-auto">
          <p className="text-pretty font-medium text-[12px]">
            {getUserName(course?.section?.instructor, 1)}
          </p>
        </div>
      </div>
      {!!course?.section?.coInstructors?.length && (
        <div className="flex  flex-col gap-2">
          <p className="text-b2 font-bold mb-1">Co-Instructor</p>
          <div
            className={`${
              name ? "max-h-[200px]" : "max-h-[140px]"
            } gap-1 flex flex-col  overflow-y-auto`}
          >
            {course?.section.coInstructors.map((item, index) => {
              return (
                <p key={index} className="text-pretty font-medium text-[12px]">
                  {getUserName(item, 1)}
                </p>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
