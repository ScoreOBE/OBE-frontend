import { useAppDispatch, useAppSelector } from "@/store";
import { useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import notFoundImage from "@/assets/image/notFound.jpg";
import { setDashboard, setShowNavbar, setShowSidebar } from "@/store/config";
import { ROLE } from "@/helpers/constants/enum";
import { setLoading } from "@/store/loading";
import { getEnrollCourse } from "@/services/student/student.service";
import { setEnrollCourseList } from "@/store/enrollCourse";
import Loading from "@/components/Loading/Loading";

export default function StdCourse() {
  const { courseNo } = useParams();
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
  const course = useAppSelector((state) =>
    state.enrollCourse.courses.find((c) => c.courseNo == courseNo)
  );
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(setShowSidebar(true));
    dispatch(setShowNavbar(true));
    dispatch(setDashboard(ROLE.STUDENT));
    localStorage.setItem("dashboard", ROLE.STUDENT);
  }, []);

  return (
    <div className=" flex flex-col h-full w-full  overflow-hidden">
      <div className="flex flex-row px-6 pt-3 items-center justify-between">
        <div className="flex flex-col"></div>
      </div>
      {/* <div className="flex h-full w-full overflow-hidden">
        {loading ? (
          <Loading />
        ) : !!enrollCourses.length ? (
          <div className="overflow-y-auto w-full h-fit max-h-full grid grid-cols-2 sm:grid-cols-3 macair133:grid-cols-4  pb-5 gap-4 px-6 p-3">
            {enrollCourses.map((item) => (
              <div
                key={item.id}
                className="card relative justify-between h-[125px] macair133:h-[135px] sm:h-[128px] cursor-pointer rounded-[4px] hover:bg-[#f3f3f3]"
                onClick={() => goToCourse(item.courseNo)}
              >
                <div className="p-2.5 flex flex-col">
                  <p className="font-bold text-sm">{item.courseNo}</p>
                  <p className="text-xs font-medium text-gray-600">
                    {item.courseName}
                  </p>
                </div>
                <div className="bg-[#e7f0ff] flex h-8 items-center justify-between rounded-b-[4px]">
                  <p className="p-2.5 text-secondary font-[700] text-[12px]">
                    {!item.section?.assignments.length
                      ? "No Assignment"
                      : `${item.section?.assignments.length} Assignment`}
                    {item.section?.assignments.length > 1 ? "s" : ""}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className=" flex flex-row flex-1 px-[95px] sm:max-ipad11:px-[70px] justify-between">
            <div className="h-full  justify-center flex flex-col">
              <p className="text-secondary text-[22px] sm:max-ipad11:text-[20px] font-semibold">
                No Course Found
              </p>
              <br />
              <p className=" -mt-4 mb-6 sm:max-ipad11:mb-2 text-b2 break-words font-medium leading-relaxed">
                It looks like you haven't enrolled any courses.
              </p>
            </div>
            <div className="h-full  w-[24vw] justify-center flex flex-col">
              <img src={notFoundImage} alt="notFound"></img>
            </div>
          </div>
        )}
      </div> */}
    </div>
  );
}
