import { useAppDispatch, useAppSelector } from "@/store";
import { useEffect, useState } from "react";
import {
  Button,
  Checkbox,
  CopyButton,
  Menu,
  Table,
  Tabs,
  Tooltip,
} from "@mantine/core";
import Icon from "@/components/Icon";
import IconFilter from "@/assets/icons/horizontalAdjustments.svg?react";
import IconActionTQF from "@/assets/icons/actionTQF.svg?react";
import IconTQF3 from "@/assets/icons/TQF3.svg?react";
import IconTQF5 from "@/assets/icons/TQF5.svg?react";
import IconFileExport from "@/assets/icons/fileExport.svg?react";
import { HiOutlineClipboardCopy, HiCheck } from "react-icons/hi";
import { useNavigate, useSearchParams } from "react-router-dom";
import { getCourse } from "@/services/course/course.service";
import { CourseRequestDTO } from "@/services/course/dto/course.dto";
import InfiniteScroll from "react-infinite-scroll-component";
import { IModelAcademicYear } from "@/models/ModelAcademicYear";
import notFoundImage from "@/assets/image/notFound.jpg";
import { COURSE_TYPE, ROLE, TQF_STATUS } from "@/helpers/constants/enum";
import Loading from "@/components/Loading/Loading";
import { setLoading } from "@/store/loading";
import { setDashboard, setShowNavbar, setShowSidebar } from "@/store/config";
import {
  addLoadMoreAllCourse,
  setAllCourseList,
  setSearchCurriculum,
} from "@/store/allCourse";
import {
  getUniqueInstructors,
  getUniqueTopicsWithTQF,
} from "@/helpers/functions/function";
import { IModelCourse } from "@/models/ModelCourse";
import { IModelCurriculum } from "@/models/ModelFaculty";
import ModalExportTQF3 from "@/components/Modal/TQF3/ModalExportTQF3";
import { IModelTQF3 } from "@/models/ModelTQF3";
import { ROUTE_PATH } from "@/helpers/constants/route";
import { setDataTQF3, setSelectTqf3Topic } from "@/store/tqf3";
import { setDataTQF5, setSelectTqf5Topic } from "@/store/tqf5";
import ModalExportTQF5 from "@/components/Modal/TQF5/ModalExportTQF5";
import { IModelTQF5 } from "@/models/ModelTQF5";

export default function AdminDashboardTQF() {
  const navigate = useNavigate();
  const loading = useAppSelector((state) => state.loading.loading);
  const user = useAppSelector((state) => state.user);
  const curriculum = useAppSelector((state) => state.faculty.curriculum);
  const academicYear = useAppSelector((state) => state.academicYear);
  const courseList = useAppSelector((state) => state.allCourse);
  const dispatch = useAppDispatch();
  const [payload, setPayload] = useState<any>({ page: 1, limit: 20 });
  const [params, setParams] = useSearchParams({});
  const [term, setTerm] = useState<Partial<IModelAcademicYear>>({});
  const [exportDataTQF3, setExportDataTQF3] = useState<
    Partial<IModelTQF3> & { courseNo?: string }
  >({});
  const [exportDataTQF5, setExportDataTQF5] = useState<
    Partial<IModelTQF5> & { courseNo?: string }
  >({});
  const [openModalExportTQF3, setOpenModalExportTQF3] = useState(false);
  const [openModalExportTQF5, setOpenModalExportTQF5] = useState(false);
  const [curriculumList, setCurriculumList] = useState<IModelCurriculum[]>([]);
  const [selectCurriculum, setSelectCurriculum] = useState<
    Partial<IModelCurriculum>
  >({});
  const [tqf3Filters, setTqf3Filters] = useState<string[]>([]);
  const [tqf5Filters, setTqf5Filters] = useState<string[]>([]);
  const [tqf3, setTqf3] = useState<IModelTQF3>();

  useEffect(() => {
    dispatch(setShowSidebar(true));
    dispatch(setShowNavbar(true));
    localStorage.setItem("dashboard", ROLE.CURRICULUM_ADMIN);
    dispatch(setDashboard(ROLE.CURRICULUM_ADMIN));
  }, []);

  useEffect(() => {
    if (curriculum?.length) {
      if (user.role == ROLE.ADMIN) {
        setCurriculumList(curriculum);
      } else {
        setCurriculumList(
          curriculum.filter(({ code }) => user.curriculums?.includes(code))
        );
      }
    }
  }, [curriculum]);

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
      if (term && curriculumList.length) {
        if (user.role == ROLE.ADMIN) {
          setSelectCurriculum({
            nameEN: "All Courses",
            code: "All Courses",
          });
        } else {
          setSelectCurriculum({
            nameEN: curriculumList[0].code,
            code: curriculumList[0].code,
          });
        }
      }
    }
  }, [academicYear, term, params, curriculumList]);

  useEffect(() => {
    if (term.id && curriculumList?.length && selectCurriculum.code)
      fetchCourse();
  }, [curriculumList, selectCurriculum, term]);

  useEffect(() => {
    if (term) {
      setPayload(initialPayload());
      localStorage.removeItem("search");
    }
  }, [localStorage.getItem("search")]);

  useEffect(() => {
    if (
      term.id &&
      (payload.tqf3 != tqf3Filters || payload.tqf5 != tqf5Filters)
    ) {
      fetchCourse();
    }
  }, [tqf3Filters, tqf5Filters]);

  const initialPayload = () => {
    const cur = selectCurriculum.code?.includes("All")
      ? ["All"]
      : [selectCurriculum.code!];
    dispatch(setSearchCurriculum(cur));
    return {
      ...new CourseRequestDTO(),
      manage: true,
      year: term.year!,
      semester: term.semester!,
      curriculum: cur,
      search: courseList.search,
      tqf3: tqf3Filters,
      tqf5: tqf5Filters,
      hasMore: courseList.total >= payload?.limit,
    };
  };

  const goToPage = (pathname: string, courseNo: string, data: any) => {
    dispatch(setDataTQF3(data.TQF3));
    dispatch(setDataTQF5(data.TQF5));
    if (data.topic) {
      dispatch(setSelectTqf3Topic(data.topic));
      dispatch(setSelectTqf5Topic(data.topic));
    }
    navigate({
      pathname: `${ROUTE_PATH.COURSE}/${courseNo}/${pathname}`,
      search: "?" + params.toString(),
    });
  };

  const fetchCourse = async () => {
    if (!user.termsOfService) return;
    dispatch(setLoading(true));
    if (curriculumList?.length) {
      const payloadCourse = initialPayload();
      setPayload(payloadCourse);
      const res = await getCourse(payloadCourse);
      if (res) {
        dispatch(setAllCourseList(res));
        setPayload({
          ...payloadCourse,
          hasMore: res.totalCount >= payload.limit,
        });
      }
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

  const handleTqf3FilterChange = (status: string, isChecked: boolean) => {
    setTqf3Filters((prev) =>
      isChecked ? [...prev, status] : prev.filter((item) => item !== status)
    );
  };

  const handleTqf5FilterChange = (status: string, isChecked: boolean) => {
    setTqf5Filters((prev) =>
      isChecked ? [...prev, status] : prev.filter((item) => item !== status)
    );
  };

  const totalRows = courseList.courses.reduce((count, course) => {
    if (course.type === COURSE_TYPE.SEL_TOPIC.en) {
      return count + getUniqueTopicsWithTQF(course.sections!).length;
    }
    return count + 1;
  }, 0);

  const courseTable = (index: number, course: Partial<IModelCourse>) => {
    const insList = getUniqueInstructors(course.sections!);
    const uniqueTopic = getUniqueTopicsWithTQF(course.sections!);
    return course.type == COURSE_TYPE.SEL_TOPIC.en ? (
      uniqueTopic.map((sec, indexSec) => {
        return (
          <Table.Tr key={`${course.courseNo}${sec.topic}${index}`}>
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
              {insList.map((ins, index1) => {
                return (
                  <div key={`${sec.topic}${index1}`} className="flex flex-col">
                    <p>{ins}</p>
                  </div>
                );
              })}
            </Table.Td>
            <Table.Td>
              <div className="flex gap-2">
                <div
                  className="px-4 py-2 w-fit tag-tqf rounded-[20px]  text-[12px] font-medium flex items-center"
                  tqf-status={sec ? sec.TQF3?.status : course.TQF3?.status}
                >
                  {sec ? sec.TQF3?.status : course.TQF3?.status}
                </div>

                {sec.TQF3?.status === TQF_STATUS.DONE && (
                  <>
                    <Tooltip
                      withArrow
                      arrowPosition="side"
                      arrowOffset={50}
                      arrowSize={7}
                      position="bottom-end"
                      label={
                        <div className="text-default font-semibold text-[13px] p-1">
                          Export TQF3
                        </div>
                      }
                      color="#FCFCFC"
                    >
                      <Button
                        variant="light"
                        className="tag-tqf  !px-3 !rounded-full text-center"
                        onClick={() => {
                          setExportDataTQF3({
                            ...sec.TQF3!,
                            courseNo: course.courseNo,
                          });
                          setOpenModalExportTQF3(true);
                        }}
                      >
                        <Icon
                          className="size-5"
                          IconComponent={IconFileExport}
                        />
                      </Button>
                    </Tooltip>
                    {/* <CopyButton
                      value={`${window.location.origin.toString()}${
                        ROUTE_PATH.COURSE_SYLLABUS
                      }/${sec.TQF3?.id}?courseNo=${course.courseNo}&year=${
                        course.year
                      }&semester=${course.semester}`}
                      timeout={2000}
                    >
                      {({ copied, copy }) => (
                        <Tooltip
                          withArrow
                          arrowPosition="side"
                          arrowOffset={50}
                          arrowSize={7}
                          position="bottom-end"
                          label={
                            <div className="text-default font-semibold text-[13px] p-1">
                              Course Syllabus
                            </div>
                          }
                          color="#FCFCFC"
                        >
                          <Button
                            variant="light"
                            className="tag-tqf !px-3 !rounded-full text-center"
                            onClick={copy}
                          >
                            {copied ? (
                              <HiCheck size={20} />
                            ) : (
                              <HiOutlineClipboardCopy size={20} />
                            )}
                          </Button>
                        </Tooltip>
                      )}
                    </CopyButton> */}
                  </>
                )}
              </div>
            </Table.Td>
            <Table.Td>
              <div className="flex gap-2">
                <div
                  className="px-4 py-2 w-fit tag-tqf rounded-[20px] text-[12px] font-medium flex items-center"
                  tqf-status={sec ? sec.TQF5?.status : course.TQF5?.status}
                >
                  {sec ? sec.TQF5?.status : course.TQF5?.status}
                </div>

                {sec.TQF5?.status === TQF_STATUS.DONE && (
                  <Tooltip
                    withArrow
                    arrowPosition="side"
                    arrowOffset={50}
                    arrowSize={7}
                    position="bottom-end"
                    label={
                      <div className="text-default font-semibold text-[13px] p-1">
                        Export TQF5
                      </div>
                    }
                    color="#FCFCFC"
                  >
                    <Button
                      variant="light"
                      className="tag-tqf  !px-3 !rounded-full text-center"
                      onClick={() => {
                        setExportDataTQF5({
                          ...sec.TQF5!,
                          courseNo: course.courseNo,
                        });
                        setTqf3(sec.TQF3!);
                        setOpenModalExportTQF5(true);
                      }}
                    >
                      <Icon className="size-5" IconComponent={IconFileExport} />
                    </Button>
                  </Tooltip>
                )}
              </div>
            </Table.Td>
            <Table.Td>
              <div className="flex gap-3 h-full">
                <Menu
                  trigger="hover"
                  openDelay={100}
                  closeDelay={150}
                  clickOutsideEvents={["mousedown", "touchstart"]}
                  classNames={{ item: "text-[#3e3e3e] h-8 w-full" }}
                >
                  <Menu.Target>
                    <Button
                      variant="outline"
                      className="tag-tqf !px-3 !rounded-full text-center"
                    >
                      <Icon className="size-5" IconComponent={IconActionTQF} />
                    </Button>
                  </Menu.Target>

                  <Menu.Dropdown
                    className="!z-50 rounded-md bg-white"
                    style={{
                      boxShadow: "rgba(0, 0, 0, 0.15) 0px 2px 8px",
                      transform: "translate(-78px, -3px)", // Position as needed
                    }}
                  >
                    <div className="flex flex-col">
                      <Menu.Item
                        leftSection={
                          <Icon className="size-5" IconComponent={IconTQF3} />
                        }
                        className="!w-48"
                        onClick={() => {
                          goToPage(ROUTE_PATH.TQF3, course.courseNo!, sec);
                        }}
                      >
                        Edit TQF 3
                      </Menu.Item>
                      <Menu.Item
                        leftSection={
                          <Icon className="size-5" IconComponent={IconTQF5} />
                        }
                        className="!w-48"
                        disabled={sec.TQF3?.status !== TQF_STATUS.DONE}
                        onClick={() => {
                          goToPage(ROUTE_PATH.TQF5, course.courseNo!, sec);
                        }}
                      >
                        Edit TQF 5
                      </Menu.Item>
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
          {insList.map((ins, index1) => {
            return (
              <div key={`${index}-${index1}`} className="flex flex-col">
                <p>{ins}</p>
              </div>
            );
          })}
        </Table.Td>
        <Table.Td>
          <div className="flex gap-2 ">
            <div
              className="px-4 py-2 w-fit tag-tqf rounded-[20px] text-[12px] font-medium flex items-center"
              tqf-status={course.TQF3?.status}
            >
              {course.TQF3?.status}
            </div>
            {course.TQF3?.status === TQF_STATUS.DONE && (
              <>
                <Tooltip
                  withArrow
                  arrowPosition="side"
                  arrowOffset={50}
                  arrowSize={7}
                  position="bottom-end"
                  label={
                    <div className="text-default font-semibold text-[13px] p-1">
                      Export TQF3
                    </div>
                  }
                  color="#FCFCFC"
                >
                  <Button
                    variant="light"
                    className="tag-tqf !px-3 !rounded-full text-center"
                    onClick={() => {
                      setExportDataTQF3({
                        ...course.TQF3!,
                        courseNo: course.courseNo,
                      });
                      setOpenModalExportTQF3(true);
                    }}
                  >
                    <Icon className="size-5" IconComponent={IconFileExport} />
                  </Button>
                </Tooltip>
                {/* <CopyButton
                  value={`${window.location.origin.toString()}${
                    ROUTE_PATH.COURSE_SYLLABUS
                  }/${course.TQF3?.id}?courseNo=${course.courseNo}&year=${
                    course.year
                  }&semester=${course.semester}`}
                  timeout={2000}
                >
                  {({ copied, copy }) => (
                    <Tooltip
                      withArrow
                      arrowPosition="side"
                      arrowOffset={50}
                      arrowSize={7}
                      position="bottom-end"
                      label={
                        <div className="text-default font-semibold text-[13px] p-1">
                          {copied ? "Copied" : "Course Syllabus"}
                        </div>
                      }
                      color="#FCFCFC"
                    >
                      <Button
                        variant="light"
                        className="tag-tqf !px-3 !rounded-full text-center"
                        onClick={copy}
                      >
                        {copied ? (
                          <HiCheck size={20} />
                        ) : (
                          <HiOutlineClipboardCopy size={20} />
                        )}
                      </Button>
                    </Tooltip>
                  )}
                </CopyButton> */}
              </>
            )}
          </div>
        </Table.Td>
        <Table.Td>
          <div className="flex gap-2 ">
            <div
              className="px-4 py-2 w-fit tag-tqf rounded-[20px] text-[12px] font-medium flex items-center"
              tqf-status={course.TQF5?.status}
            >
              {course.TQF5?.status}
            </div>
            {course.TQF5?.status === TQF_STATUS.DONE && (
              <Tooltip
                withArrow
                arrowPosition="side"
                arrowOffset={50}
                arrowSize={7}
                position="bottom-end"
                label={
                  <div className="text-default font-semibold text-[13px] p-1">
                    Export TQF5
                  </div>
                }
                color="#FCFCFC"
              >
                <Button
                  variant="light"
                  className="tag-tqf !px-3 !rounded-full text-center"
                  onClick={() => {
                    setExportDataTQF5({
                      ...course.TQF5!,
                      courseNo: course.courseNo,
                    });
                    setTqf3(course.TQF3!);
                    setOpenModalExportTQF5(true);
                  }}
                >
                  <Icon className="size-5" IconComponent={IconFileExport} />
                </Button>
              </Tooltip>
            )}
          </div>
        </Table.Td>
        <Table.Td>
          <div className="flex gap-3 h-full">
            <Menu
              trigger="hover"
              openDelay={100}
              closeDelay={150}
              clickOutsideEvents={["mousedown", "touchstart"]}
              classNames={{ item: "text-[#3e3e3e] h-8 w-full" }}
            >
              <Menu.Target>
                <Button
                  variant="outline"
                  className="tag-tqf !px-3 !rounded-full text-center"
                >
                  <Icon className="size-5 ml-1" IconComponent={IconActionTQF} />
                </Button>
              </Menu.Target>

              <Menu.Dropdown
                className="!z-50 rounded-md bg-white"
                style={{
                  boxShadow: "rgba(0, 0, 0, 0.15) 0px 2px 8px",
                  transform: "translate(-78px, -3px)", // Position as needed
                }}
              >
                <div className="flex flex-col">
                  <Menu.Item
                    leftSection={
                      <Icon className="size-5" IconComponent={IconTQF3} />
                    }
                    className="!w-48"
                    onClick={() => {
                      goToPage(ROUTE_PATH.TQF3, course.courseNo!, course);
                    }}
                  >
                    Edit TQF 3
                  </Menu.Item>
                  <Menu.Item
                    leftSection={
                      <Icon className="size-5" IconComponent={IconTQF5} />
                    }
                    className="!w-48"
                    disabled={course.TQF3?.status !== TQF_STATUS.DONE}
                    onClick={() => {
                      goToPage(ROUTE_PATH.TQF5, course.courseNo!, course);
                    }}
                  >
                    Edit TQF 5
                  </Menu.Item>
                </div>
              </Menu.Dropdown>
            </Menu>
          </div>
        </Table.Td>
      </Table.Tr>
    );
  };

  const filterTQF3 = () => (
    <div>
      <p className="mb-3 text-b2 font-bold text-secondary">TQF 3</p>
      <div className="flex flex-col justify-center gap-3 pr-10">
        {["Done", "In Progress", "No Data"].map((status) => (
          <Checkbox
            key={status}
            checked={tqf3Filters.includes(status)}
            onChange={(e) => handleTqf3FilterChange(status, e.target.checked)}
            label={
              <div
                className="px-3 py-2 w-fit tag-tqf rounded-[20px] -translate-y-1 text-[12px] font-medium"
                tqf-status={status}
              >
                {status}
              </div>
            }
          />
        ))}
      </div>
    </div>
  );

  const filterTQF5 = () => (
    <div>
      <p className="my-3 text-b2 font-bold text-secondary">TQF 5</p>
      <div className="flex flex-col justify-center gap-3 pr-10">
        {["Done", "In Progress", "No Data"].map((status) => (
          <Checkbox
            key={status}
            checked={tqf5Filters.includes(status)}
            onChange={(e) => handleTqf5FilterChange(status, e.target.checked)}
            label={
              <div
                className="px-3 py-2 w-fit tag-tqf rounded-[20px] -translate-y-1 text-[12px] font-medium"
                tqf-status={status}
              >
                {status}
              </div>
            }
          />
        ))}
      </div>
    </div>
  );

  return (
    <>
      <ModalExportTQF3
        opened={openModalExportTQF3}
        onClose={() => {
          setOpenModalExportTQF3(false);
          setExportDataTQF3({});
        }}
        dataTQF={exportDataTQF3}
      />
      <ModalExportTQF5
        opened={openModalExportTQF5}
        onClose={() => {
          setOpenModalExportTQF5(false);
          setExportDataTQF5({});
        }}
        dataTQF={exportDataTQF5}
        tqf3={tqf3?.id!}
      />

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
                In{" "}
                {selectCurriculum.code?.includes("All")
                  ? selectCurriculum.code
                  : `${selectCurriculum.code} Curriculum`}{" "}
                {courseList.courses.length === 0 ? (
                  <span>Course is currently empty</span>
                ) : (
                  <span>
                    have{" "}
                    <span className="text-[#1f69f3] font-semibold">
                      {courseList.total} Course
                      {courseList.total > 1 ? "s " : " "}
                    </span>
                    on this semester.
                  </span>
                )}
              </p>
            )}
          </div>
          <div className="flex gap-3 flex-wrap">
            <Menu
              trigger="click"
              openDelay={100}
              clickOutsideEvents={["mousedown"]}
              classNames={{ item: "text-[#3e3e3e] h-8 w-full" }}
            >
              <Menu.Target>
                <Button
                  variant="outline"
                  className="text-center pr-4 pl-3"
                  leftSection={
                    <Icon
                      className="stroke-[1.3px] size-5"
                      IconComponent={IconFilter}
                    />
                  }
                >
                  Filter
                </Button>
              </Menu.Target>
              <Menu.Dropdown
                className="!z-50 rounded-md -translate-y-[3px] p-4 translate-x-[-18px] bg-white"
                style={{ boxShadow: "rgba(0, 0, 0, 0.15) 0px 2px 8px" }}
              >
                {filterTQF3()}
                {filterTQF5()}
              </Menu.Dropdown>
            </Menu>
          </div>
        </div>
        <Tabs
          classNames={{
            root: "overflow-hidden flex -mt-1 px-6 flex-col h-full",
          }}
          value={selectCurriculum.code}
          onChange={(event) => {
            if (event?.includes("All"))
              setSelectCurriculum({
                nameEN: "All Courses",
                code: "All Courses",
              });
            else
              setSelectCurriculum(
                curriculumList.find(({ code }) => code == event)!
              );
            setPayload({ ...payload });
          }}
        >
          <Tabs.List className="mb-2 flex flex-nowrap overflow-x-auto">
            {user.role == ROLE.ADMIN && (
              <Tabs.Tab value="All Courses">All Courses</Tabs.Tab>
            )}
            {curriculumList?.map((cur) => (
              <Tabs.Tab key={cur.code} value={cur.code}>
                {cur.code}
              </Tabs.Tab>
            ))}
          </Tabs.List>

          <Tabs.Panel
            className="flex flex-col h-full w-full overflow-auto gap-1"
            value={selectCurriculum.code || "All"}
          >
            <div className="flex h-full w-full pt-2 pb-5 overflow-hidden">
              {loading ? (
                <Loading />
              ) : courseList.courses.length ? (
                <InfiniteScroll
                  dataLength={totalRows}
                  next={onShowMore}
                  height={"100%"}
                  hasMore={
                    tqf3Filters.length || tqf5Filters.length
                      ? false
                      : payload?.hasMore
                  }
                  className="overflow-y-auto overflow-x-auto w-full h-fit max-h-full border flex flex-col rounded-lg border-secondary"
                  style={{ height: "fit-content" }}
                  loader={<Loading />}
                >
                  <Table stickyHeader>
                    <Table.Thead>
                      <Table.Tr>
                        <Table.Th className="border-r macair133:w-[10%] ipad11:w-[15%] !border-[#cecece] sm:text-b4 ipad11:text-b2">
                          Course No.
                        </Table.Th>
                        <Table.Th className="w-[30%] ipad11:text-b2  sm:text-b4">
                          Course Name
                        </Table.Th>
                        <Table.Th className="w-[15%] ipad11:text-b2 sm:text-b4">
                          Instructor
                        </Table.Th>
                        <Table.Th className="w-[10%] ipad11:text-b2 sm:text-b4 sm:max-macair133:w-[14.5%]">
                          TQF 3
                        </Table.Th>
                        <Table.Th className="w-[10%] ipad11:text-b2 sm:text-b4 sm:max-macair133:w-[14.5%]">
                          TQF 5
                        </Table.Th>
                        <Table.Th className="w-[10%] ipad11:text-b2 sm:text-b4 sm:max-macair133:w-[11%]">
                          Action
                        </Table.Th>
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
                  <div className="h-full justify-center flex flex-col">
                    <p className="text-secondary text-[22px] font-semibold">
                      {courseList.search.length
                        ? `No results for "${courseList.search}"`
                        : "No Course Found"}
                    </p>
                    <br />
                    <p className="-mt-4 mb-6 text-b2 break-words font-medium leading-relaxed">
                      {courseList.search.length ? (
                        <>Check the spelling or try a new search.</>
                      ) : (tqf3Filters.length &&
                          courseList.courses.length === 0) ||
                        (tqf5Filters.length &&
                          courseList.courses.length === 0) ? (
                        <span>
                          We couldn’t find any courses that match your filter.
                        </span>
                      ) : (
                        <span>
                          It looks like no courses have been added <br /> in
                          this semester yet.
                        </span>
                      )}
                    </p>
                    <br />
                  </div>
                  <div className="h-full  w-[24vw] justify-center flex flex-col">
                    <img src={notFoundImage} alt="notFound"></img>
                  </div>
                </div>
              )}
            </div>
          </Tabs.Panel>
        </Tabs>
      </div>
    </>
  );
}
