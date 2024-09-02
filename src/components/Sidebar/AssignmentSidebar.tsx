import { useEffect, useState } from "react";
import {
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import { Button } from "@mantine/core";
import { useAppDispatch, useAppSelector } from "@/store";
import { IconLogout } from "@tabler/icons-react";
import Icon from "@/components/Icon";
import LeaveIcon from "@/assets/icons/leave.svg?react";
import { ROUTE_PATH } from "@/helpers/constants/route";
import list from "@/assets/icons/list.svg?react";
import histogram from "@/assets/icons/histogram.svg?react";
import { IModelCourse } from "@/models/ModelCourse";
import { removeCourse } from "@/store/course";
import { IModelUser } from "@/models/ModelUser";
import { getUserName, showNotifications } from "@/helpers/functions/function";
import MainPopup from "../Popup/MainPopup";
import { NOTI_TYPE, POPUP_TYPE } from "@/helpers/constants/enum";
import { getOneCourse, leaveCourse } from "@/services/course/course.service";
import { useDisclosure } from "@mantine/hooks";
import { IModelSection } from "@/models/ModelSection";
import Loading from "../Loading";

export default function AssignmentSidebar() {
  const { courseNo, sectionNo } = useParams();
  const navigate = useNavigate();
  const [params, setParams] = useSearchParams();
  const path = useLocation().pathname;
  const prefix = `${ROUTE_PATH.COURSE}/${courseNo}`;
  const user = useAppSelector((state) => state.user);
  const courseList = useAppSelector((state) => state.course.courses);
  const dispatch = useAppDispatch();
  const [course, setCourse] = useState<IModelCourse>();
  const [section, setSection] = useState<Partial<IModelSection>>();
  const [openMainPopup, { open: openedMainPopup, close: closeMainPopup }] =
    useDisclosure(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (courseList.length) {
      const findCourse = courseList.find((e) => e.courseNo == courseNo);
      const findSection = findCourse?.sections.find(
        (sec) => sec.sectionNo == parseInt(sectionNo!)
      );
      setCourse(findCourse);
      setSection(findSection);
    } else {
      fetchOneCourse();
    }
  }, [courseList, courseNo]);

  const fetchOneCourse = async () => {
    setLoading(true);
    const res = await getOneCourse({
      academicYear: params.get("id"),
      courseNo,
    });
    if (res) {
      // dispatch(editCourse(res));
      setCourse(res);
      const findSection = res?.sections.find(
        (sec: any) => sec.sectionNo == parseInt(sectionNo!)
      );
      setSection(findSection);
    }
    setLoading(false);
  };

  return loading ? (
    <Loading />
  ) : (
    <div className="flex text-white flex-col h-full  gap-[26px]">
      <div className="flex flex-col gap-5 ">
        <div className="flex flex-col flex-1 font-bold gap-1 ">
          <p className="text-lg">
            {courseNo} ({params.get("semester")}/{params.get("year")?.slice(-2)}
            )
          </p>
          <p className="text-[13px] font-semibold text-pretty max-w-full">
            {course?.courseName}
          </p>
        </div>
        <div className="flex flex-col gap-2">
          <Button
            leftSection={<Icon IconComponent={list} />}
            className={`font-semibold w-full h-8 text-[13px] flex justify-start items-center border-none rounded-[8px] transition-colors duration-300 focus:border-none group
              ${
                path.includes(ROUTE_PATH.ASSIGNMENT)
                  ? // ![ROUTE_PATH.TQF3, ROUTE_PATH.TQF5].includes(path)
                    "bg-[#F0F0F0] text-primary hover:bg-[#F0F0F0] hover:text-primary"
                  : "text-white bg-transparent hover:text-tertiary hover:bg-[#F0F0F0]"
              }`}
          >
            Assignment
          </Button>

          <Button
            //
            leftSection={
              <Icon IconComponent={histogram} className="pl-1 pb-1" />
            }
            className={`font-semibold w-full h-8 text-[13px] flex justify-start items-center border-none rounded-[8px] transition-colors duration-300 focus:border-none group
                ${
                  path.includes(ROUTE_PATH.TQF3)
                    ? "bg-[#F0F0F0] text-primary hover:bg-[#F0F0F0] hover:text-primary"
                    : "text-white bg-transparent hover:text-tertiary hover:bg-[#F0F0F0]"
                }`}
          >
            <p className="pl-1">Histogram</p>
          </Button>
        </div>
      </div>

      <div className="flex  flex-col gap-2 mt-5">
        <p className="text-b2 font-bold mb-1">Owner Section</p>
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
              onClick={() => {
                openedMainPopup();
              }}
              leftSection={<IconLogout className="h-5 w-5" stroke={1.5} />}
              className="font-semibold text-[#ffffff] bg-transparent hover:bg-[#d55757] w-full h-9 flex justify-start items-center border-none rounded-[8px] transition-colors duration-300 focus:border-none group"
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
