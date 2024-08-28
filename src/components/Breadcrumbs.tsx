import cmulogo from "@/assets/image/cmuLogo.png";
import { Link, useLocation } from "react-router-dom";
import DashboardSidebar from "./Sidebar/DashboardSidebar";
import { ROUTE_PATH } from "@/helpers/constants/route";
import CourseSidebar from "./Sidebar/CourseSidebar";
import CourseManagementSidebar from "./Sidebar/CourseManagementSidebar";
import { motion } from "framer-motion";
import PLOSidebar from "./Sidebar/PLOManagementSidebar";
import AssignmentSidebar from "./Sidebar/AssignmentSidebar";
import { useAppSelector } from "@/store";

type Props = {
  items: any[];
};

// export default function Breadcrumbs({ items = [] }: Props) {
export default function Breadcrumbs() {
  const breadcrumbs = useAppSelector((state) => state.breadcrumbs);
  return (
    <div className="flex gap-3">
      {breadcrumbs.map((item, index) => (
        <div className="flex gap-3" key={item?.title}>
          <Link to={item?.path!}>{item?.title}</Link>
          {index !== breadcrumbs.length - 1 && ">"}
        </div>
      ))}
    </div>
  );
}
