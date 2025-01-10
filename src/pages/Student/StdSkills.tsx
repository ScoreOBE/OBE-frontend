import { useAppDispatch, useAppSelector } from "@/store";
import { setShowNavbar, setShowSidebar } from "@/store/config";
import maintenace from "@/assets/image/maintenance.jpg";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import notFoundImage from "@/assets/image/notFound.jpg";

export default function StdSkills() {
  const dispatch = useAppDispatch();
  const { courseNo } = useParams();

  useEffect(() => {
    dispatch(setShowSidebar(true));
    dispatch(setShowNavbar(true));
  });
  return (
    <div className="bg-white flex flex-col h-full w-full px-6 py-5  gap-3 overflow-hidden">
      <div className="flex items-center !h-full !w-full justify-between px-16">
        <div className="flex flex-col gap-3 text-start">
          <p className="!h-full text-[20px] text-secondary font-semibold">
            No Skill
          </p>{" "}
          <p className=" text-[#333333] -mt-1 text-b2 break-words font-medium leading-relaxed">
          The skill will show to you once the instructor publishes it.
          </p>{" "}
        </div>
        <div className=" items-center justify-center flex">
          <img
            src={notFoundImage}
            className="h-full items-center  w-[24vw] justify-center flex flex-col"
            alt="notFound"
          ></img>
        </div>
      </div>
    </div>
  );
}
