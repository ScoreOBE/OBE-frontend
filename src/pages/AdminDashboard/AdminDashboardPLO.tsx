import { useAppDispatch, useAppSelector } from "@/store";
import { useEffect, useState } from "react";
import { Button, Menu, Table, Tabs } from "@mantine/core";
import Icon from "@/components/Icon";
import IconDots from "@/assets/icons/dots.svg?react";
import IconExcel from "@/assets/icons/excel.svg?react";
import IconPLO from "@/assets/icons/PLOdescription.svg?react";
import { useSearchParams } from "react-router-dom";
import { getCourse } from "@/services/course/course.service";
import { CourseRequestDTO } from "@/services/course/dto/course.dto";
import { IModelAcademicYear } from "@/models/ModelAcademicYear";
import notFoundImage from "@/assets/image/notFound.jpg";
import Loading from "@/components/Loading/Loading";
import { setLoading } from "@/store/loading";
import { setDashboard, setShowNavbar, setShowSidebar } from "@/store/config";
import {
  addLoadMoreAllCourse,
  setAllCourseList,
  setSearchCurriculum,
} from "@/store/allCourse";
import { IModelPLO, IModelPLONo } from "@/models/ModelPLO";
import ModalExportPLO from "@/components/Modal/ModalExportPLO";
import { getOnePLO } from "@/services/plo/plo.service";
import DrawerPLOdes from "@/components/DrawerPLO";
import { getUniqueTopicsWithTQF } from "@/helpers/functions/function";
import { COURSE_TYPE, ROLE } from "@/helpers/constants/enum";
import { IModelTQF3 } from "@/models/ModelTQF3";
import { IModelTQF5 } from "@/models/ModelTQF5";
import PLOSelectCourseView from "@/components/Modal/PLOAdmin/PLOSelectCourseView";
import PLOYearView from "@/components/Modal/PLOAdmin/PLOYearView";
import { IModelCurriculum } from "@/models/ModelFaculty";
import InfiniteScroll from "react-infinite-scroll-component";
import { sortBy } from "lodash";

export default function AdminDashboardPLO() {
  const loading = useAppSelector((state) => state.loading.loading);
  const user = useAppSelector((state) => state.user);
  const curriculum = useAppSelector((state) => state.faculty.curriculum);
  const academicYear = useAppSelector((state) => state.academicYear);
  const courseList = useAppSelector((state) => state.allCourse);
  const dispatch = useAppDispatch();
  const [payload, setPayload] = useState<any>();
  const [params, setParams] = useSearchParams({});
  const [term, setTerm] = useState<Partial<IModelAcademicYear>>({});
  const [curriculumList, setCurriculumList] = useState<IModelCurriculum[]>([]);
  const [selectCurriculum, setSelectCurriculum] = useState<
    Partial<IModelCurriculum>
  >({});
  const [curriculumPLO, setCurriculumPLO] = useState<Partial<IModelPLO>>({});
  const [openDrawerPLOdes, setOpenDrawerPLOdes] = useState(false);
  const [openModalExportPLO, setOpenModalExportPLO] = useState(false);
  const [openPLOYearView, setOpenPLOYearView] = useState(false);
  const [openPLOSelectCourseView, setOpenPLOSelectCourseView] = useState(false);

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
    }
  }, [academicYear, term, params]);

  useEffect(() => {
    if (!selectCurriculum.code && curriculumList.length) {
      setSelectCurriculum({
        nameEN: curriculumList[0].code,
        code: curriculumList[0].code,
      });
    }
  }, [curriculumList]);

  useEffect(() => {
    if (term) {
      setPayload(initialPayload());
      localStorage.removeItem("search");
    }
  }, [localStorage.getItem("search")]);

  useEffect(() => {
    if (term.id && curriculumList?.length && selectCurriculum.code) {
      if (!curriculumPLO.curriculum?.includes(selectCurriculum.code)) {
        fetchPLO();
      }
      fetchCourse();
    }
  }, [selectCurriculum]);

  const fetchPLO = async () => {
    const resPloCol = await getOnePLO({
      year: term.year,
      semester: term.semester,
      curriculum: selectCurriculum.code,
    });
    if (resPloCol) {
      setCurriculumPLO(resPloCol);
    }
  };

  const initialPayload = () => {
    const dep = [selectCurriculum.code!];
    dispatch(setSearchCurriculum(dep));
    return {
      ...new CourseRequestDTO(),
      manage: true,
      ploRequire: true,
      year: term.year!,
      semester: term.semester!,
      curriculum: dep,
      search: courseList.search,
      hasMore: courseList.total >= payload?.limit,
    };
  };

  const fetchCourse = async () => {
    if (!user.termsOfService) return;
    dispatch(setLoading(true));
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

  const totalRows = courseList.courses.reduce((count, course) => {
    if (course.type === COURSE_TYPE.SEL_TOPIC.en) {
      return count + getUniqueTopicsWithTQF(course.sections!).length;
    }
    return count + 1;
  }, 0);

  const courseView = (plo: Partial<IModelPLO>) => {
    const ploScores = (
      ploRequire: string[],
      tqf3: IModelTQF3,
      tqf5: IModelTQF5
    ) => {
      return plo.data?.map((item) => {
        // if (!ploRequire?.includes(item.id)) {
        //   return <Table.Th key={item.id}>-</Table.Th>;
        // }
        const clos = tqf3.part7?.list
          ?.find((e) => e.curriculum == selectCurriculum.code)
          ?.data.filter(({ plos }) => (plos as string[]).includes(item.id))
          .map(({ clo }) => clo);
        const sum = clos?.length
          ? tqf5.part3?.data
              .filter(({ clo }) => clos?.includes(clo))
              .reduce((a, b) => a + b.score, 0)
          : undefined;
        const score = sum ? sum / (clos?.length ?? 1) : undefined;
        return <Table.Th key={item.id}>{score?.toFixed(2) ?? "-"}</Table.Th>;
      });
    };
    return (
      <Table stickyHeader striped>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Course no.</Table.Th>
            <Table.Th>Name</Table.Th>
            {plo.data?.map((item) => (
              <Table.Th key={item.id}>PLO-{item.no}</Table.Th>
            ))}
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody className="text-default font-medium text-[13px]">
          {courseList.courses
            .filter((course) =>
              course.sections.some(
                ({ curriculum }) =>
                  curriculum && plo.curriculum?.includes(curriculum)
              )
            )
            .map((course, index) => {
              const uniqueTopic = getUniqueTopicsWithTQF(course.sections!);
              let ploRequire =
                course.ploRequire?.find(
                  (item) =>
                    item.curriculum == selectCurriculum.code &&
                    item.plo == plo.id
                )?.list || [];
              let ploItem = sortBy(
                ploRequire.map((plo) => ({
                  plo: curriculumPLO.data?.find(({ id }) => id == plo)?.no,
                })),
                "plo"
              );
              return course.type == COURSE_TYPE.SEL_TOPIC.en ? (
                uniqueTopic.map((sec, indexSec) => {
                  ploRequire =
                    sec.ploRequire?.find(
                      (item) =>
                        item.curriculum == selectCurriculum.code &&
                        item.plo == plo.id
                    )?.list || [];
                  ploItem = sortBy(
                    ploRequire.map((plo) => ({
                      plo: curriculumPLO.data?.find(({ id }) => id == plo)?.no,
                    })),
                    "plo"
                  );
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
                          {!!ploItem.length && (
                            <>
                              <span>PLO Require: </span>
                              {ploItem.map((plo, ploIndex) => {
                                return (
                                  <span
                                    key={ploIndex}
                                    className="text-secondary"
                                  >
                                    PLO {plo.plo}
                                    {ploIndex < ploItem.length - 1 && ", "}
                                  </span>
                                );
                              })}
                            </>
                          )}
                        </div>
                      </Table.Td>
                      {ploScores(ploRequire, sec.TQF3!, sec.TQF5!)}
                    </Table.Tr>
                  );
                })
              ) : (
                <Table.Tr key={index}>
                  <Table.Td className="border-r !border-[#cecece]">
                    {course.courseNo}
                  </Table.Td>
                  <Table.Td>
                    <div>
                      <p>{course.courseName}</p>
                      {!!ploItem.length && (
                        <>
                          <span>PLO Require: </span>
                          {ploItem.map((plo, ploIndex) => {
                            return (
                              <span key={ploIndex} className="text-secondary">
                                PLO {plo.plo}
                                {ploIndex < ploItem.length - 1 && ", "}
                              </span>
                            );
                          })}
                        </>
                      )}
                    </div>
                  </Table.Td>
                  {ploScores(ploRequire, course.TQF3!, course.TQF5!)}
                </Table.Tr>
              );
            })}
        </Table.Tbody>
      </Table>
    );
  };

  return (
    <>
      {curriculumPLO && (
        <DrawerPLOdes
          opened={openDrawerPLOdes}
          onClose={() => setOpenDrawerPLOdes(false)}
          data={curriculumPLO}
        />
      )}
      <ModalExportPLO
        opened={openModalExportPLO}
        onClose={() => setOpenModalExportPLO(false)}
      />
      <PLOSelectCourseView
        opened={openPLOSelectCourseView}
        onClose={() => setOpenPLOSelectCourseView(false)}
      />
      <PLOYearView
        opened={openPLOYearView}
        onClose={() => setOpenPLOYearView(false)}
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
                In semester{" "}
                <span className="text-[#1f69f3] font-semibold">
                  {" "}
                  {term?.semester ?? ""}/{term?.year ?? ""}!
                </span>{" "}
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
              color="#e9e9e9"
              className="text-center px-4 !text-default"
              onClick={() => setOpenDrawerPLOdes(true)}
              disabled={!curriculumPLO.id}
            >
              <div className="flex gap-2">
                <Icon IconComponent={IconPLO} />
                PLO Description
              </div>
            </Button>

            <Menu trigger="click" position="bottom-end">
              <Menu.Target>
                <div className="rounded-full hover:bg-gray-300 p-1 cursor-pointer">
                  <Icon IconComponent={IconDots} />
                </div>
              </Menu.Target>
              <Menu.Dropdown
                className="rounded-md translate-y-1 backdrop-blur-xl bg-white"
                style={{
                  boxShadow: "0px 0px 4px 0px rgba(0, 0, 0, 0.25)",
                }}
              >
                <Menu.Item
                  onClick={() => setOpenPLOYearView(true)}
                  className=" text-[#3e3e3e] mb-[2px] font-semibold text-b4 h-7  acerSwift:max-macair133:!text-b5"
                >
                  <div className="flex justify-between items-center gap-2">
                    <div className="flex gap-2 items-center acerSwift:max-macair133:text-b5">
                      <span className="pr-10"> Year View </span>
                    </div>{" "}
                  </div>
                </Menu.Item>
                <Menu.Item
                  onClick={() => setOpenPLOSelectCourseView(true)}
                  className=" text-[#3e3e3e] mb-[2px] font-semibold text-b4 h-7  acerSwift:max-macair133:!text-b5"
                >
                  <div className="flex justify-between items-center gap-2">
                    <div className="flex gap-2 items-center acerSwift:max-macair133:text-b5">
                      <span className="pr-10">Academic View </span>
                    </div>{" "}
                  </div>
                </Menu.Item>

                <Menu.Item
                  onClick={() => setOpenModalExportPLO(true)}
                  className=" text-[#20884f] hover:bg-[#06B84D]/10 font-semibold text-b4 acerSwift:max-macair133:!text-b5 h-7 "
                >
                  <div className="flex items-center  gap-2">
                    <Icon
                      className="size-4 acerSwift:max-macair133:!size-3.5"
                      IconComponent={IconExcel}
                    />
                    <span>Export PLO</span>
                  </div>
                </Menu.Item>
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
            setSelectCurriculum(
              curriculumList.find(({ code }) => code == event)!
            );
            setPayload({ ...payload });
          }}
        >
          <Tabs.List className="mb-2 flex flex-nowrap overflow-x-auto">
            {curriculumList?.map((cur) => (
              <Tabs.Tab key={cur.code} value={cur.code!}>
                {cur.code}
              </Tabs.Tab>
            ))}
          </Tabs.List>
          <Tabs.Panel
            className="flex flex-col h-full w-full overflow-auto gap-1"
            value={selectCurriculum.code || "All"}
          >
            <div className="flex h-full w-full pb-5 pt-2 overflow-hidden">
              {loading ? (
                <Loading />
              ) : curriculumPLO.id ? (
                <div className="flex flex-col h-full w-full overflow-auto gap-1">
                  {courseList.courses.length ? (
                    <InfiniteScroll
                      dataLength={totalRows}
                      next={onShowMore}
                      height={"100%"}
                      hasMore={payload?.hasMore}
                      className="overflow-y-auto overflow-x-auto w-full h-fit max-h-full border flex flex-col rounded-lg border-secondary"
                      style={{ height: "fit-content" }}
                      loader={<Loading />}
                    >
                      {/* <div className="overflow-y-auto overflow-x-auto w-full h-fit max-h-full border flex flex-col rounded-lg border-secondary"> */}
                      {courseView(curriculumPLO)}
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
                            <>
                              It looks like you haven't added any courses yet.
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
              ) : (
                <div className=" flex flex-row px-[75px] flex-1 justify-between">
                  <div className="h-full  justify-center flex flex-col">
                    <p className="text-secondary text-[22px] font-semibold">
                      No PLO Found
                    </p>
                    <br />
                    <p className=" -mt-4 mb-6 text-b2 break-words font-medium leading-relaxed">
                      It looks like admin haven't added any PLO with{" "}
                      {selectCurriculum.code} yet.
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
