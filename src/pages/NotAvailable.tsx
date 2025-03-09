import { ROLE } from "@/helpers/constants/enum";
import { ROUTE_PATH } from "@/helpers/constants/route";
import { useAppDispatch } from "@/store";
import { setShowSidebar, setShowNavbar, setDashboard } from "@/store/config";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function NotAvailablePage() {
  const dispatch = useAppDispatch();
  const location = useLocation().pathname;

  useEffect(() => {
    dispatch(setShowSidebar(true));
    dispatch(setShowNavbar(true));
    const isStudent = location.includes(ROUTE_PATH.STD_DASHBOARD);
    const isAdmin = location.includes(ROUTE_PATH.ADMIN_DASHBOARD);
    localStorage.setItem(
      "dashboard",
      isStudent
        ? ROLE.STUDENT
        : isAdmin
        ? ROLE.CURRICULUM_ADMIN
        : ROLE.INSTRUCTOR
    );
    dispatch(
      setDashboard(
        isStudent
          ? ROLE.STUDENT
          : isAdmin
          ? ROLE.CURRICULUM_ADMIN
          : ROLE.INSTRUCTOR
      )
    );
  }, []);
  return (
    <div className="flex flex-col justify-center text-center items-center px-3 h-full w-full">
    Oops!
    {location.includes(ROUTE_PATH.STD_DASHBOARD) ? (
      location.includes(ROUTE_PATH.HISTOGRAM) ? (
        " The Chart view "
      ) : (
        " The PLO view "
      )
    ) : location.includes(ROUTE_PATH.INS_DASHBOARD) ||
      location.includes(ROUTE_PATH.COURSE) ? ( // Check if it's inside a course
      location.includes(ROUTE_PATH.HISTOGRAM) ? ( // Match "histogram"
        " The Chart view "
      ) : location.includes(`/${ROUTE_PATH.TQF3}`) ? ( // Match "/tqf3"
        " The TQF3 view "
      ) : location.includes(`/${ROUTE_PATH.TQF5}`) ? ( // Match "/tqf5"
        " The TQF5 view "
      ) : (
        " The Instructor Dashboard view "
      )
    ) : (
      " The Admin view "
    )}
    isn't available on mobile. Try switching to a desktop or tablet for the best experience.
  </div>
  
  );
}
