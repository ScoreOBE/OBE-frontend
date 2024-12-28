import { useAppDispatch, useAppSelector } from "@/store";
import { setShowNavbar, setShowSidebar } from "@/store/config";
import maintenace from "@/assets/image/maintenance.jpg";
import { useEffect } from "react";

export default function StdSkills() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(setShowSidebar(true));
    dispatch(setShowNavbar(true));
  });
  return (
    <div className=" flex flex-col h-full w-full  overflow-hidden">
    <div className="flex flex-row px-6 pt-3   items-center justify-between">
      <div className="flex flex-col">
        <p className="text-secondary text-[18px] font-semibold "></p>
      </div>
    </div>
    <div className="flex items-center  !h-full !w-full justify-between px-[88px]">
      <div className="h-full  translate-y-2  justify-center flex flex-col">
        <p className="text-secondary text-[21px] font-semibold">
          Skills is coming soon to{" "}
          <span className="font-[600] text-transparent bg-clip-text bg-gradient-to-r from-[#4285f4] via-[#ec407a] via-[#a06ee1] to-[#fb8c00]">
            ScoreOBE +{" "}
          </span>{" "}
        </p>
        <br />
        <p className=" -mt-4 mb-6 text-b2 break-words font-medium leading-relaxed">
          Skills will be available for students February 2025.
        </p>
      </div>
      <div className="h-full  w-[25vw] justify-center flex flex-col">
        <img src={maintenace} alt="notFound"></img>
      </div>
    </div>
  </div>
  );
}
