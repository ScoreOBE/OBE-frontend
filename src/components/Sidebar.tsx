import cmulogo from "@/assets/image/cmuLogo.png";
import { useLocation } from "react-router-dom";
import DashboardSidebar from "./Sidebar/DashboardSidebar";
import { ROUTE_PATH } from "@/helpers/constants/route";
import CourseSidebar from "./Sidebar/CourseSidebar";
import CourseManagementSidebar from "./Sidebar/CourseManagementSidebar";
import { motion } from "framer-motion";
import PLOSidebar from "./Sidebar/PLOManagementSidebar";
import AssignmentSidebar from "./Sidebar/AssignmentSidebar";

export default function Sidebar() {
  const path = useLocation().pathname;
  const getSidebar = () => {
    if (path.includes(ROUTE_PATH.DASHBOARD_INS)) {
      return <DashboardSidebar />;
    } else if (path.includes(ROUTE_PATH.COURSE_MANAGEMENT)) {
      return <CourseManagementSidebar />;
    } else if (path.includes(ROUTE_PATH.COURSE)) {
      if (path.includes(ROUTE_PATH.ASSIGNMENT)) {
        return <AssignmentSidebar />;
      } else return <CourseSidebar />;
    } else if (path.includes(ROUTE_PATH.PLO_MANAGEMENT)) {
      return <PLOSidebar />;
    } else return;
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
        <img src={cmulogo} alt="CMULogo" className="h-fit w-[155px]" />
        {getSidebar()}
      </div>
    </motion.div>
  );
}
