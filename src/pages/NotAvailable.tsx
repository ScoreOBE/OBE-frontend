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
    localStorage.setItem(
      "dashboard",
      isStudent ? ROLE.STUDENT : ROLE.CURRICULUM_ADMIN
    );
    dispatch(setDashboard(isStudent ? ROLE.STUDENT : ROLE.CURRICULUM_ADMIN));
  }, []);
  return (
    <div className="flex flex-col justify-center text-center items-center px-3 h-full w-full">
      {location.includes(ROUTE_PATH.STD_DASHBOARD)
        ? "Oops! The chart view isn't available on mobile. Try switching to a desktop or tablet for the best experience."
        : "Oops! The admin view isn't available on mobile. Try switching to a desktop or tablet for the best experience."}
    </div>
  );
}
