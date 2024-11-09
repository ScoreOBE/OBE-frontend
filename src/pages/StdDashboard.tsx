import { IModelAcademicYear } from "@/models/ModelAcademicYear";
import { useAppSelector } from "@/store";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import maintenace from "@/assets/image/maintenance.png";

export default function StdDashboard() {
  const user = useAppSelector((state) => state.user);
  const academicYear = useAppSelector((state) => state.academicYear);
  const courseList = useAppSelector((state) => state.course);
  const [term, setTerm] = useState<Partial<IModelAcademicYear>>({});
  const [params, setParams] = useSearchParams({});

  useEffect(() => {
    const year = parseInt(params.get("year")!);
    const semester = parseInt(params.get("semester")!);
    if (academicYear.length) {
      const acaYear = academicYear.find(
        (e) => e.semester == semester && e.year == year
      );
      if (acaYear && acaYear.id != term.id) {
        setTerm(acaYear);
      }
    }
  }, [academicYear, term, params]);

  return (
    <div className=" flex flex-col h-full w-full  overflow-hidden">
      <div className="flex flex-row px-6 pt-3   items-center justify-between">
        <div className="flex flex-col">
          <p className="text-secondary text-[18px] font-semibold ">
           
          </p>
          {courseList.search.length ? (
            <p className="text-[#575757] text-[14px]">
              {courseList.total} result{courseList.total > 1 ? "s " : " "} found
            </p>
          ) : (
            <p></p>
            // <p className="text-[#575757] text-[14px]">
            //   In semester {term?.semester ?? ""}, {term?.year ?? ""}! courses
            //   aren’t available yet. Instrcutor keep you updated!
            //   {/* {courseList.courses.length === 0 ? (
            //     <span>Your course card is currently empty</span>
            //   ) : (
            //     <span>
            //       You have{" "}
            //       <span className="text-[#1f69f3] font-semibold">
            //         {courseList.total} Course
            //         {courseList.total > 1 ? "s " : " "}
            //       </span>
            //       on your plate.
            //     </span>
            //   )} */}
            // </p>
          )}
        </div>
      </div>
      <div className=" flex flex-row px-[60px] flex-1 justify-between">
              <div className="h-full  justify-center flex flex-col">
                <p className="text-secondary text-[21px] font-semibold">
                  {courseList.search.length
                    ? `No results for "${courseList.search}" `
                    : (<p> Hi there, {user.firstNameEN}<br/> Welcome to  <span className="font-[600] text-transparent bg-clip-text bg-gradient-to-r from-[#4285f4] via-[#ec407a] via-[#a06ee1] to-[#fb8c00]">ScoreOBE + </span> We're glad to you here!</p>)}
                </p>
                <br />
                <p className=" -mt-3 mb-6 text-b2 break-words font-medium leading-relaxed">
                  {courseList.search.length ? (
                    <>Check the spelling or try a new search.</>
                  ) : (
                    <>Score OBE+ will be available for students this December. <br/> Stay tuned and get ready to check out your scores!</>
                  )}
                </p>
              </div>
              <div className="h-full  w-[25vw] justify-center flex flex-col">
                <img src={maintenace} alt="notFound"></img>
              </div>
            </div>
    </div>
  );
}
