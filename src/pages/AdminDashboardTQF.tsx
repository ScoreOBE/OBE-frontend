import { useAppDispatch, useAppSelector } from "@/store";
import { useEffect, useState } from "react";
import { Button, Menu, Pill, Table } from "@mantine/core";
import Icon from "@/components/Icon";
import IconAdjustmentsHorizontal from "@/assets/icons/horizontalAdjustments.svg?react";
import IconEye from "@/assets/icons/eyePublish.svg?react";
import IconPrinter from "@/assets/icons/printer.svg?react";
import Icontqf3 from "@/assets/icons/TQF3.svg?react";
import Icontqf5 from "@/assets/icons/TQF5.svg?react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { getCourse } from "@/services/course/course.service";
import { CourseRequestDTO } from "@/services/course/dto/course.dto";
import InfiniteScroll from "react-infinite-scroll-component";
import { IModelAcademicYear } from "@/models/ModelAcademicYear";
import notFoundImage from "@/assets/image/notFound.jpg";
import { COURSE_TYPE, TQF_STATUS } from "@/helpers/constants/enum";
import Loading from "@/components/Loading";
import { setLoading } from "@/store/loading";
import { setShowSidebar } from "@/store/showSidebar";
import { setShowNavbar } from "@/store/showNavbar";
import { addLoadMoreAllCourse, setAllCourseList } from "@/store/allCourse";
import {
  getUniqueInstructors,
  getUniqueTopicsWithTQF,
} from "@/helpers/functions/function";
import { IModelCourse } from "@/models/ModelCourse";
import { IModelSection } from "@/models/ModelSection";

export default function AdminDashboardTQF() {
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

  const courseTable = (index: number, course: Partial<IModelCourse>) => {
    const insList = getUniqueInstructors(course.sections!);
    const uniqueTopic = getUniqueTopicsWithTQF(course.sections!);
    return course.type == COURSE_TYPE.SEL_TOPIC.en ? (
      uniqueTopic.map((sec, indexSec) => {
        return (
          <Table.Tr key={index}>
            {indexSec == 0 && (
              <Table.Td
                className="border-r !border-[#cecece]"
                rowSpan={uniqueTopic.length}
              >
                {course.courseNo}
              </Table.Td>
            )}
            <Table.Td>
              <div>
                <p>{course.courseName}</p>
                {sec && <p>({sec.topic})</p>}
              </div>
            </Table.Td>
            <Table.Td>
              {insList.map((ins) => {
                return (
                  <div key={ins} className="flex flex-col">
                    <p>{ins}</p>
                  </div>
                );
              })}
            </Table.Td>
            <Table.Td>
              <Pill
                // color={
                //   statusTqf3 == TQF_STATUS.NO_DATA
                //     ? "#d8d8dd"
                //     : statusTqf3 == TQF_STATUS.IN_PROGRESS
                //     ? "#eedbb5"
                //     : "#bbe3e3"
                // }
                className="tag-tqf "
                size="sm"
                tqf-status={sec ? sec.TQF3?.status : course.TQF3?.status}
              >
                {sec ? sec.TQF3?.status : course.TQF3?.status}
              </Pill>
            </Table.Td>
            <Table.Td>
              <Pill
                className="tag-tqf text-center"
                tqf-status={sec ? sec.TQF5?.status : course.TQF5?.status}
              >
                {sec ? sec.TQF5?.status : course.TQF5?.status}
              </Pill>
            </Table.Td>
            <Table.Td>
              <div className="flex gap-3 h-full">
                <Menu
                  trigger="click"
                  openDelay={100}
                  clickOutsideEvents={["mousedown"]}
                  classNames={{ item: "text-[#3e3e3e] h-8 w-full" }}
                >
                  <Menu.Target>
                    <Button
                      variant="outline"
                      className="tag-tqf  !px-3 !rounded-full text-center"
                    >
                      <Icon className="size-5" IconComponent={IconEye} />
                    </Button>
                  </Menu.Target>
                  <Menu.Dropdown
                    className="!z-50 rounded-md -translate-y-[3px] translate-x-[-78px] bg-white"
                    style={{ boxShadow: "rgba(0, 0, 0, 0.15) 0px 2px 8px" }}
                  >
                    <div className="flex flex-col">
                      <Menu.Item className="!w-48" leftSection={ <Icon className="size-5" IconComponent={Icontqf3} />}  variant="subtle">View TQF 3</Menu.Item>
                      <Menu.Item className="!w-48" leftSection={ <Icon className="size-5" IconComponent={Icontqf5} />} variant="subtle">View TQF 5</Menu.Item>
                    </div>
                  </Menu.Dropdown>
                </Menu>
                <Menu
                  trigger="click"
                  openDelay={100}
                  clickOutsideEvents={["mousedown"]}
                  classNames={{ item: "text-[#3e3e3e] h-8 w-full" }}
                >
                  <Menu.Target>
                    <Button
                      variant="outline"
                      className="tag-tqf  !px-3 !rounded-full text-center"
                    >
                      <Icon className="size-5" IconComponent={IconPrinter} />
                    </Button>
                  </Menu.Target>
                  <Menu.Dropdown
                    className="!z-50 rounded-md -translate-y-[3px] translate-x-[-78px] bg-white"
                    style={{ boxShadow: "rgba(0, 0, 0, 0.15) 0px 2px 8px" }}
                  >
                    <div className="flex flex-col">
                      <Menu.Item className="!w-48" leftSection={ <Icon className="size-5" IconComponent={Icontqf3} />}  variant="subtle">Print TQF 3</Menu.Item>
                      <Menu.Item className="!w-48" leftSection={ <Icon className="size-5" IconComponent={Icontqf5} />} variant="subtle">Print TQF 5</Menu.Item>
                    </div>
                  </Menu.Dropdown>
                </Menu>
              </div>
            </Table.Td>
          </Table.Tr>
        );
      })
    ) : (
      <Table.Tr key={index}>
        <Table.Td className="border-r !border-[#cecece]">
          {course.courseNo}
        </Table.Td>
        <Table.Td>{course.courseName}</Table.Td>
        <Table.Td>
          {insList.map((ins) => {
            return (
              <div key={ins} className="flex flex-col">
                <p>{ins}</p>
              </div>
            );
          })}
        </Table.Td>
        <Table.Td>
          <Pill
            // color={
            //   statusTqf3 == TQF_STATUS.NO_DATA
            //     ? "#d8d8dd"
            //     : statusTqf3 == TQF_STATUS.IN_PROGRESS
            //     ? "#eedbb5"
            //     : "#bbe3e3"
            // }
            className="tag-tqf text-center "
            tqf-status={course.TQF3?.status}
          >
            {course.TQF3?.status}
          </Pill>
        </Table.Td>
        <Table.Td>
          <Pill
            className="tag-tqf text-center"
            tqf-status={course.TQF5?.status}
          >
            {course.TQF5?.status}
          </Pill>
        </Table.Td>
        <Table.Td>
        <div className="flex gap-3 h-full">
                <Menu
                  trigger="click"
                  openDelay={100}
                  clickOutsideEvents={["mousedown"]}
                  classNames={{ item: "text-[#3e3e3e] h-8 w-full" }}
                >
                  <Menu.Target>
                    <Button
                      variant="outline"
                      className="tag-tqf  !px-3 !rounded-full text-center"
                    >
                      <Icon className="size-5" IconComponent={IconEye} />
                    </Button>
                  </Menu.Target>
                  <Menu.Dropdown
                    className="!z-50 rounded-md -translate-y-[3px] translate-x-[-78px] bg-white"
                    style={{ boxShadow: "rgba(0, 0, 0, 0.15) 0px 2px 8px" }}
                  >
                    <div className="flex flex-col">
                      <Menu.Item className="!w-48" leftSection={ <Icon className="size-5" IconComponent={Icontqf3} />}  variant="subtle">View TQF 3</Menu.Item>
                      <Menu.Item className="!w-48" leftSection={ <Icon className="size-5" IconComponent={Icontqf5} />} variant="subtle">View TQF 5</Menu.Item>
                    </div>
                  </Menu.Dropdown>
                </Menu>
                <Menu
                  trigger="click"
                  openDelay={100}
                  clickOutsideEvents={["mousedown"]}
                  classNames={{ item: "text-[#3e3e3e] h-8 w-full" }}
                >
                  <Menu.Target>
                    <Button
                      variant="outline"
                      className="tag-tqf  !px-3 !rounded-full text-center"
                    >
                      <Icon className="size-5" IconComponent={IconPrinter} />
                    </Button>
                  </Menu.Target>
                  <Menu.Dropdown
                    className="!z-50 rounded-md -translate-y-[3px] translate-x-[-78px] bg-white"
                    style={{ boxShadow: "rgba(0, 0, 0, 0.15) 0px 2px 8px" }}
                  >
                    <div className="flex flex-col">
                      <Menu.Item className="!w-48" leftSection={ <Icon className="size-5" IconComponent={Icontqf3} />}  variant="subtle">Print TQF 3</Menu.Item>
                      <Menu.Item className="!w-48" leftSection={ <Icon className="size-5" IconComponent={Icontqf5} />} variant="subtle">Print TQF 5</Menu.Item>
                    </div>
                  </Menu.Dropdown>
                </Menu>
              </div>
        </Table.Td>
      </Table.Tr>
    );
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
            {/* <Button
              className="text-center px-4"
              leftSection={
                <Icon IconComponent={IconExcel} className="size-4" />
              }
            >
              Export PLO
            </Button> */}
          </div>
        </div>
        <div className="flex h-full w-full px-6 pt-2 pb-5 overflow-hidden">
          {loading ? (
            <Loading />
          ) : courseList.courses.length ? (
            <InfiniteScroll
              dataLength={courseList.courses.length}
              next={onShowMore}
              height={"100%"}
              hasMore={payload?.hasMore}
              className="overflow-y-auto overflow-x-auto w-full h-fit max-h-full border flex flex-col rounded-lg border-secondary"
              style={{ height: "fit-content" }}
              loader={<Loading />}
            >
              <Table stickyHeader>
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th className="border-r w-[12%] !border-[#cecece]">
                      Course No.
                    </Table.Th>
                    <Table.Th>Course Name</Table.Th>
                    <Table.Th>Instructor</Table.Th>
                    <Table.Th>TQF 3</Table.Th>

                    <Table.Th>TQF 5</Table.Th>
                    <Table.Th>Action</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody className="text-default font-medium text-[13px]">
                  {courseList.courses.map((course, index) =>
                    courseTable(index, course)
                  )}
                </Table.Tbody>
              </Table>
            </InfiniteScroll>
          ) : (
            <div className=" flex flex-row flex-1 px-[75px] justify-between">
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
