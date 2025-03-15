import {
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import DashboardSidebar from "./Sidebar/DashboardSidebar";
import { PATH, ROUTE_PATH } from "@/helpers/constants/route";
import scoreobe from "@/assets/image/scoreOBElogowhite.png";
import CourseSidebar from "./Sidebar/CourseSidebar";
import { motion } from "framer-motion";
import AssignmentSidebar from "./Sidebar/AssignmentSidebar";
import { useAppDispatch, useAppSelector } from "@/store";
import { getCourse, leaveCourse } from "@/services/course/course.service";
import { removeCourse, setCourseList } from "@/store/course";
import { Alert, Tooltip } from "@mantine/core";
import Icon from "./Icon";
import IconExclamationCircle from "@/assets/icons/exclamationCircle.svg?react";
import IconLeave from "@/assets/icons/leave.svg?react";
import MainPopup from "./Popup/MainPopup";
import { NOTI_TYPE, ROLE } from "@/helpers/constants/enum";
import { showNotifications } from "@/helpers/notifications/showNotifications";
import { useDisclosure } from "@mantine/hooks";
import OverallSidebar from "./Sidebar/ScoreSidebar";
import { CourseRequestDTO } from "@/services/course/dto/course.dto";
import { setLoading } from "@/store/loading";
import { useEffect } from "react";
import { setAllCourseList } from "@/store/allCourse";
import { goToDashboard, isMobile } from "@/helpers/functions/function";
import { getFaculty } from "@/services/faculty/faculty.service";
import { setFaculty } from "@/store/faculty";
import StdCourseSidebar from "./Sidebar/StdCourseSidebar";
import { setEnrollCourseList } from "@/store/enrollCourse";
import { getEnrollCourse } from "@/services/student/student.service";
import { PiTextAlignLeft } from "react-icons/pi";
import { setOpenSidebar } from "@/store/config";
import { setCourseSyllabus } from "@/store/courseSyllabus";

export default function Sidebar() {
  const openSidebar = useAppSelector((state) => state.config.openSidebar);
  const user = useAppSelector((state) => state.user);
  const navigate = useNavigate();
  const { courseNo, sectionNo } = useParams();
  const course = useAppSelector((state) =>
    state.course.courses.find((e) => e.courseNo == courseNo)
  );
  const path = useLocation().pathname;
  const [params, setParams] = useSearchParams();
  const loading = useAppSelector((state) => state.loading.loading);
  const academicYear = useAppSelector((state) => state.academicYear);
  const faculty = useAppSelector((state) => state.faculty);
  const curriculum = useAppSelector((state) => state.faculty.curriculum);
  const courseList = useAppSelector((state) => state.course.courses);
  const allCourseList = useAppSelector((state) => state.allCourse.courses);
  const enrollCourseList = useAppSelector(
    (state) => state.enrollCourse.courses
  );
  const courseSyllabus = useAppSelector(
    (state) => state.courseSyllabus.courses
  );
  const dispatch = useAppDispatch();
  const [openMainPopup, { open: openedMainPopup, close: closeMainPopup }] =
    useDisclosure(false);
  const getSidebar = () => {
    if (
      [PATH.DASHBOARD, ROUTE_PATH.COURSE_SYLLABUS].some((e) => path.includes(e))
    ) {
      if (courseNo) {
        return <StdCourseSidebar />;
      }
      return <DashboardSidebar />;
    } else if (!loading) {
      if (path.includes(ROUTE_PATH.COURSE)) {
        if (
          sectionNo &&
          [ROUTE_PATH.EVALUATION, ROUTE_PATH.HISTOGRAM].some((route) =>
            path.includes(route)
          )
        ) {
          if (
            [ROUTE_PATH.SCORE, ROUTE_PATH.STUDENTS].some((route) =>
              path.includes(route)
            )
          ) {
            return <OverallSidebar onClickLeaveCourse={openedMainPopup} />;
          }
          return <AssignmentSidebar onClickLeaveCourse={openedMainPopup} />;
        } else return <CourseSidebar onClickLeaveCourse={openedMainPopup} />;
      }
    } else return;
  };

  useEffect(() => {
    if (params.get("year") && params.get("semester") && academicYear.length) {
      if (user.id && user.role != ROLE.STUDENT && !faculty.id) {
        fetchCur();
      } else if (
        user.role == ROLE.STUDENT ||
        path.includes(ROUTE_PATH.COURSE_SYLLABUS)
      ) {
        fetchCourse();
      }
    }
  }, [path, academicYear, params]);

  useEffect(() => {
    if (curriculum?.length && (!courseList.length || !allCourseList.length)) {
      fetchCourse();
    }
  }, [curriculum]);

  const fetchCur = async () => {
    const res = await getFaculty(user.facultyCode);
    if (res) {
      dispatch(setFaculty({ ...res }));
    }
  };

  const fetchCourse = async () => {
    if (!user.termsOfService && !path.includes(ROUTE_PATH.COURSE_SYLLABUS))
      return;
    dispatch(setLoading(true));
    const term = {
      year: parseInt(params.get("year") || ""),
      semester: parseInt(params.get("semester") || ""),
    };
    const payload = {
      ...new CourseRequestDTO(),
      ...term,
    };
    if (
      path.includes(`${ROUTE_PATH.COURSE_SYLLABUS}/${courseNo}`) &&
      !courseSyllabus.length
    ) {
      const res = await getCourse({
        ...payload,
        courseSyllabus: true,
        ignorePage: true,
      });
      if (res) {
        dispatch(setCourseSyllabus(res));
      }
    }
    if (user.studentId && !enrollCourseList.length) {
      const res = await getEnrollCourse(term);
      if (res) {
        dispatch(setEnrollCourseList(res));
      }
    }
    if (user.id && !courseList.length) {
      const resCourse = await getCourse(payload);
      if (resCourse) {
        dispatch(setCourseList(resCourse));
      } else {
        goToDashboard(user.role);
      }
    }
    if (
      [ROLE.ADMIN, ROLE.CURRICULUM_ADMIN].includes(user.role) &&
      !allCourseList.length &&
      !path.includes(ROUTE_PATH.ADMIN_DASHBOARD)
    ) {
      const resAllCourse = await getCourse({ ...payload, manage: true });
      if (resAllCourse) {
        dispatch(setAllCourseList(resAllCourse));
      }
    }
    if (!path.includes(`${ROUTE_PATH.COURSE_SYLLABUS}/${courseNo}`))
      dispatch(setLoading(false));
  };

  const onClickLeaveCourse = async (id: string) => {
    const res = await leaveCourse(id);
    if (res) {
      dispatch(removeCourse(res.id));
      closeMainPopup();
      showNotifications(
        NOTI_TYPE.SUCCESS,
        "You have successfully left the course.",
        ``
      );
      navigate(`${ROUTE_PATH.INS_DASHBOARD}?${params.toString()}`);
    }
  };

  return (
    <motion.div
      initial={{
        x: -160,
      }}
      animate={{ x: 0 }}
      transition={{ duration: 0.3, type: "keyframes", stiffness: 100 }}
      className={`${
        openSidebar
          ? "w-[250px]  p-5"
          : "w-[70px] acerSwift:max-macair133:w-[90px] py-5 px-3"
      } border-r-[1px] heig h-screen flex sidebar-linear-gradient transition-all duration-300 ease-in-out`}
    >
      <div className="flex w-full flex-col gap-11 acerSwift:max-macair133:gap-8">
        <div className="flex flex-col gap-2 items-center">
          <div
            className={`flex items-center justify-between ${
              openSidebar ? "w-full" : ""
            }`}
          >
            <div
              className="cursor-pointer flex items-center gap-2"
              onClick={() =>
                navigate(`${ROUTE_PATH.INS_DASHBOARD}?${params.toString()}`)
              }
            >
              <img
                src={scoreobe}
                alt="scoreOBElogo"
                className="h-[28px] cursor-pointer w-[28px] acerSwift:max-macair133:h-[27px] acerSwift:max-macair133:w-[27px]"
              />
              {openSidebar && (
                <p className="text-white text-[18px] acerSwift:max-macair133:text-[18px] font-semibold">
                  ScoreOBE <span className="text-[#FFCD1B]"> +</span>
                </p>
              )}
            </div>
            {openSidebar && (
              <Tooltip
                transitionProps={{ transition: "fade-right", duration: 200 }}
                classNames={{
                  tooltip:
                    " font-semibold text-[15px] py-2 bg-default stroke-default border-default",
                }}
                label="Hide Sidebar"
                position="right-end"
                withArrow
                arrowPosition="side"
                arrowOffset={15}
                arrowSize={10}
              >
                <div>
                  <PiTextAlignLeft
                    size={22}
                    className="cursor-pointer p-1.5 w-fit h-fit rounded-full text-white hover:bg-white hover:text-black rotate-180"
                    onClick={() => dispatch(setOpenSidebar(!openSidebar))}
                  />
                </div>
              </Tooltip>
            )}
          </div>
          {!openSidebar && !isMobile && (
            <Tooltip
              transitionProps={{ transition: "fade-right", duration: 200 }}
              classNames={{
                tooltip:
                  " font-semibold text-[15px] py-2 bg-default stroke-default border-default",
              }}
              label="Show Sidebar"
              position="right-end"
              withArrow
              arrowPosition="side"
              arrowOffset={15}
              arrowSize={10}
            >
              <div>
                <PiTextAlignLeft
                  size={22}
                  className="cursor-pointer p-1.5 w-fit mt-2 h-fit rounded-full  text-white hover:bg-white hover:text-black"
                  onClick={() => dispatch(setOpenSidebar(!openSidebar))}
                />
              </div>
            </Tooltip>
          )}
        </div>
        {getSidebar()}
      </div>
      <MainPopup
        opened={openMainPopup}
        onClose={closeMainPopup}
        action={() => onClickLeaveCourse(course?.id!)}
        type="delete"
        labelButtonRight={`Leave ${course?.courseNo}`}
        icon={
          <Icon
            IconComponent={IconLeave}
            className="text-[#ff4747] -translate-x-1 size-8 acerSwift:max-macair133:size-7"
          />
        }
        title={`Leaving ${course?.courseNo} Course`}
        message={
          <>
            <Alert
              variant="light"
              color="red"
              className="mb-3"
              title={` After you leave ${course?.courseNo} course, you won't have access to Evaluations, Score, TQF document and Grades in this course `}
              icon={
                <Icon
                  IconComponent={IconExclamationCircle}
                  className="size-6 mt-1 "
                />
              }
              classNames={{ title: "acerSwift:max-macair133:!text-b3" }}
            ></Alert>
            <div className="flex flex-col">
              <p className="text-b4  acerSwift:max-macair133:!text-b5  text-[#808080]">
                Course no.
              </p>
              <p className=" -translate-y-[2px] text-b1  acerSwift:max-macair133:!text-b2">{`${course?.courseNo}`}</p>
            </div>
            <div className="flex flex-col mt-3 ">
              <p className="text-b4  acerSwift:max-macair133:!text-b5 text-[#808080]">
                Course name
              </p>
              <p className=" -translate-y-[2px] text-b1  acerSwift:max-macair133:!text-b2">{`${course?.courseName}`}</p>
            </div>
          </>
        }
      />
    </motion.div>
  );
}
