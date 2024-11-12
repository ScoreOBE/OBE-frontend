import { useAppDispatch, useAppSelector } from "@/store";
import { useEffect, useState } from "react";
import { Button, Checkbox, Menu, Table, Tabs, Tooltip } from "@mantine/core";
import Icon from "@/components/Icon";
import IconFilter from "@/assets/icons/filter.svg?react";
import IconEye from "@/assets/icons/eyePublish.svg?react";
import IconTQF3 from "@/assets/icons/TQF3.svg?react";
import IconTQF5 from "@/assets/icons/TQF5.svg?react";
import IconFileExport from "@/assets/icons/fileExport.svg?react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { getCourse } from "@/services/course/course.service";
import { CourseRequestDTO } from "@/services/course/dto/course.dto";
import InfiniteScroll from "react-infinite-scroll-component";
import { IModelAcademicYear } from "@/models/ModelAcademicYear";
import notFoundImage from "@/assets/image/notFound.jpg";
import { COURSE_TYPE, ROLE, TQF_STATUS } from "@/helpers/constants/enum";
import Loading from "@/components/Loading/Loading";
import { setLoading } from "@/store/loading";
import { setShowSidebar } from "@/store/showSidebar";
import { setShowNavbar } from "@/store/showNavbar";
import {
  addLoadMoreAllCourse,
  setAllCourseList,
  setSearchDepartmentCode,
} from "@/store/allCourse";
import {
  getUniqueInstructors,
  getUniqueTopicsWithTQF,
} from "@/helpers/functions/function";
import { IModelCourse } from "@/models/ModelCourse";
import { IModelDepartment } from "@/models/ModelFaculty";
import ModalExportTQF3 from "@/components/Modal/TQF3/ModalExportTQF3";
import { IModelTQF3 } from "@/models/ModelTQF3";
import { ROUTE_PATH } from "@/helpers/constants/route";
import { setDataTQF3, setSelectTqf3Topic } from "@/store/tqf3";
import { randomId, useListState } from "@mantine/hooks";

export default function AdminDashboardTQF() {
  const navigate = useNavigate();
  const loading = useAppSelector((state) => state.loading.loading);
  const user = useAppSelector((state) => state.user);
  const department = useAppSelector((state) => state.faculty.department);
  const academicYear = useAppSelector((state) => state.academicYear);
  const courseList = useAppSelector((state) => state.allCourse);
  const dispatch = useAppDispatch();
  const [payload, setPayload] = useState<any>({ page: 1, limit: 20 });
  const [params, setParams] = useSearchParams({});
  const [term, setTerm] = useState<Partial<IModelAcademicYear>>({});
  const [exportDataTQF, setExportDataTQF] = useState<
    Partial<IModelTQF3> & { courseNo?: string }
  >({});
  const [openModalExportTQF3, setOpenModalExportTQF3] = useState(false);
  const [selectDepartment, setSelectDepartment] = useState<
    Partial<IModelDepartment>
  >({});
  const [tqf3Filters, setTqf3Filters] = useState<string[]>([]);
  const [tqf5Filters, setTqf5Filters] = useState<string[]>([]);

  useEffect(() => {
    dispatch(setShowSidebar(true));
    dispatch(setShowNavbar(true));
    localStorage.setItem("dashboard", ROLE.ADMIN);
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
      if (term) {
        setSelectDepartment({
          departmentEN: "All Courses",
          codeEN: "All Courses",
        });
      }
    }
  }, [academicYear, term, params]);

  useEffect(() => {
    if (term.id && department.length && selectDepartment.codeEN) fetchCourse();
  }, [department, selectDepartment]);

  useEffect(() => {
    fetchCourse();
  }, [tqf3Filters, tqf5Filters]);

  useEffect(() => {
    if (term) {
      setPayload(initialPayload());
      localStorage.removeItem("search");
    }
  }, [localStorage.getItem("search")]);

  const initialPayload = () => {
    const dep = selectDepartment.codeEN?.includes("All")
      ? department.map((dep) => dep.codeEN!)
      : [selectDepartment.codeEN!];
    dispatch(setSearchDepartmentCode(dep));
    return {
      ...new CourseRequestDTO(),
      manage: true,
      year: term.year!,
      semester: term.semester!,
      departmentCode: dep,
      search: courseList.search,
      tqf3: tqf3Filters,
      tqf5: tqf5Filters,
      hasMore: courseList.total >= payload?.limit,
    };
  };

  const goToPage = (pathname: string, courseNo: string, data: any) => {
    dispatch(setDataTQF3(data.TQF3));
    if (data.topic) {
      dispatch(setSelectTqf3Topic(data.topic));
    }
    navigate({
      pathname: `${ROUTE_PATH.COURSE}/${courseNo}/${pathname}`,
      search: "?" + params.toString(),
    });
  };

  const fetchCourse = async () => {
    if (!user.termsOfService) return;
    dispatch(setLoading(true));
    if (department.length) {
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
                  className="px-3 py-2 w-fit tag-tqf rounded-[20px]  text-[12px] font-medium"
                  tqf-status={sec ? sec.TQF3?.status : course.TQF3?.status}
                >
                  {sec ? sec.TQF3?.status : course.TQF3?.status}
                </div>
                {sec.TQF3?.status === TQF_STATUS.DONE && (
                  <Tooltip
                    withArrow
                    arrowPosition="side"
                    arrowOffset={50}
                    arrowSize={7}
                    position="bottom-end"
                    label={
                      <div className="text-default font-semibold text-[13px] p-1">
                        Export TQF
                      </div>
                    }
                    color="#FCFCFC"
                  >
                    <Button
                      variant="light"
                      className="tag-tqf  !px-3 !rounded-full text-center"
                      onClick={() => {
                        setExportDataTQF({
                          ...sec.TQF3!,
                          courseNo: course.courseNo,
                        });
                        setOpenModalExportTQF3(true);
                      }}
                    >
                      <Icon className="size-5" IconComponent={IconFileExport} />
                    </Button>
                  </Tooltip>
                )}
              </div>
            </Table.Td>
            <Table.Td>
              <div
                className="px-3 py-2 w-fit tag-tqf rounded-[20px]  text-[12px] font-medium"
                tqf-status={sec ? sec.TQF5?.status : course.TQF5?.status}
              >
                {sec ? sec.TQF5?.status : course.TQF5?.status}
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
                      <Icon className="size-5" IconComponent={IconEye} />
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
                        View TQF 3
                      </Menu.Item>
                      <Menu.Item
                        leftSection={
                          <Icon className="size-5" IconComponent={IconTQF5} />
                        }
                        className="!w-48"
                        disabled
                      >
                        View TQF 5
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
          <div className="flex gap-2">
            <div
              className="px-3 py-2 w-fit tag-tqf rounded-[20px]  text-[12px] font-medium"
              tqf-status={course.TQF3?.status}
            >
              {course.TQF3?.status}
            </div>
            {course.TQF3?.status === TQF_STATUS.DONE && (
              <Tooltip
                withArrow
                arrowPosition="side"
                arrowOffset={50}
                arrowSize={7}
                position="bottom-end"
                label={
                  <div className="text-default font-semibold text-[13px] p-1">
                    Export TQF
                  </div>
                }
                color="#FCFCFC"
              >
                <Button
                  variant="light"
                  className="tag-tqf  !px-3 !rounded-full text-center"
                  onClick={() => {
                    setExportDataTQF({
                      ...course.TQF3!,
                      courseNo: course.courseNo,
                    });
                    setOpenModalExportTQF3(true);
                  }}
                >
                  <Icon className="size-5" IconComponent={IconFileExport} />
                </Button>
              </Tooltip>
            )}
          </div>
        </Table.Td>
        <Table.Td>
          <div
            className="px-3 py-2 w-fit tag-tqf rounded-[20px]  text-[12px] font-medium"
            tqf-status={course.TQF5?.status}
          >
            {course.TQF5?.status}
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
                  <Icon className="size-5" IconComponent={IconEye} />
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
                    View TQF 3
                  </Menu.Item>
                  <Menu.Item
                    leftSection={
                      <Icon className="size-5" IconComponent={IconTQF5} />
                    }
                    className="!w-48"
                    disabled
                  >
                    View TQF 5
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
          setExportDataTQF({});
        }}
        dataTQF={exportDataTQF}
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
                {selectDepartment.codeEN?.includes("All")
                  ? selectDepartment.codeEN
                  : `${selectDepartment.codeEN} Department`}{" "}
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
              </Menu.Target>{" "}
              <Menu.Dropdown
                className="!z-50 rounded-md -translate-y-[3px] p-4 translate-x-[-18px] bg-white"
                style={{ boxShadow: "rgba(0, 0, 0, 0.15) 0px 2px 8px" }}
              >
                {filterTQF3()}
                {filterTQF5()}
              </Menu.Dropdown>
            </Menu>
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
        <Tabs
          classNames={{
            root: "overflow-hidden flex -mt-1 px-6 flex-col h-full",
          }}
          value={selectDepartment.codeEN}
          onChange={(event) => {
            setSelectDepartment(department.find((dep) => dep.codeEN == event)!);
            setPayload({ ...payload });
          }}
        >
          <Tabs.List className="mb-2">
            {department.map((dep) => (
              <Tabs.Tab key={dep.codeEN} value={dep.codeEN!}>
                {dep.codeEN}
              </Tabs.Tab>
            ))}
          </Tabs.List>

          <Tabs.Panel
            className="flex flex-col h-full w-full overflow-auto gap-1"
            value={selectDepartment?.codeEN || "All"}
          >
            <div className="flex h-full w-full pt-2 pb-5 overflow-hidden">
              {loading ? (
                <Loading />
              ) : courseList.courses.length ? (
                <InfiniteScroll
                  dataLength={courseList.courses.length}
                  next={onShowMore}
                  height={"100%"}
                  hasMore={payload?.hasMore}
                  className="overflow-y-auto overflow-x-auto w-full h-fit max-h-full border flex flex-col rounded-lg border-secondary"
                  style={{
                    height: "fit-content",
                  }}
                  loader={<Loading />}
                >
                  <Table stickyHeader>
                    <Table.Thead>
                      <Table.Tr>
                        <Table.Th className="border-r macair133:w-[10%] ipad11:w-[15%] !border-[#cecece] sm:text-b3 ipad11:text-b2">
                          Course No.
                        </Table.Th>
                        <Table.Th className="w-[30%] ipad11:text-b2  sm:text-b3">
                          Course Name
                        </Table.Th>
                        <Table.Th className="w-[15%] ipad11:text-b2 sm:text-b3">
                          Instructor
                        </Table.Th>
                        <Table.Th className="w-[10%] ipad11:text-b2 sm:text-b3 sm:max-macair133:w-[14.5%]">
                          TQF 3
                        </Table.Th>
                        <Table.Th className="w-[10%] ipad11:text-b2 sm:text-b3 sm:max-macair133:w-[14.5%]">
                          TQF 5
                        </Table.Th>
                        <Table.Th className="w-[10%] ipad11:text-b2 sm:text-b3 sm:max-macair133:w-[11%]">
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
                        <>
                          It looks like no courses have been added <br /> in
                          this semester yet.
                        </>
                      )}
                    </p>
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
