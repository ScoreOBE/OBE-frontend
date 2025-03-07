import {
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import { Button, Tooltip } from "@mantine/core";
import { useAppDispatch, useAppSelector } from "@/store";
import Icon from "@/components/Icon";
import IconChevronLeft from "@/assets/icons/chevronLeft.svg?react";
import IconList from "@/assets/icons/list.svg?react";
import IconArrow from "@/assets/icons/targetArrow.svg?react";
import IconHistogram from "@/assets/icons/histogram.svg?react";
import IconSpiderChart from "@/assets/icons/spiderChart.svg?react";
import IconSkills from "@/assets/icons/briftcase.svg?react";
import { ROUTE_PATH } from "@/helpers/constants/route";
import { getUserName } from "@/helpers/functions/function";
import Loading from "../Loading/Loading";

export default function StdCourseSidebar() {
  const { courseNo, name } = useParams();
  const navigate = useNavigate();
  const [params, setParams] = useSearchParams();
  const path = useLocation().pathname;
  const openSidebar = useAppSelector((state) => state.config.openSidebar);
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
    <div
      className={`flex text-white flex-col h-full gap-[26px] ${
        openSidebar ? "" : "items-center"
      }`}
    >
      {!name && (
        <div
          className={`hover:underline cursor-pointer font-bold gap-2 text-[13px] flex ${
            openSidebar
              ? "p-0 w-full justify-start -translate-x-[5px]"
              : "p-1.5 w-fit justify-center items-center rounded-full text-white hover:bg-white hover:text-black"
          }`}
          onClick={() => gotoPage(ROUTE_PATH.STD_DASHBOARD, true)}
        >
          <Tooltip
            transitionProps={{ transition: "fade-right", duration: 200 }}
            classNames={{
              tooltip:
                "font-semibold text-[15px] py-2 bg-default stroke-default border-default",
            }}
            label="Back to Dashboard"
            position="right-end"
            withArrow
            arrowPosition="side"
            arrowOffset={15}
            arrowSize={10}
          >
            <div>
              <Icon
                IconComponent={IconChevronLeft}
                className={`${openSidebar ? "size-5" : ""}`}
              />
            </div>
          </Tooltip>
          {openSidebar && "Back to Dashboard"}
        </div>
      )}
      <div
        className={`flex flex-col gap-5 ${
          openSidebar ? "" : "w-full justify-center items-center text-center"
        }`}
      >
        {openSidebar && (
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
        )}
        {!name && (
          <div
            className={`flex flex-col ${
              openSidebar
                ? "gap-2"
                : "gap-3 w-full justify-center items-center text-center"
            }`}
          >
            <Button
              onClick={() => gotoPage(ROUTE_PATH.EVALUATION)}
              leftSection={openSidebar && <Icon IconComponent={IconList} />}
              className={`!text-[13px] flex justify-start items-center transition-colors duration-300 focus:border-none group
              ${
                path.includes(ROUTE_PATH.EVALUATION)
                  ? "bg-[#F0F0F0] text-primary hover:bg-[#F0F0F0] hover:text-primary"
                  : "text-white bg-transparent hover:text-tertiary hover:bg-[#F0F0F0]"
              } ${openSidebar ? "!w-full" : "!rounded-full !h-fit !w-fit p-1"}`}
            >
              {openSidebar ? (
                "Evaluations"
              ) : (
                <Tooltip
                  transitionProps={{ transition: "fade-right", duration: 200 }}
                  classNames={{
                    tooltip:
                      "font-semibold text-[15px] py-2 bg-default stroke-default border-default",
                  }}
                  label="Evaluations"
                  position="right-end"
                  withArrow
                  arrowPosition="side"
                  arrowOffset={15}
                  arrowSize={10}
                >
                  <div>
                    <Icon IconComponent={IconList} className="size-7" />
                  </div>
                </Tooltip>
              )}
            </Button>
            <Button
              onClick={() => gotoPage(ROUTE_PATH.HISTOGRAM)}
              leftSection={
                openSidebar && (
                  <Icon
                    IconComponent={IconHistogram}
                    className="pb-1 pl-[2px] size-[22px]"
                  />
                )
              }
              className={`!text-[13px] flex justify-start items-center transition-colors duration-300 focus:border-none group ${
                path.includes(ROUTE_PATH.HISTOGRAM)
                  ? "bg-[#F0F0F0] text-primary hover:bg-[#F0F0F0] hover:text-primary"
                  : "text-white bg-transparent hover:text-tertiary hover:bg-[#F0F0F0]"
              } ${openSidebar ? "!w-full" : "!rounded-full !h-fit !w-fit p-2"}`}
            >
              {openSidebar ? (
                <p className="pl-[3px]">Chart</p>
              ) : (
                <Tooltip
                  transitionProps={{ transition: "fade-right", duration: 200 }}
                  classNames={{
                    tooltip:
                      "font-semibold text-[15px] py-2 bg-default stroke-default border-default",
                  }}
                  label="Chart"
                  position="right-end"
                  withArrow
                  arrowPosition="side"
                  arrowOffset={15}
                  arrowSize={10}
                >
                  <div>
                    <Icon
                      IconComponent={IconHistogram}
                      className="pb-1 pl-[2px] size-[22px]"
                    />
                  </div>
                </Tooltip>
              )}
            </Button>
            <Button
              onClick={() => gotoPage(ROUTE_PATH.CLO)}
              leftSection={
                openSidebar && (
                  <Icon
                    IconComponent={IconArrow}
                    className=" stroke-[1.5px] size-[22px] "
                  />
                )
              }
              className={`!text-[13px] flex justify-start items-center transition-colors duration-300 focus:border-none group ${
                path.includes(ROUTE_PATH.CLO)
                  ? "bg-[#F0F0F0] text-primary hover:bg-[#F0F0F0] hover:text-primary"
                  : "text-white bg-transparent hover:text-tertiary hover:bg-[#F0F0F0]"
              } ${openSidebar ? "!w-full" : "!rounded-full !h-fit !w-fit p-2"}`}
            >
              {openSidebar ? (
                <p className="pl-[3px]">CLO</p>
              ) : (
                <Tooltip
                  transitionProps={{ transition: "fade-right", duration: 200 }}
                  classNames={{
                    tooltip:
                      "font-semibold text-[15px] py-2 bg-default stroke-default border-default",
                  }}
                  label="CLO"
                  position="right-end"
                  withArrow
                  arrowPosition="side"
                  arrowOffset={15}
                  arrowSize={10}
                >
                  <div>
                    <Icon
                      IconComponent={IconArrow}
                      className=" stroke-[1.5px] size-[22px] "
                    />
                  </div>
                </Tooltip>
              )}
            </Button>
            <Button
              onClick={() => gotoPage(ROUTE_PATH.PLO)}
              leftSection={
                openSidebar && (
                  <Icon
                    IconComponent={IconSpiderChart}
                    className="pl-[2px] stroke-[1.2px] size-[20px]"
                  />
                )
              }
              className={`!text-[13px] flex justify-start items-center transition-colors duration-300 focus:border-none group ${
                path.includes(ROUTE_PATH.PLO)
                  ? "bg-[#F0F0F0] text-primary hover:bg-[#F0F0F0] hover:text-primary"
                  : "text-white bg-transparent hover:text-tertiary hover:bg-[#F0F0F0]"
              } ${openSidebar ? "!w-full" : "!rounded-full !h-fit !w-fit p-2"}`}
            >
              {openSidebar ? (
                <p className="pl-[6px]">PLO</p>
              ) : (
                <Tooltip
                  transitionProps={{ transition: "fade-right", duration: 200 }}
                  classNames={{
                    tooltip:
                      "font-semibold text-[15px] py-2 bg-default stroke-default border-default",
                  }}
                  label="PLO"
                  position="right-end"
                  withArrow
                  arrowPosition="side"
                  arrowOffset={15}
                  arrowSize={10}
                >
                  <div>
                    <Icon
                      IconComponent={IconSpiderChart}
                      className="stroke-[1.2px] size-[20px]"
                    />
                  </div>
                </Tooltip>
              )}
            </Button>
            {/* <Button
              onClick={() => gotoPage(ROUTE_PATH.SKILLS)}
              leftSection={
                <Icon
                  IconComponent={IconSkills}
                  className="pl-[2px] size-[22px]"
                />
              }
              className={`!w-full !text-[13px] flex justify-start items-center transition-colors duration-300 focus:border-none group ${
                path.includes(ROUTE_PATH.SKILLS)
                  ? "bg-[#F0F0F0] text-primary hover:bg-[#F0F0F0] hover:text-primary"
                  : "text-white bg-transparent hover:text-tertiary hover:bg-[#F0F0F0]"
              }`}
            >
              <p className="pl-[3px]">Skills</p>
            </Button> */}
          </div>
        )}
      </div>

      {openSidebar && (
        <>
          <div className="flex flex-col w-full gap-2 mt-5">
            <p className="text-b2 font-bold mb-1">Instructor</p>
            <div className="max-h-[120px] flex flex-col gap-1 overflow-y-auto">
              <p className="text-pretty font-medium text-[12px]">
                {getUserName(course?.section?.instructor, 1)}
              </p>
            </div>
          </div>
          {!!course?.section?.coInstructors?.length && (
            <div className="flex flex-col w-full gap-2">
              <p className="text-b2 font-bold mb-1">Co-Instructor</p>
              <div
                className={`${
                  name ? "max-h-[200px]" : "max-h-[140px]"
                } gap-1 flex flex-col  overflow-y-auto`}
              >
                {course?.section.coInstructors.map((item, index) => {
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
    </div>
  );
}
