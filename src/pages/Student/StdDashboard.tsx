import { IModelAcademicYear } from "@/models/ModelAcademicYear";
import { useAppDispatch, useAppSelector } from "@/store";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import notFoundImage from "@/assets/image/notFound.jpg";
import { setDashboard, setShowNavbar, setShowSidebar } from "@/store/config";
import { ROLE } from "@/helpers/constants/enum";
import { setLoading } from "@/store/loading";
import IconInfo2 from "@/assets/icons/Info2.svg?react";
import { getEnrollCourse } from "@/services/student/student.service";
import { setEnrollCourseList } from "@/store/enrollCourse";
import Loading from "@/components/Loading/Loading";
import { ROUTE_PATH } from "@/helpers/constants/route";
import { getSectionNo, isMobile } from "@/helpers/functions/function";
import { Alert } from "@mantine/core";
import Icon from "@/components/Icon";

export default function StdDashboard() {
  const navigate = useNavigate();
  const loading = useAppSelector((state) => state.loading.loading);
  const user = useAppSelector((state) => state.user);
  const academicYear = useAppSelector((state) => state.academicYear);
  const enrollCourses = useAppSelector((state) => state.enrollCourse);
  const dispatch = useAppDispatch();
  const [params, setParams] = useSearchParams({});
  const [term, setTerm] = useState<Partial<IModelAcademicYear>>({});

  useEffect(() => {
    dispatch(setShowSidebar(true));
    dispatch(setShowNavbar(true));
    dispatch(setDashboard(ROLE.STUDENT));
    localStorage.setItem("dashboard", ROLE.STUDENT);
  }, []);

  useEffect(() => {
    if (user.role && !user.studentId) {
      navigate(
        user.role == ROLE.INSTRUCTOR
          ? ROUTE_PATH.INS_DASHBOARD
          : ROUTE_PATH.ADMIN_DASHBOARD
      );
    }
  }, [user]);

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

  useEffect(() => {
    if (term.id) {
      fetchCourse();
    }
  }, [term]);

  const fetchCourse = async () => {
    if (!user.termsOfService) return;
    dispatch(setLoading(true));
    const res = await getEnrollCourse({
      year: term.year,
      semester: term.semester,
    });
    if (res) {
      dispatch(setEnrollCourseList(res));
    }
    dispatch(setLoading(false));
  };

  const goToCourse = (courseNo: string, path?: string) => {
    navigate({
      pathname: `${ROUTE_PATH.STD_DASHBOARD}/${courseNo}/${
        path ?? ROUTE_PATH.EVALUATION
      }`,
      search: "?" + params.toString(),
    });
  };

  return (
    <div className=" flex flex-col h-full w-full  overflow-hidden">
      {!isMobile && (
        <div className="flex flex-row px-6 pt-3   items-center justify-between">
          <div className="flex flex-col">
            <p className="text-secondary text-[18px] font-semibold ">
              Hi there, {user.firstNameEN}
            </p>
            <p className="text-[#575757] text-[14px]">
              In semester{" "}
              <span className="text-[#1f69f3] font-semibold">
                {enrollCourses.semester || ""}/{enrollCourses.year || ""}!
              </span>{" "}
              {enrollCourses.courses.length === 0 ? (
                <span>Your course card is currently empty</span>
              ) : (
                <span>
                  You have{" "}
                  <span className="text-[#1f69f3] font-semibold">
                    {enrollCourses.courses.length} Course
                    {enrollCourses.courses.length > 1 ? "s " : " "}
                  </span>
                  on your plate.
                </span>
              )}
            </p>
          </div>
        </div>
      )}
      <div className="flex h-full w-full overflow-hidden">
        {loading ? (
          <Loading />
        ) : !!enrollCourses.courses.length ? (
          <div className="overflow-y-auto w-full h-fit max-h-full grid grid-cols-2 iphone:max-sm:grid-cols-1 sm:grid-cols-3 macair133:grid-cols-4  pb-5 gap-4 sm:px-6 p-4">
            {enrollCourses.courses.map((item) => (
              <div
                key={item.id}
                className="card relative justify-between h-[125px] macair133:h-[135px] sm:h-[128px] cursor-pointer rounded-[4px] hover:bg-[#f3f3f3]"
                onClick={() => goToCourse(item.courseNo)}
              >
                <div className="p-2.5 h-full justify-between flex flex-col">
                  <div>
                    <p className="font-bold text-default text-sm">
                      {item.courseNo}
                    </p>
                    <p className="text-xs  font-medium text-gray-600">
                      {item.courseName}
                    </p>
                  </div>
                  <p className=" text-xs font-medium text-[#757575]">
                    Section {getSectionNo(item.section?.sectionNo)}
                  </p>
                </div>
                <div className="bg-[#e7f0ff] flex h-8 items-center justify-between rounded-b-[4px]">
                  <p className="p-2.5 text-secondary font-[700] text-[12px]">
                    {!item.section?.assignments.length
                      ? "No Score"
                      : `${item.section?.assignments.length} Score`}
                    {item.section?.assignments.length > 1 ? "s" : ""}
                  </p>
                  <div
                    className="flex gap-3 px-2.5 font-semibold py-1 justify-end items-center"
                    onClick={(event) => event.stopPropagation()}
                  >
                    <p
                      className="tag-tqf text-[#ffffff] py-[6px] bg-secondary rounded-xl !text-b5 acerSwift:max-macair133:!text-b6"
                      onClick={() =>
                        goToCourse(
                          item.courseNo,
                          ROUTE_PATH.COURSE_SYLLABUS.slice(1)
                        )
                      }
                    >
                      Syllabus
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className=" flex iphone:max-sm:justify-center iphone:max-sm:text-center iphone:max-sm:items-center flex-row flex-1 px-[95px] iphone:max-sm:px-16 sm:max-ipad11:px-[70px] justify-between">
            <div className="h-full iphone:max-sm:w-full  justify-center flex flex-col">
              <p className="text-secondary iphone:max-sm:item-center text-[22px] sm:max-ipad11:text-[20px] font-semibold">
                No Course Found
              </p>
              <br />
              <p className=" -mt-4 mb-6 sm:max-ipad11:mb-2 text-b2 break-words font-medium leading-relaxed">
                It looks like instructor hasn't published your score yet.
              </p>
            </div>
            {!isMobile && (
              <div className="h-full  w-[24vw] justify-center flex flex-col">
                <img src={notFoundImage} alt="notFound"></img>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
