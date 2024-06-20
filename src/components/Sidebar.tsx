import cmulogo from "@/assets/image/cmuLogo.png";
import { useLocation } from "react-router-dom";
import DashboardSidebar from "./Sidebar/DashboardSidebar";
import { ROUTE_PATH } from "@/helpers/constants/route";
import CourseSidebar from "./Sidebar/CourseSidebar";

export default function Sidebar() {
  const path = useLocation().pathname;
  const getSidebar = () => {
    if (path.includes(ROUTE_PATH.DASHBOARD_INS)) {
      return <DashboardSidebar />;
    } else if (path.includes(ROUTE_PATH.COURSE)) {
      return <CourseSidebar />;
    } else return <></>;
  };
  return (
    <div className="w-[270px] h-screen flex justify-center ">
      <div className="absolute top-5 flex flex-col gap-8 text-white ">
        <img src={cmulogo} alt="CMULogo" className="h-[24px]" />
        {getSidebar()}
      </div>
    </div>
  );
}
