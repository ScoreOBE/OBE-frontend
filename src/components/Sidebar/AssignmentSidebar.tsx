import { useEffect, useState } from "react";
import {
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import { Button } from "@mantine/core";
import { useAppDispatch, useAppSelector } from "@/store";
import Icon from "@/components/Icon";
import IconLogout from "@/assets/icons/logout.svg?react";
import IconList from "@/assets/icons/list.svg?react";
import IconHistogram from "@/assets/icons/histogram.svg?react";
import { ROUTE_PATH } from "@/helpers/constants/route";
import { IModelCourse } from "@/models/ModelCourse";
import { IModelUser } from "@/models/ModelUser";
import { getUserName } from "@/helpers/functions/function";
import { IModelSection } from "@/models/ModelCourse";
import Loading from "../Loading";

type Props = {
  onClickLeaveCourse: () => void;
};

export default function AssignmentSidebar({ onClickLeaveCourse }: Props) {
  const { courseNo, sectionNo } = useParams();
  const navigate = useNavigate();
  const [params, setParams] = useSearchParams();
  const path = useLocation().pathname;
  const prefix = `${ROUTE_PATH.COURSE}/${courseNo}/${ROUTE_PATH.SECTION}/${sectionNo}`;
  const user = useAppSelector((state) => state.user);
  const courseList = useAppSelector((state) => state.course.courses);
  const dispatch = useAppDispatch();
  const [course, setCourse] = useState<IModelCourse>();
  const [section, setSection] = useState<Partial<IModelSection>>();
  const [loading, setLoading] = useState(false);

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
      pathname: path.replace(path.split("/")[5], newPath),
      search: "?" + params.toString(),
    });
  };

  return loading ? (
    <Loading />
  ) : (
    <div className="flex text-white flex-col h-full  gap-[26px]">
      <div className="flex flex-col gap-5 ">
        <div className="flex flex-col flex-1 font-bold gap-1 ">
          <p className="text-lg">
            {courseNo} ({course?.semester}/{course?.year.toString().slice(-2)})
          </p>
          <p className="text-[13px] font-semibold text-pretty max-w-full">
            {course?.courseName}
          </p>
        </div>
        <div className="flex flex-col gap-2">
          <Button
            onClick={() => gotoPage(ROUTE_PATH.ASSIGNMENT)}
            leftSection={<Icon IconComponent={IconList} />}
            className={`!w-full !text-[13px] flex justify-start items-center transition-colors duration-300 focus:border-none group
              ${
                path.includes(ROUTE_PATH.ASSIGNMENT)
                  ? "bg-[#F0F0F0] text-primary hover:bg-[#F0F0F0] hover:text-primary"
                  : "text-white bg-transparent hover:text-tertiary hover:bg-[#F0F0F0]"
              }`}
          >
            Assignment
          </Button>
          <Button
            onClick={() => gotoPage(ROUTE_PATH.HISTOGRAM)}
            leftSection={
              <Icon
                IconComponent={IconHistogram}
                className="pb-1 pl-[2px] size-[22px]"
              />
            }
            className={`!w-full !text-[13px] flex justify-start items-center transition-colors duration-300 focus:border-none group
                 ${
                   path.includes(ROUTE_PATH.HISTOGRAM)
                     ? "bg-[#F0F0F0] text-primary hover:bg-[#F0F0F0] hover:text-primary"
                     : "text-white bg-transparent hover:text-tertiary hover:bg-[#F0F0F0]"
                 }`}
          >
            <p className="pl-[3px]">Histogram</p>
          </Button>
        </div>
      </div>

      <div className="flex  flex-col gap-2 mt-5">
        <p className="text-b2 font-bold mb-1">Owner section</p>
        <div className="max-h-[120px] flex flex-col gap-1 overflow-y-auto">
          <p className="text-pretty font-medium text-[12px]">
            {getUserName(section?.instructor as IModelUser, 1)}
          </p>
        </div>
      </div>
      {!!section?.coInstructors?.length && (
        <div className="flex  flex-col gap-2">
          <p className="text-b2 font-bold mb-1">Co-Instructor</p>
          <div className="max-h-[140px] gap-1 flex flex-col  overflow-y-auto">
            {section.coInstructors.map((item, index) => {
              return (
                <p key={index} className="text-pretty font-medium text-[12px]">
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
              onClick={onClickLeaveCourse}
              leftSection={
                <Icon
                  IconComponent={IconLogout}
                  className="size-5 stroke-[2px]"
                />
              }
              className="text-[#ffffff] bg-transparent hover:bg-[#d55757] !w-full !h-9 flex justify-start items-center transition-colors duration-300 focus:border-none group"
            >
              <div className="flex flex-col justify-start w-full items-start gap-[7px]">
                <p className="font-medium text-[13px]">Leave from Course</p>
              </div>
            </Button>
          </div>
        )}
    </div>
  );
}
