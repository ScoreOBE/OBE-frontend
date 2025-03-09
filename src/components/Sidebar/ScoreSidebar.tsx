import { useEffect, useState } from "react";
import {
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import { Button, Tooltip } from "@mantine/core";
import { useAppSelector } from "@/store";
import { ROUTE_PATH } from "@/helpers/constants/route";
import Icon from "@/components/Icon";
import IconList from "@/assets/icons/list.svg?react";
import IconLogout from "@/assets/icons/logout.svg?react";
import IconStudent from "@/assets/icons/student.svg?react";
import { IModelCourse } from "@/models/ModelCourse";
import { IModelUser } from "@/models/ModelUser";
import { getSectionNo, getUserName, isMobile } from "@/helpers/functions/function";
import { IModelSection } from "@/models/ModelCourse";
import Loading from "../Loading/Loading";

type Props = {
  onClickLeaveCourse: () => void;
};

export default function AssignmentSidebar({ onClickLeaveCourse }: Props) {
  const { courseNo, sectionNo, name } = useParams();
  const navigate = useNavigate();
  const [params, setParams] = useSearchParams();
  const path = useLocation().pathname;
  const openSidebar = useAppSelector((state) => state.config.openSidebar);
  const user = useAppSelector((state) => state.user);
  const courseList = useAppSelector((state) => state.course.courses);
  const loading = useAppSelector((state) => state.loading.loading);
  const [course, setCourse] = useState<IModelCourse>();
  const [section, setSection] = useState<Partial<IModelSection>>();

  useEffect(() => {
    if (courseList.length) {
      const findCourse = courseList.find((e) => e.courseNo == courseNo);
      const findSection = findCourse?.sections.find(
        (sec) => sec.sectionNo == parseInt(sectionNo!)
      );
      setCourse(findCourse);
      setSection(findSection);
    }
  }, [courseList, courseNo]);

  const gotoPage = (newPath: string) => {
    navigate({
      pathname: path.replace(path.split("/")[7], newPath),
      search: "?" + params.toString(),
    });
  };

  return loading ? (
    <Loading />
  ) : (
    <div className="flex text-white flex-col h-full  gap-[26px]">
      <div
        className={`flex flex-col gap-5 ${
          openSidebar ? "" : "w-full justify-center items-center text-center"
        }`}
      >
        {openSidebar && (
          <div className="flex flex-col flex-1 font-bold gap-1 ">
            <p className="text-lg acerSwift:max-macair133:!text-h2">{name}</p>
            <p className="text-b2 acerSwift:max-macair133:!text-b3 font-semibold text-pretty max-w-full">
              {courseNo} ({course?.semester}/{course?.year.toString().slice(-2)}
              )
            </p>
            <p className="text-b2 acerSwift:max-macair133:!text-b3 -mt-1 font-semibold text-pretty max-w-full">
              Section {getSectionNo(sectionNo)}
            </p>
          </div>
        )}
        <div className={`flex flex-col ${openSidebar ? "gap-2" : "gap-3"}`}>
          <Button
            onClick={() => gotoPage(ROUTE_PATH.SCORE)}
            leftSection={
              openSidebar && (
                <Icon
                  IconComponent={IconList}
                  className="acerSwift:max-macair133:!size-5"
                />
              )
            }
            className={`!text-[13px] acerSwift:max-macair133:!text-b4 acerSwift:max-macair133:!h-[30px] flex justify-start items-center transition-colors duration-300 focus:border-none group
            ${
              path.includes(ROUTE_PATH.SCORE)
                ? "bg-[#F0F0F0] text-primary hover:bg-[#F0F0F0] hover:text-primary"
                : "text-white bg-transparent hover:text-tertiary hover:bg-[#F0F0F0]"
            } ${openSidebar ? "!w-full" : "!rounded-full !h-fit !w-fit p-1"}`}
          >
            {openSidebar ? (
              "Scores"
            ) : (
              <Tooltip
                transitionProps={{ transition: "fade-right", duration: 200 }}
                classNames={{
                  tooltip:
                    "font-semibold text-[15px] py-2 bg-default stroke-default border-default",
                }}
                label="Scores"
                position="right-end"
                withArrow
                arrowPosition="side"
                arrowOffset={15}
                arrowSize={10}
              ><div>
              <Icon IconComponent={IconList} className="size-7" /></div></Tooltip>
            )}
          </Button>
          <Button
            onClick={() => gotoPage(ROUTE_PATH.STUDENTS)}
            leftSection={
              openSidebar && (
                <Icon
                  IconComponent={IconStudent}
                  className="pb-1 pl-[2px] size-[22px] acerSwift:max-macair133:!size-5"
                />
              )
            }
            className={`!text-[13px] acerSwift:max-macair133:!text-b4 acerSwift:max-macair133:!h-[30px] flex justify-start items-center transition-colors duration-300 focus:border-none group
            ${
              path.includes(ROUTE_PATH.STUDENTS)
                ? "bg-[#F0F0F0] text-primary hover:bg-[#F0F0F0] hover:text-primary"
                : "text-white bg-transparent hover:text-tertiary hover:bg-[#F0F0F0]"
            } ${openSidebar ? "!w-full" : "!rounded-full !h-fit !w-fit p-2"}`}
          >
            {openSidebar ? (
              <p className="pl-[3px]">Students</p>
            ) : (
              <Tooltip
                transitionProps={{ transition: "fade-right", duration: 200 }}
                classNames={{
                  tooltip:
                    "font-semibold text-[15px] py-2 bg-default stroke-default border-default",
                }}
                label="Students"
                position="right-end"
                withArrow
                arrowPosition="side"
                arrowOffset={15}
                arrowSize={10}
              >
                <div>
                  <Icon
                    IconComponent={IconStudent}
                    className="size-[22px] acerSwift:max-macair133:!size-5"
                  />
                </div>
              </Tooltip>
            )}
          </Button>
        </div>
      </div>

      {openSidebar && (
        <>
          <div className="flex  flex-col gap-2 mt-5">
            <p className="text-b2 acerSwift:max-macair133:!text-b3 font-bold mb-1">
              Instructor
            </p>
            <div className="max-h-[120px] flex flex-col gap-1 overflow-y-auto">
              <p className="text-pretty font-medium text-b4 acerSwift:max-macair133:!text-b5">
                {getUserName(section?.instructor as IModelUser, 1)}
              </p>
            </div>
          </div>
          {!!section?.coInstructors?.length && (
            <div className="flex  flex-col gap-2">
              <p className="text-b2 acerSwift:max-macair133:!text-b3 font-bold mb-1">
                Co-Instructor
              </p>
              <div className="max-h-[140px] gap-1 flex flex-col  overflow-y-auto">
                {section.coInstructors.map((item, index) => {
                  return (
                    <p
                      key={index}
                      className="text-pretty font-medium text-b4 acerSwift:max-macair133:!text-b5"
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
      {course &&
        !course?.sections.find(
          (sec: any) => sec.instructor.email === user.email
        ) && (
          <div
            className={`flex w-full gap-2 justify-end flex-col flex-1 ${
              openSidebar ? "" : "items-center text-center"
            }`}
          >
            {openSidebar && (
              <p className="text-b2 acerSwift:max-macair133:!text-b3 text-white font-bold">
                Course Action
              </p>
            )}
            { !isMobile &&<Button
              onClick={onClickLeaveCourse}
              leftSection={
                openSidebar && (
                  <Icon
                    IconComponent={IconLogout}
                    className="size-5 stroke-[2px] acerSwift:max-macair133:size-4"
                  />
                )
              }
              className={`text-[#ffffff] bg-transparent hover:bg-[#d55757] flex justify-start items-center transition-colors duration-300 focus:border-none ${
                openSidebar
                  ? "!w-full !h-9 acerSwift:max-macair133:!h-8"
                  : "!h-fit !w-fit p-2 !rounded-full"
              }`}
            >
              {openSidebar ? (
                <div className="flex flex-col justify-start w-full items-start gap-[7px] ">
                  <p className="font-medium text-b3 acerSwift:max-macair133:text-b4">
                    Leave from Course
                  </p>
                </div>
              ) : (
                <Tooltip
                  transitionProps={{ transition: "fade-right", duration: 200 }}
                  classNames={{
                    tooltip:
                      "font-semibold text-[15px] py-2 bg-default stroke-default border-default",
                  }}
                  label="Leave Course"
                  position="right-end"
                  withArrow
                  arrowPosition="side"
                  arrowOffset={15}
                  arrowSize={10}
                >
                  <div>
                    <Icon
                      IconComponent={IconLogout}
                      className="size-5 stroke-[2px] acerSwift:max-macair133:size-4"
                    />
                  </div>
                </Tooltip>
              )}
            </Button>}
          </div>
        )}
    </div>
  );
}
