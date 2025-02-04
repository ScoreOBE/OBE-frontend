import { useAppDispatch, useAppSelector } from "@/store";
import { useEffect, useState } from "react";
import { Button, Table, Tabs, Tooltip } from "@mantine/core";
import Icon from "@/components/Icon";
import IconPLO from "@/assets/icons/PLOdescription.svg?react";
import IconInfo2 from "@/assets/icons/Info2.svg?react";
import IconCheck from "@/assets/icons/Check.svg?react";
import { useSearchParams } from "react-router-dom";
import { getCourse } from "@/services/course/course.service";
import { CourseRequestDTO } from "@/services/course/dto/course.dto";
import InfiniteScroll from "react-infinite-scroll-component";
import { IModelAcademicYear } from "@/models/ModelAcademicYear";
import notFoundImage from "@/assets/image/notFound.jpg";
import Loading from "@/components/Loading/Loading";
import { setLoading } from "@/store/loading";
import { setShowNavbar, setShowSidebar } from "@/store/config";
import {
  addLoadMoreAllCourse,
  setAllCourseList,
  setSearchCurriculum,
} from "@/store/allCourse";
import { getUniqueTopicsWithTQF } from "@/helpers/functions/function";
import { COURSE_TYPE } from "@/helpers/constants/enum";
import { IModelCourse, IModelSection } from "@/models/ModelCourse";
import { IModelCurriculum } from "@/models/ModelFaculty";
import DrawerPLOdes from "@/components/DrawerPLO";
import { IModelPLO } from "@/models/ModelPLO";
import { getOnePLO } from "@/services/plo/plo.service";
import { IModelPLORequire } from "@/models/ModelCourseManagement";

export default function AdminDashboardCLO() {
  const loading = useAppSelector((state) => state.loading.loading);
  const user = useAppSelector((state) => state.user);
  const curriculum = useAppSelector((state) => state.faculty.curriculum);
  const academicYear = useAppSelector((state) => state.academicYear);
  const courseList = useAppSelector((state) => state.allCourse);
  const [curriculumPLO, setCurriculumPLO] = useState<Partial<IModelPLO>>({});
  const dispatch = useAppDispatch();
  const [payload, setPayload] = useState<any>();
  const [params, setParams] = useSearchParams({});
  const [term, setTerm] = useState<Partial<IModelAcademicYear>>({});
  const [selectCurriculum, setSelectCurriculum] = useState<
    Partial<IModelCurriculum>
  >({});
  const [openDrawerPLOdes, setOpenDrawerPLOdes] = useState(false);

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
    if (!selectCurriculum.code && curriculum?.length) {
      setSelectCurriculum(curriculum[0]);
    }
  }, [curriculum]);

  useEffect(() => {
    if (term) {
      setPayload(initialPayload());
      localStorage.removeItem("search");
    }
  }, [localStorage.getItem("search")]);

  useEffect(() => {
    if (term.id && curriculum?.length && selectCurriculum.code) {
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
    if (curriculum?.length) {
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

  const dataTable = (
    index: number,
    course: Partial<IModelCourse>,
    sec?: Partial<IModelSection>
  ) => {
    const dataTQF3 = sec?.TQF3 || course.TQF3;
    const ploRequire: IModelPLORequire[] = sec
      ? (sec as any).ploRequire
      : (course as any).ploRequire;
    const ploRequireNo = curriculumPLO?.data?.filter((plo) => {
      if (ploRequire?.[0]?.list) {
        return ploRequire[0].list.some((item) =>
          plo.id.includes(item.toString())
        );
      }
    });
    return dataTQF3?.part2 ? (
      dataTQF3.part2!.clo.map((clo) => (
        <Table.Tr key={`${index}-${clo.id}`}>
          {clo.no == 1 && (
            <Table.Td rowSpan={dataTQF3.part2?.clo.length}>
              <div>
                <p>{course.courseNo}</p>
                <p>{course.courseName}</p>
                {!!ploRequireNo?.length && (
                  <>
                    <span>PLO Require: </span>
                    {ploRequireNo?.map((plo, index) => (
                      <span key={index} className="text-secondary">
                        PLO {plo.no}
                        {index < ploRequireNo.length - 1 && ", "}
                      </span>
                    ))}
                  </>
                )}
                {sec && <p>({sec.topic})</p>}
              </div>
            </Table.Td>
          )}
          <Table.Td className="flex gap-2 items-center">
            <p className="">CLO {clo.no}</p>
            <Tooltip
              arrowOffset={150}
              arrowSize={8}
              arrowRadius={1}
              transitionProps={{
                transition: "fade",
                duration: 300,
              }}
              multiline
              withArrow
              label={
                <div className="text-emphasize text-[13px] p-2 flex flex-col gap-1 w-fit max-w-[800px]">
                  <p className="text-secondary font-bold">CLO {clo.no}</p>

                  <p className="font-medium text-[13px] text-pretty ">
                    <div className="border-none">
                      <div className="flex">
                        <li></li>
                        <p>{clo.descTH}</p>
                      </div>
                      <div className="flex">
                        <li></li>
                        <p>{clo.descEN}</p>
                      </div>
                    </div>
                  </p>
                </div>
              }
              color="#FCFCFC"
              className="w-fit border  rounded-md "
              position="bottom-start"
            >
              <div className="border-none  p-0.5">
                <Icon
                  IconComponent={IconInfo2}
                  className="-ml-0 size-5 text-secondary"
                />
              </div>
            </Tooltip>
          </Table.Td>

          {curriculumPLO.data?.map((plo) => (
            <Table.Td key={plo.no} className={`text-secondary `}>
              {dataTQF3?.part7 ? (
                dataTQF3.part7!.data.some(
                  (item) =>
                    item.clo === clo.id &&
                    (item.plos as string[]).includes(plo.id)
                ) ? (
                  <div className="flex text-start">
                    <Icon IconComponent={IconCheck} />
                  </div>
                ) : (
                  <p>-</p>
                )
              ) : (
                <p>-</p>
              )}
            </Table.Td>
          ))}
        </Table.Tr>
      ))
    ) : (
      <Table.Tr key={`${index}-no-data`}>
        <Table.Td>
          <div>
            <p>{course.courseNo}</p>
            <p>{course.courseName}</p>
            {sec && <p>({sec.topic})</p>}
            {!!ploRequireNo?.length && (
              <>
                <span>PLO Require: </span>
                {ploRequireNo?.map((plo, index) => (
                  <span key={index} className="text-secondary">
                    PLO {plo.no}
                    {index < ploRequireNo.length - 1 && ", "}
                  </span>
                ))}
              </>
            )}
          </div>
        </Table.Td>
        <Table.Td>TQF 3 {dataTQF3?.status}</Table.Td>
        {curriculumPLO.data?.map((plo) => (
          <Table.Td key={plo.no} className="text-secondary">
            -
          </Table.Td>
        ))}
      </Table.Tr>
    );
  };

  const courseTable = (index: number, course: Partial<IModelCourse>) => {
    const uniqueTopic = getUniqueTopicsWithTQF(course.sections!);
    return course.type == COURSE_TYPE.SEL_TOPIC.en
      ? uniqueTopic.map((sec) => dataTable(index, course, sec))
      : dataTable(index, course);
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
                In {selectCurriculum.code} Curriculum{" "}
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
            <Button
              color="#e9e9e9"
              className="text-center px-4 !text-default"
              onClick={() => setOpenDrawerPLOdes(true)}
            >
              <div className="flex gap-2">
                <Icon IconComponent={IconPLO} />
                PLO Description
              </div>
            </Button>
          </div>
        </div>
        <Tabs
          classNames={{
            root: "overflow-hidden flex -mt-1 px-6 flex-col h-full",
          }}
          value={selectCurriculum.code}
          onChange={(event) => {
            setSelectCurriculum(curriculum.find(({ code }) => code == event)!);
            setPayload({ ...payload });
          }}
        >
          <Tabs.List className="mb-2 flex flex-nowrap overflow-x-auto">
            {curriculum?.map((cur) => (
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
                  <Table stickyHeader striped>
                    <Table.Thead>
                      <Table.Tr>
                        <Table.Th>Course</Table.Th>
                        <Table.Th className="w-[15%]">CLO</Table.Th>
                        {curriculumPLO.data?.map((plo) => (
                          <Table.Th key={plo.no}>PLO {plo.no}</Table.Th>
                        ))}
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
                <div className=" flex flex-row px-[75px] flex-1 justify-between">
                  <div className="h-full justify-center flex flex-col">
                    <p className="text-secondary text-[22px] font-semibold">
                      {courseList.search.length
                        ? `No results for "${courseList.search}" `
                        : "No Course Found"}
                    </p>
                    <br />
                    <p className=" -mt-4 mb-6 text-b2 font-medium break-words leading-relaxed">
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
          </Tabs.Panel>
        </Tabs>
      </div>
    </>
  );
}
