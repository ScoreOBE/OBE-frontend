import cmulogo from "@/assets/image/cmuLogo.png";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import DashboardSidebar from "./Sidebar/DashboardSidebar";
import { ROUTE_PATH } from "@/helpers/constants/route";
import CourseSidebar from "./Sidebar/CourseSidebar";
import { motion } from "framer-motion";
import AssignmentSidebar from "./Sidebar/AssignmentSidebar";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store";
import { getCourse } from "@/services/course/course.service";
import { CourseRequestDTO } from "@/services/course/dto/course.dto";
import { setCourseList } from "@/store/course";
import { setLoading } from "@/store/loading";

export default function Sidebar() {
  const navigate = useNavigate();
  const path = useLocation().pathname;
  const [params, setParams] = useSearchParams();
  const loading = useAppSelector((state) => state.loading);
  const academicYear = useAppSelector((state) => state.academicYear);
  const courseList = useAppSelector((state) => state.course.courses);
  const dispatch = useAppDispatch();
  const getSidebar = () => {
    if (path.includes(ROUTE_PATH.DASHBOARD_INS)) {
      return <DashboardSidebar />;
    } else if (!loading) {
      if (path.includes(ROUTE_PATH.COURSE)) {
        if (path.includes(ROUTE_PATH.ASSIGNMENT)) {
          return <AssignmentSidebar />;
        } else return <CourseSidebar />;
      }
    } else return;
  };
  useEffect(() => {
    if (
      params.get("id") &&
      params.get("year") &&
      params.get("semester") &&
      !courseList.length
    )
      fetchCourse();
  }, [academicYear, params]);

  const fetchCourse = async () => {
    dispatch(setLoading(true));
    const res = await getCourse({
      ...new CourseRequestDTO(),
      academicYear: params.get("id")!,
    });
    if (res) {
      dispatch(setCourseList(res));
    } else {
      navigate(ROUTE_PATH.DASHBOARD_INS);
    }
    dispatch(setLoading(false));
  };

  return (
    <motion.div
      initial={{
        x: -120,
      }}
      animate={{ x: 0 }}
      transition={{ duration: 0.3, type: "keyframes", stiffness: 80 }}
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
    </motion.div>
  );
}
