import { useAppDispatch, useAppSelector } from "@/store";
import { useEffect, useState } from "react";
import { Button } from "@mantine/core";
import Icon from "@/components/Icon";
import IconAdjustmentsHorizontal from "@/assets/icons/horizontalAdjustments.svg?react";
import IconExcel from "@/assets/icons/excel.svg?react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { getCourse } from "@/services/course/course.service";
import { CourseRequestDTO } from "@/services/course/dto/course.dto";
import InfiniteScroll from "react-infinite-scroll-component";
import { IModelAcademicYear } from "@/models/ModelAcademicYear";
import notFoundImage from "@/assets/image/notFound.png";
import { ROUTE_PATH } from "@/helpers/constants/route";
import { TQF_STATUS } from "@/helpers/constants/enum";
import Loading from "@/components/Loading";
import { setLoading } from "@/store/loading";
import { setShowSidebar } from "@/store/showSidebar";
import { setShowNavbar } from "@/store/showNavbar";
import { addLoadMoreAllCourse, setAllCourseList } from "@/store/allCourse";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const loading = useAppSelector((state) => state.loading);
  const user = useAppSelector((state) => state.user);
  const academicYear = useAppSelector((state) => state.academicYear);
  const courseList = useAppSelector((state) => state.allCourse);
  const dispatch = useAppDispatch();
  const [payload, setPayload] = useState<any>();
  const [params, setParams] = useSearchParams({});
  const [term, setTerm] = useState<Partial<IModelAcademicYear>>({});

  useEffect(() => {
    dispatch(setShowSidebar(true));
    dispatch(setShowNavbar(true));
  }, []);

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
    if (term) {
      setPayload({
        ...new CourseRequestDTO(),
        manage: true,
        year: term.year,
        semester: term.semester,
        search: courseList.search,
        hasMore: true,
      });
      localStorage.removeItem("search");
    }
  }, [localStorage.getItem("search")]);

  const fetchCourse = async (year: number, semester: number) => {
    if (!user.termsOfService) return;
    dispatch(setLoading(true));
    const payloadCourse = new CourseRequestDTO();
    setPayload({ ...payloadCourse, year, semester, hasMore: true });
    const res = await getCourse(payloadCourse);
    if (res) {
      dispatch(setAllCourseList(res));
    }
    dispatch(setLoading(false));
  };

  const onShowMore = async () => {
    if (payload.year && payload.semester) {
      const res = await getCourse({ ...payload, page: payload.page + 1 });
      if (res.length) {
        dispatch(addLoadMoreAllCourse(res));
        setPayload({
          ...payload,
          page: payload.page + 1,
          hasMore: res.length >= payload.limit,
        });
      } else {
        setPayload({ ...payload, hasMore: false });
      }
    }
  };

  return (
    <>
      <div className=" flex flex-col h-full w-full  overflow-hidden">
        <div className="flex flex-row px-6 pt-3   items-center justify-between">
          <div className="flex flex-col">
            <p className="text-secondary text-[18px] font-semibold ">
              Hi there, {user.firstNameEN}
            </p>
            {courseList.search.length ? (
              <p className="text-[#575757] text-[14px]">
                {courseList.total} result{courseList.total > 1 ? "s " : " "}{" "}
                found
              </p>
            ) : (
              <p className="text-[#575757] text-[14px]">
                In semester {term?.semester ?? ""}, {term?.year ?? ""}!{" "}
                {courseList.courses.length === 0 ? (
                  <span>Your course card is currently empty</span>
                ) : (
                  <span>
                    You have{" "}
                    <span className="text-[#5768D5] font-semibold">
                      {courseList.total} Course
                      {courseList.total > 1 ? "s " : " "}
                    </span>
                    on your plate.
                  </span>
                )}
              </p>
            )}
          </div>
          <div className="flex gap-3 flex-wrap">
            <Button
              variant="outline"
              className="text-center px-4"
              leftSection={<Icon IconComponent={IconAdjustmentsHorizontal} />}
            >
              Filter
            </Button>
            <Button
              className="text-center px-4"
              leftSection={
                <Icon IconComponent={IconExcel} className="size-4" />
              }
            >
              Export PLO
            </Button>
          </div>
        </div>
        <div className="flex h-full w-full overflow-hidden">
          {loading ? (
            <Loading />
          ) : courseList.total ? (
            <InfiniteScroll
              dataLength={courseList.courses.length}
              next={onShowMore}
              height={"100%"}
              loader={<Loading />}
              hasMore={payload?.hasMore}
              className="overflow-y-auto w-full h-fit max-h-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 px-6 p-3"
              style={{ height: "fit-content", maxHeight: "100%" }}
            >
              {courseList.courses.map((item) => {
                const statusTqf3Sec: any[] = item.sections.map(
                  (sec) => sec.TQF3?.status
                );
                const statusTqf5Sec: any[] = item.sections.map(
                  (sec) => sec.TQF5?.status
                );
                const statusTqf3 =
                  item.TQF3?.status ??
                  (statusTqf3Sec.some((e) => e == TQF_STATUS.IN_PROGRESS)
                    ? TQF_STATUS.IN_PROGRESS
                    : statusTqf3Sec.every((e) => e == TQF_STATUS.DONE)
                    ? TQF_STATUS.DONE
                    : TQF_STATUS.NO_DATA);
                const statusTqf5 =
                  item.TQF5?.status ??
                  (statusTqf5Sec.some((e) => e == TQF_STATUS.IN_PROGRESS)
                    ? TQF_STATUS.IN_PROGRESS
                    : statusTqf5Sec.every((e) => e == TQF_STATUS.DONE)
                    ? TQF_STATUS.DONE
                    : TQF_STATUS.NO_DATA);
                return (
                  <div
                    key={item.id}
                    className="card relative justify-between xl:h-[135px] md:h-[120px] cursor-pointer rounded-[4px] hover:bg-[#F3F3F3]"
                  >
                    <div className="p-2.5 flex flex-col">
                      <p className="font-bold text-sm">{item.courseNo}</p>
                      <p className="text-xs font-medium text-gray-600">
                        {item.courseName}
                      </p>
                    </div>
                    <div className="bg-[#e7eaff] flex h-8 items-center justify-between rounded-b-[4px]">
                      <p className="p-2.5 text-secondary font-[700] text-[12px]">
                        {item.sections.length} Section
                        {item.sections.length > 1 ? "s" : ""}
                      </p>
                      <div className="flex gap-3 px-2.5 font-semibold py-1 justify-end items-center">
                        <p className="tag-tqf" tqf-status={statusTqf3}>
                          TQF 3
                        </p>
                        <p className="tag-tqf" tqf-status={statusTqf5}>
                          TQF 5
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </InfiniteScroll>
          ) : (
            <div className=" flex flex-row flex-1 justify-between">
              <div className="h-full px-[60px] justify-center flex flex-col">
                <p className="text-secondary text-[22px] font-semibold">
                  {courseList.search.length
                    ? `No results for "${courseList.search}" `
                    : "No course found"}
                </p>
                <br />
                <p className=" -mt-4 mb-6 text-b2 break-words font-400 leading-relaxed">
                  {courseList.search.length ? (
                    <>Check the spelling or try a new search.</>
                  ) : (
                    <>
                      It looks like you haven't added any courses yet.
                      <br />
                      Click 'Add Course' button below to get started!
                    </>
                  )}
                </p>
              </div>
              <div className="h-full px-[60px] bg-slate-300  justify-center flex flex-col">
                <img src={notFoundImage} alt="notFound"></img>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
