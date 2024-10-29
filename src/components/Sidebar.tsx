import cmulogo from "@/assets/image/cmuLogo.png";
import {
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import DashboardSidebar from "./Sidebar/DashboardSidebar";
import { ROUTE_PATH } from "@/helpers/constants/route";
import CourseSidebar from "./Sidebar/CourseSidebar";
import { motion } from "framer-motion";
import AssignmentSidebar from "./Sidebar/AssignmentSidebar";
import { useAppDispatch, useAppSelector } from "@/store";
import { getCourse, leaveCourse } from "@/services/course/course.service";
import { removeCourse, setCourseList } from "@/store/course";
import { Alert } from "@mantine/core";
import Icon from "./Icon";
import IconExclamationCircle from "@/assets/icons/exclamationCircle.svg?react";
import IconLeave from "@/assets/icons/leave.svg?react";
import MainPopup from "./Popup/MainPopup";
import { NOTI_TYPE } from "@/helpers/constants/enum";
import { showNotifications } from "@/helpers/notifications/showNotifications";
import { useDisclosure } from "@mantine/hooks";
import OverallSidebar from "./Sidebar/ScoreSidebar";
import { CourseRequestDTO } from "@/services/course/dto/course.dto";
import { setLoading } from "@/store/loading";
import { useEffect } from "react";

export default function Sidebar() {
  const user = useAppSelector((state) => state.user);
  const navigate = useNavigate();
  const { courseNo } = useParams();
  const course = useAppSelector((state) =>
    state.course.courses.find((e) => e.courseNo == courseNo)
  );
  const path = useLocation().pathname;
  const [params, setParams] = useSearchParams();
  const loading = useAppSelector((state) => state.loading);
  const academicYear = useAppSelector((state) => state.academicYear);
  const courseList = useAppSelector((state) => state.course.courses);
  const dispatch = useAppDispatch();
  const [openMainPopup, { open: openedMainPopup, close: closeMainPopup }] =
    useDisclosure(false);
  const getSidebar = () => {
    if (path.includes(ROUTE_PATH.DASHBOARD_INS)) {
      return <DashboardSidebar />;
    } else if (!loading) {
      if (path.includes(ROUTE_PATH.COURSE)) {
        if (
          [ROUTE_PATH.ASSIGNMENT, ROUTE_PATH.HISTOGRAM].some((route) =>
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
    if (
      params.get("year") &&
      params.get("semester") &&
      academicYear.length &&
      !courseList.length
    )
      fetchCourse();
  }, [academicYear, params]);

  const fetchCourse = async () => {
    if (!user.termsOfService) return;
    dispatch(setLoading(true));
    const res = await getCourse({
      ...new CourseRequestDTO(),
      year: parseInt(params.get("year") || ""),
      semester: parseInt(params.get("semester") || ""),
    });
    if (res) {
      dispatch(setCourseList(res));
    } else {
      navigate(ROUTE_PATH.DASHBOARD_INS);
    }
    dispatch(setLoading(false));
  };

  const onClickLeaveCourse = async (id: string) => {
    const res = await leaveCourse(id);
    if (res) {
      dispatch(removeCourse(res.id));
      closeMainPopup();
      showNotifications(NOTI_TYPE.SUCCESS, "Leave Course Success", ``);
      navigate(`${ROUTE_PATH.DASHBOARD_INS}?${params.toString()}`);
    }
  };

  return (
    <motion.div
      initial={{
        x: -160,
      }}
      animate={{ x: 0 }}
      transition={{ duration: 0.3, type: "keyframes", stiffness: 100 }}
      className="w-[255px] border-r-[1px] h-screen flex p-5 sidebar-linear-gradient"
    >
      <div className="flex w-full flex-col gap-11">
        <img
          src={cmulogo}
          alt="CMULogo"
          className="h-fit w-[155px] cursor-pointer"
          onClick={() =>
            navigate(`${ROUTE_PATH.DASHBOARD_INS}?${params.toString()}`)
          }
        />
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
            className="text-[#ff4747] -translate-x-1 size-8"
          />
        }
        title={`Leaving ${course?.courseNo} Course`}
        message={
          <>
            <Alert
              variant="light"
              color="red"
              title={` After you leave ${course?.courseNo} course, you won't have access to Assignments, Score, TQF document and Grades in this course `}
              icon={
                <Icon
                  IconComponent={IconExclamationCircle}
                  className="size-6 mb-5"
                />
              }
            ></Alert>
            <div className="flex flex-col  ">
              <p className="text-b3  text-[#808080]">Course no.</p>
              <p className=" -translate-y-[2px] text-b1">{`${course?.courseNo}`}</p>
            </div>
            <div className="flex flex-col mt-3 ">
              <p className="text-b3  text-[#808080]">Course name</p>
              <p className=" -translate-y-[2px] text-b1">{`${course?.courseName}`}</p>
            </div>
          </>
        }
      />
    </motion.div>
  );
}
