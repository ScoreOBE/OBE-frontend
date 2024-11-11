import { useAppDispatch, useAppSelector } from "@/store";
import { useEffect, useState } from "react";
import { Button, Table } from "@mantine/core";
import Icon from "@/components/Icon";
import IconAdjustmentsHorizontal from "@/assets/icons/horizontalAdjustments.svg?react";
import IconExcel from "@/assets/icons/excel.svg?react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { getCourse } from "@/services/course/course.service";
import { CourseRequestDTO } from "@/services/course/dto/course.dto";
import InfiniteScroll from "react-infinite-scroll-component";
import { IModelAcademicYear } from "@/models/ModelAcademicYear";
import notFoundImage from "@/assets/image/notFound.jpg";
import { TQF_STATUS } from "@/helpers/constants/enum";
import Loading from "@/components/Loading";
import { setLoading } from "@/store/loading";
import { setShowSidebar } from "@/store/showSidebar";
import { setShowNavbar } from "@/store/showNavbar";
import { addLoadMoreAllCourse, setAllCourseList } from "@/store/allCourse";
import { getUniqueInstructors } from "@/helpers/functions/function";
import { IModelPLO } from "@/models/ModelPLO";

export default function AdminDashboardPLO() {
  const navigate = useNavigate();
  const loading = useAppSelector((state) => state.loading);
  const user = useAppSelector((state) => state.user);
  const academicYear = useAppSelector((state) => state.academicYear);
  const courseList = useAppSelector((state) => state.allCourse);
  const dispatch = useAppDispatch();
  const [payload, setPayload] = useState<any>();
  const [params, setParams] = useSearchParams({});
  const [term, setTerm] = useState<Partial<IModelAcademicYear>>({});
  const [ploList, setPloList] = useState<Partial<IModelPLO>>({});

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
        hasMore: courseList.total >= payload?.limit,
      });
      localStorage.removeItem("search");
    }
  }, [localStorage.getItem("search")]);

  const fetchCourse = async (year: number, semester: number) => {
    if (!user.termsOfService) return;
    dispatch(setLoading(true));
    const payloadCourse = { ...new CourseRequestDTO(), year, semester };
    const res = await getCourse(payloadCourse);
    if (res) {
      dispatch(setAllCourseList(res));
      setPayload({
        ...payloadCourse,
        hasMore: res.totalCount >= payload.limit,
      });
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
      <div className=" flex flex-col h-full w-full gap-2 overflow-hidden">
        <div className="flex flex-row px-6 pt-3 items-center justify-between">
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
                  <span>Course is currently empty</span>
                ) : (
                  <span>
                    You have{" "}
                    <span className="text-[#1f69f3] font-semibold">
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
              className="text-center px-4"
              leftSection={
                <Icon IconComponent={IconExcel} className="size-4" />
              }
            >
              Export PLO
            </Button>
          </div>
        </div>
        <div className="flex h-full w-full px-6 pb-3 overflow-hidden">
          {loading ? (
            <Loading />
          ) : courseList.courses.length && ploList.data ? (
            <InfiniteScroll
              dataLength={courseList.courses.length}
              next={onShowMore}
              height={"100%"}
              hasMore={payload?.hasMore}
              className="overflow-y-auto overflow-x-auto w-full h-fit max-h-full border flex flex-col rounded-lg border-secondary"
              style={{ height: "fit-content" }}
              loader={<Loading />}
            >
              <Table stickyHeader striped>
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>PLO</Table.Th>
                    <Table.Th>Course no.</Table.Th>
                    <Table.Th>Name</Table.Th>
                    <Table.Th>AVG. PLO</Table.Th>
                    <Table.Th>Instructor</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody></Table.Tbody>
              </Table>
            </InfiniteScroll>
          ) : (
            <div className=" flex flex-row px-[75px] flex-1 justify-between">
              <div className="h-full  justify-center flex flex-col">
                <p className="text-secondary text-[22px] font-semibold">
                  {courseList.search.length
                    ? `No results for "${courseList.search}" `
                    : "No Course Found"}
                </p>
                <br />
                <p className=" -mt-4 mb-6 text-b2 break-words font-medium leading-relaxed">
                  {courseList.search.length ? (
                    <>Check the spelling or try a new search.</>
                  ) : (
                    <>It looks like you haven't added any courses yet.</>
                  )}
                </p>
              </div>
              <div className="h-full  w-[24vw] justify-center flex flex-col">
                <img src={notFoundImage} alt="notFound"></img>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
