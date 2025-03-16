import { useAppDispatch, useAppSelector } from "@/store";
import { useEffect, useState } from "react";
import Icon from "@/components/Icon";
import { useNavigate, useSearchParams } from "react-router-dom";
import { getCourse } from "@/services/course/course.service";
import { CourseRequestDTO } from "@/services/course/dto/course.dto";
import InfiniteScroll from "react-infinite-scroll-component";
import { IModelAcademicYear } from "@/models/ModelAcademicYear";
import notFoundImage from "@/assets/image/notFound.jpg";
import { ROUTE_PATH } from "@/helpers/constants/route";
import { COURSE_TYPE, ROLE } from "@/helpers/constants/enum";
import Loading from "@/components/Loading/Loading";
import { setLoading } from "@/store/loading";
import { setDashboard, setShowNavbar, setShowSidebar } from "@/store/config";
import { isMobile } from "@/helpers/functions/function";
import {
  addLoadMoreCourseSyllabus,
  setCourseSyllabus,
  setSearchCourseSyllabus,
} from "@/store/courseSyllabus";
import IconInfo2 from "@/assets/icons/Info2.svg?react";

import IconChevron from "@/assets/icons/chevronRight.svg?react";
import { Alert, Button, Select } from "@mantine/core";
import { SearchInput } from "@/components/SearchInput";

export default function CourseSyllabusDashboard() {
  const navigate = useNavigate();
  const loading = useAppSelector((state) => state.loading.loading);
  const user = useAppSelector((state) => state.user);
  const academicYear = useAppSelector((state) => state.academicYear);
  const courseSyllabus = useAppSelector((state) => state.courseSyllabus);
  const dispatch = useAppDispatch();
  const [payload, setPayload] = useState<any>();
  const [searchValue, setSearchValue] = useState("");
  const [params, setParams] = useSearchParams({});
  const termOption = academicYear.map((e) => ({
    label: `${e.semester}/${e.year}`,
    value: e.id,
    year: e.year,
    semester: e.semester,
  }));
  const [term, setTerm] = useState<
    Partial<IModelAcademicYear & { value: string; label: string }>
  >({});

  useEffect(() => {
    dispatch(setShowNavbar(true));
    dispatch(setShowNavbar(!!user.id));
    dispatch(setShowSidebar(!!user.id));
    if (user.id) {
      dispatch(setDashboard(ROLE.STUDENT));
      localStorage.setItem("dashboard", ROLE.STUDENT);
    }
  }, [user]);

  useEffect(() => {
    const year = parseInt(params.get("year")!);
    const semester = parseInt(params.get("semester")!);
    if (termOption.length) {
      const acaYear =
        termOption.find((e) => e.semester == semester && e.year == year) ??
        termOption[0];
      if (acaYear && acaYear.value != term.value) {
        if (!user.id) {
          setParams({
            year: acaYear.year.toString(),
            semester: acaYear.semester.toString(),
          });
        }
        setTerm(acaYear);
        if (courseSyllabus.search.length) {
          dispatch(setSearchCourseSyllabus(""));
        }
      }
    }
  }, [termOption, term, params]);

  useEffect(() => {
    if (term.value && courseSyllabus.search.length) {
      fetchCourse();
    } else {
      dispatch(setCourseSyllabus({ totalCount: 0, search: "", courses: [] }));
    }
  }, [courseSyllabus.search]);

  const initialPayload = () => {
    return {
      ...new CourseRequestDTO(),
      courseSyllabus: true,
      ignorePage: true,
      year: term.year!,
      semester: term.semester!,
      search: courseSyllabus.search,
      hasMore: courseSyllabus.total
        ? courseSyllabus.total >= payload?.limit
        : true,
    };
  };

  const fetchCourse = async () => {
    dispatch(setLoading(true));
    const payloadCourse = initialPayload();
    const res = await getCourse(payloadCourse);
    if (res) {
      dispatch(setCourseSyllabus(res));
      setPayload({
        ...payloadCourse,
        hasMore: res.totalCount >= payloadCourse.limit!,
      });
    }
    dispatch(setLoading(false));
  };

  const onShowMore = async () => {
    if (payload.year && payload.semester) {
      const res = await getCourse({ ...payload, page: payload.page + 1 });
      if (res.length) {
        dispatch(addLoadMoreCourseSyllabus(res));
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

  const goToCourse = (courseNo: string, topic: string | undefined) => {
    window.open(
      `${window.location.origin}${
        ROUTE_PATH.COURSE_SYLLABUS
      }/${courseNo}?${params.toString()}${topic ? `&topic=${topic}` : ""}`
    );
  };

  return (
    <>
      <div className="flex flex-col  h-full w-full overflow-hidden">
        <div
          className={` ${
            courseSyllabus.search.length
              ? "flex top-4 left-6 flex-row items-end"
              : "flex flex-col w-full  items-center justify-center !h-full "
          }`}
        >
          {!courseSyllabus.search.length && (
            <>
              <div className=" flex gap-2 ">
                {" "}
                <p className="!font-[600] mb-4 text-[28px] iphone:max-sm:text-[24px]">
                  <span className=" !drop-shadow-xl text-transparent bg-clip-text bg-gradient-to-r from-[#4285f4] via-[#ec407a] via-[#a06ee1] to-[#fb8c00]">
                    {!user.id && "ScoreOBE+"} Course Syllabus
                  </span>
                </p>
              </div>
            </>
          )}
          <div
            className={` px-10 iphone:max-sm:px-4 pt-5 pb-4  rounded-lg ${
              !courseSyllabus.search.length
                ? "flex-row  items-end gap-4"
                : "gap-4 border-b   w-full"
            }`}
          >
            {!courseSyllabus.search.length ? (
              <p className="text-start flex items-start mb-[5px] font-semibold text-[14px] iphone:max-sm:text-[12px] ">
                Select semester {user.id && "in the sidebar"} and search course
              </p>
            ) : (
              <></>
            )}
            <div
              className={`flex ${
                isMobile
                  ? "flex-col  gap-2"
                  : courseSyllabus.search.length
                  ? "gap-4 "
                  : "flex-row items-end gap-4"
              }`}
            >
              {courseSyllabus.search.length > 0 && !user.id && (
                <p className="!font-[600] mb-2 text-[20px]">
                  <span className="!drop-shadow-xl text-transparent bg-clip-text bg-gradient-to-r from-[#4285f4] via-[#ec407a] via-[#a06ee1] to-[#fb8c00]">
                    ScoreOBE+
                  </span>
                </p>
              )}

              <div className="flex flex-row gap-2">
                {!user.id && (
                  <Select
                    data={termOption}
                    value={term.value}
                    onChange={(_, option) => setTerm(option)}
                    allowDeselect={false}
                    withCheckIcon={false}
                    size="sm"
                    classNames={{
                      label: "font-medium mb-1",
                      input: "text-primary !w-28  font-medium rounded-md",
                      option: "hover:bg-[#DDDDF6] text-primary font-medium",
                    }}
                  />
                )}
                <SearchInput
                  value={searchValue}
                  onChange={setSearchValue}
                  className="w-full"
                  onSearch={(value) => dispatch(setSearchCourseSyllabus(value))}
                  placeholder=" 001102 or English 2"
                />
              </div>

              {!isMobile && (
                <Button
                  size="sm"
                  className="px-4 py-2 !h-9 bg-secondary text-white rounded-md font-semibold hover:bg-primary transition-colors"
                  onClick={() => dispatch(setSearchCourseSyllabus(searchValue))}
                >
                  Search
                </Button>
              )}
            </div>
          </div>
        </div>

        {loading ? (
          <Loading />
        ) : courseSyllabus.total ? (
          <div className="flex flex-col h-full w-full overflow-hidden ">
            <InfiniteScroll
              dataLength={courseSyllabus.courses.length}
              next={onShowMore}
              height={"100%"}
              loader={<Loading />}
              hasMore={false}
              className="overflow-y-auto w-full  h-fit iphone:max-sm:grid-cols-1 sm:px-48 p-4 mt-2 max-h-full flex flex-col pb-5 gap-4"
              style={{ height: "fit-content", maxHeight: "100%" }}
            >
              {courseSyllabus.courses.map((item) => {
                return (
                  <div
                    key={`${item.id}${item.sections[0].topic ?? ""}`}
                    onClick={() =>
                      goToCourse(item.courseNo, item.sections[0].topic)
                    }
                    className="flex items-center justify-between p-4 rounded-lg border border-gray-100 bg-white shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer group"
                  >
                    <div className="space-y-1">
                      <h3 className="font-bold text-sm iphone:max-sm:text-[12px] text-secondary">
                        {item.courseNo}
                      </h3>
                      <p className="text-xs text-gray-600">{item.courseName}</p>
                      {item.type === "SEL_TOPIC" && item.sections[0].topic && (
                        <span className="inline-block text-xs px-2 py-0.5 bg-gray-100 text-gray-700 rounded-full">
                          {item.sections[0].topic}
                        </span>
                      )}
                    </div>
                    <div className="h-8 w-8 flex items-center justify-center rounded-full bg-gray-50 group-hover:bg-primary/10 transition-colors">
                      <Icon
                        IconComponent={IconChevron}
                        className="h-4 w-4 text-gray-400 group-hover:text-primary"
                      />
                    </div>
                  </div>
                );
              })}
            </InfiniteScroll>
          </div>
        ) : courseSyllabus.search.length ? (
          <div className="flex flex-col items-center  justify-center h-full text-center px-6">
            {courseSyllabus.search.length > 0 && (
              <>
                <p className="text-secondary text-lg font-semibold">
                  No results for "{courseSyllabus.search}"
                </p>
                <p className="text-gray-600 text-sm mt-2">
                  Check the spelling or try a new search. Some courses may not
                  have completed TQF 3.
                </p>
                {!isMobile && (
                  <img
                    src={notFoundImage}
                    alt="Not Found"
                    className="w-1/2 max-w-sm mt-4"
                  />
                )}
              </>
            )}
          </div>
        ) : null}
      </div>
    </>
  );
}
