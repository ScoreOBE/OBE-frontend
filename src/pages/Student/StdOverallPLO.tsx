import { useAppDispatch, useAppSelector } from "@/store";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import maintenace from "@/assets/image/maintenance.png";
import { setDashboard, setShowNavbar, setShowSidebar } from "@/store/config";
import { ROLE } from "@/helpers/constants/enum";

export default function StdOverallPLO() {
  const [params, setParams] = useSearchParams();
  const navigate = useNavigate();
  const loading = useAppSelector((state) => state.loading.loading);
  const user = useAppSelector((state) => state.user);
  const term = useAppSelector((state) =>
    state.academicYear.find(
      (term) =>
        term.year == parseInt(params.get("year") || "") &&
        term.semester == parseInt(params.get("semester") || "")
    )
  );
  const enrollCourses = useAppSelector((state) => state.enrollCourse);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(setShowSidebar(true));
    dispatch(setShowNavbar(true));
    dispatch(setDashboard(ROLE.STUDENT));
    localStorage.setItem("dashboard", ROLE.STUDENT);
  }, []);

  return (
    <div className=" flex flex-col h-full w-full  overflow-hidden">
      <div className="flex flex-row px-6 pt-3   items-center justify-between">
        <div className="flex flex-col">
          <p className="text-secondary text-[18px] font-semibold "></p>
        </div>
      </div>
      <div className=" flex flex-row px-[60px] flex-1 justify-between">
        <div className="h-full  justify-center flex flex-col">
          <p className="text-secondary text-[21px] font-semibold">
            Overall PLO is coming soon to {" "}
           
            <span className="font-[600] text-transparent bg-clip-text bg-gradient-to-r from-[#4285f4] via-[#ec407a] via-[#a06ee1] to-[#fb8c00]">
              ScoreOBE +{" "}
            </span>{" "}
           
          </p>
          <br />
          <p className=" -mt-4 mb-6 text-b2 break-words font-medium leading-relaxed">
            Overall PLO will be available for students February 2025.
          </p>
        </div>
        <div className="h-full  w-[25vw] justify-center flex flex-col">
          <img src={maintenace} alt="notFound"></img>
        </div>
      </div>
    </div>
  );
}
