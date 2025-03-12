import { useAppDispatch, useAppSelector } from "@/store";
import { useEffect, useMemo, useRef, useState } from "react";
import Breadcrumbs from "@/components/Breadcrumbs";
import { useParams, useSearchParams } from "react-router-dom";
import {
  getSectionNo,
  getUserName,
  isMobile,
} from "@/helpers/functions/function";
import { ROUTE_PATH } from "@/helpers/constants/route";
import needAccess from "@/assets/image/needAccess.jpg";
import { setDashboard, setShowNavbar, setShowSidebar } from "@/store/config";
import { IModelUser } from "@/models/ModelUser";
import Loading from "@/components/Loading/Loading";
import { Button, Table, TextInput } from "@mantine/core";
import Icon from "@/components/Icon";
import IconEdit from "@/assets/icons/edit.svg?react";
import IconSortAsc from "@/assets/icons/sortAsc.svg?react";
import IconSortDes from "@/assets/icons/sortDes.svg?react";
import IconNotSort from "@/assets/icons/arrowUpDown.svg?react";
import IconChart from "@/assets/icons/histogram.svg?react";
import IconChevronLeft from "@/assets/icons/chevronLeft.svg?react";
import IconChevronRight from "@/assets/icons/chevronRight.svg?react";
import { calStat, scrollToStudent } from "@/helpers/functions/score";
import { TbSearch } from "react-icons/tb";
import { cloneDeep } from "lodash";
import { ROLE } from "@/helpers/constants/enum";
import ModalEditStudentScore from "@/components/Modal/Score/ModalEditStudentScore";
import { IModelScore } from "@/models/ModelCourse";
import ModalEvalChart from "@/components/Modal/Score/ModalEvalChart";
import IconListSearch from "@/assets/icons/listSearch.svg?react";

export default function Students() {
  const { courseNo, sectionNo, name } = useParams();
  const loading = useAppSelector((state) => state.loading.loading);
  const user = useAppSelector((state) => state.user);
  const course = useAppSelector((state) =>
    state.course.courses.find((e) => e.courseNo == courseNo)
  );
  const section = cloneDeep(
    course?.sections.find((sec) => parseInt(sectionNo!) === sec.sectionNo)
  );
  const [students, setStudents] = useState<
    ({
      student: IModelUser;
      scores: IModelScore[];
    } & Record<string, any>)[]
  >([]);
  const assignment = section?.assignments?.find((item) => item.name == name);
  const studentRefs = useRef(new Map());
  const [studentMaxMin, setStudentMaxMin] = useState({
    max: [] as string[],
    min: [] as string[],
  });
  const [params, setParams] = useSearchParams();
  const dispatch = useAppDispatch();
  const [sort, setSort] = useState<any>({});
  const [filter, setFilter] = useState<string>("");
  const [openEditScore, setOpenEditScore] = useState(false);
  const [isSort, setIsSort] = useState(false);
  const [editScore, setEditScore] = useState<{
    student: IModelUser;
    questions: { name: string; score: number | string }[];
  }>();
  const [openModalChart, setOpenModalChart] = useState(false);
  const limit = 50;
  const [startEndPage, setStartEndPage] = useState({
    start: 1,
    end: limit,
    page: 1,
    scroll: null as null | "max" | "min",
  });

  const [items, setItems] = useState<any[]>([
    {
      title: "Your Course",
      path: `${ROUTE_PATH.INS_DASHBOARD}?${params.toString()}`,
    },
    {
      title: "Sections",
      path: `${ROUTE_PATH.COURSE}/${courseNo}/${
        ROUTE_PATH.SECTION
      }?${params.toString()}`,
    },
    {
      title: `Evaluation Section ${getSectionNo(sectionNo)}`,
      path: `${ROUTE_PATH.COURSE}/${courseNo}/${
        ROUTE_PATH.SECTION
      }/${sectionNo}/${ROUTE_PATH.EVALUATION}?${params.toString()}`,
    },
    { title: `${name}` },
  ]);

  useEffect(() => {
    dispatch(setShowSidebar(true));
    dispatch(setShowNavbar(true));
    dispatch(setDashboard(ROLE.INSTRUCTOR));
    localStorage.setItem("dashboard", ROLE.INSTRUCTOR);
  }, []);

  useEffect(() => {
    if (section?.students && !students.length && assignment?.questions) {
      setSort({
        studentId: null,
        score: null,
        ...assignment.questions.reduce((acc, item) => {
          (acc as any)[item.name] = null;
          return acc;
        }, {}),
      });
      setStudents(
        section?.students?.map((student) => {
          student.questions = student.scores
            .find(({ assignmentName }) => assignmentName == name)
            ?.questions.map((item) => ({
              ...item,
              score: item.score >= 0 ? item.score : "",
            }));
          student.sumScore = student.questions
            ?.filter(({ score }: any) => typeof score == "number")
            .reduce((sum: number, { score }: any) => sum + score, 0);
          return { ...student };
        })
      );
    }
  }, [section]);

  const fullScore =
    assignment?.questions.reduce((sum, { fullScore }) => sum + fullScore, 0) ||
    0;
  const scores = section?.students
    ?.map(({ scores }) =>
      scores
        .find(({ assignmentName }) => assignmentName == name)
        ?.questions?.filter(({ score }) => score >= 0)
        .reduce((sum, { score }) => sum + score, 0)
    )
    .filter((item) => item != undefined)
    .sort((a, b) => a - b) || [0];

  const totalStudent = useMemo(() => {
    return (
      section?.students?.filter((item) =>
        item.scores.find(({ assignmentName }) => assignmentName == name)
      ).length || 0
    );
  }, [section]);
  const { mean, sd, median, maxScore, minScore, q1, q3 } = calStat(
    scores,
    totalStudent
  );
  const k = Math.log2(totalStudent) + 1;
  const binWidth = (maxScore - minScore) / k;
  const scoresData = Array.from({ length: k }, (_, index) => {
    const start = minScore + index * binWidth;
    const end = start + binWidth;
    return {
      range: `${start.toFixed(2)} - ${end.toFixed(2)}`,
      start,
      end,
      Students: 0,
    };
  });
  scores.forEach((score) => {
    const binIndex = scoresData.findIndex(
      (item) => item.start <= score && item.end >= score
    );
    if (binIndex !== -1) {
      scoresData[binIndex].Students += 1;
    }
  });

  useEffect(() => {
    if (
      startEndPage.scroll == "min" &&
      studentRefs.current.get(studentMaxMin.min[0])
    ) {
      scrollToStudent(studentRefs, studentMaxMin.min);
    } else if (
      startEndPage.scroll == "max" &&
      studentRefs.current.get(studentMaxMin.max[0])
    ) {
      scrollToStudent(studentRefs, studentMaxMin.max);
    }
  }, [startEndPage, studentRefs]);

  const filteredData = useMemo(() => {
    if (!students.length) return [];
    return students?.filter(({ student }) =>
      parseInt(filter)
        ? student.studentId?.toString().includes(filter)
        : getUserName(student, 3)?.includes(filter)
    );
  }, [students, filter]);

  const studentFilter = useMemo(() => [...filteredData], [filteredData]);

  const onClickSort = (key: string) => {
    setIsSort(true);
    const currentSort = (sort as any)[key];
    const toggleSort = currentSort === null ? true : !currentSort;
    setSort((prev: any) => {
      const resetSort: any = {};
      for (const key in prev) {
        resetSort[key] = null;
      }
      resetSort[key] = toggleSort;
      return resetSort;
    });

    let newStudents = [...students];
    newStudents = newStudents.sort((a, b) => {
      if (key === "studentId") {
        return toggleSort
          ? a.student.studentId!.localeCompare(b.student.studentId!)
          : b.student.studentId!.localeCompare(a.student.studentId!);
      } else if (key === "score") {
        return toggleSort ? a.sumScore - b.sumScore : b.sumScore - a.sumScore;
      } else {
        const scoreA = a.questions.find((e: any) => e.name == key)?.score;
        const scoreB = b.questions.find((e: any) => e.name == key)?.score;
        return toggleSort ? scoreA - scoreB : scoreB - scoreA;
      }
    });
    setStudents(newStudents);
  };

  const onChangePage = async (page: number) => {
    if (page < 1 || page > Math.ceil(studentFilter.length / limit)) return;
    setStartEndPage({
      start: (page - 1) * limit + 1,
      end: Math.min(page * limit, studentFilter.length),
      page,
      scroll: null,
    });
  };

  const scrollMax = () => {
    setFilter("");
    const stdIndex = students.findIndex(
      ({ student }) => student.studentId == studentMaxMin.max[0]
    );
    const page = Math.floor(stdIndex / limit) + 1;
    setStartEndPage({
      start: (page - 1) * limit + 1,
      end: Math.min(page * limit, students.length!),
      page,
      scroll: "max",
    });
  };

  const scrollMin = () => {
    setFilter("");
    const stdIndex = students.findIndex(
      ({ student }) => student.studentId == studentMaxMin.min[0]
    );
    const page = Math.floor(stdIndex / limit) + 1;
    setStartEndPage({
      start: (page - 1) * limit + 1,
      end: Math.min(page * limit, students.length!),
      page,
      scroll: "min",
    });
  };

  return (
    <>
      <ModalEvalChart
        opened={openModalChart}
        onClose={() => setOpenModalChart(false)}
        fullScore={fullScore}
        totalStudent={totalStudent}
        assignment={assignment!}
        students={section?.students}
      />
      <ModalEditStudentScore
        opened={openEditScore}
        onClose={() => setOpenEditScore(false)}
        course={course!}
        section={parseInt(sectionNo || "")}
        assignment={assignment!}
        data={editScore!}
      />
      <div className="bg-white flex flex-col h-full w-full sm:px-6 iphone:max-sm:p-3 iphone:max-sm:overflow-y-auto  py-5 gap-2 overflow-hidden">
        {!isMobile && <Breadcrumbs items={items} />}
        {loading ? (
          <Loading />
        ) : (section?.instructor as IModelUser)?.id === user.id ||
          (section?.coInstructors as IModelUser[])
            ?.map(({ id }) => id)
            .includes(user.id) ? (
          <>
            {!isMobile ? (
              <div className="flex flex-col border-b-2 border-nodata pt-2 pb-3  items-start gap-4 text-start">
                <div className="flex justify-between w-full px-2 items-center">
                  <div className="flex flex-col py-1">
                    <div className="flex gap-1">
                      <p className="text-[#3f4474] font-semibold text-b1 acerSwift:max-macair133:!size-b2">
                        {name}
                      </p>
                      <div
                        className="p-1 rounded-full w-6 h-6 bg-deemphasize/10 hover:bg-deemphasize/20 cursor-pointer"
                        onClick={() => setOpenModalChart(true)}
                      >
                        <Icon
                          IconComponent={IconChart}
                          className="size-3 acerSwift:max-macair133:size-3 text-[#3f4474]"
                        />
                      </div>
                    </div>
                    <p className="text-secondary text-h1 acerSwift:max-macair133:!text-h2 font-semibold">
                      {fullScore?.toFixed(2)}{" "}
                      <span className="text-b1 acerSwift:max-macair133:!size-b2 ">
                        pts.
                      </span>
                    </p>
                  </div>
                  <p className="text-[#3f4474] mb-1 font-semibold sm:max-macair133:text-b2 text-b1 acerSwift:max-macair133:!size-b2">
                    {totalStudent} Students
                  </p>
                </div>
                <div className="flex px-10 flex-row justify-between w-full">
                  <div className="flex flex-col">
                    <p className="font-semibold text-b1 acerSwift:max-macair133:!text-b2 text-[#777777]">
                      Mean
                    </p>
                    <p className="font-bold text-[24px] sm:max-macair133:text-h1 text-defa">
                      {mean.toFixed(2)}
                    </p>
                  </div>
                  <div className="flex flex-col">
                    <p className="font-semibold text-b1 acerSwift:max-macair133:!text-b2 text-[#777777]">
                      SD
                    </p>
                    <p className="font-bold text-[24px] sm:max-macair133:text-h1 text-defa">
                      {sd.toFixed(2)}
                    </p>
                  </div>
                  <div className="flex flex-col">
                    <p className="font-semibold text-b1 acerSwift:max-macair133:!text-b2 text-[#777777]">
                      Median
                    </p>
                    <p className="font-bold text-[24px] sm:max-macair133:text-h1 text-default">
                      {median.toFixed(2)}
                    </p>
                  </div>
                  <div
                    className="flex flex-col cursor-pointer hover:bg-deemphasize/10 hover:rounded-md px-1.5"
                    onClick={scrollMax}
                  >
                    <div className="flex gap-1">
                      <p className="font-semibold text-b1 acerSwift:max-macair133:!text-b2 text-[#777777]">
                        Max
                      </p>
                      <Icon
                        IconComponent={IconListSearch}
                        className="text-default size-4"
                      />
                    </div>

                    <p className="font-bold text-[24px] sm:max-macair133:text-h1 text-default">
                      {maxScore.toFixed(2)}
                    </p>
                  </div>
                  <div
                    className="flex flex-col cursor-pointer hover:bg-deemphasize/10 hover:rounded-md px-1.5"
                    onClick={scrollMin}
                  >
                    <div className="flex gap-1">
                      <p className="font-semibold text-b1 acerSwift:max-macair133:!text-b2 text-[#777777]">
                        Min
                      </p>
                      <Icon
                        IconComponent={IconListSearch}
                        className="text-default size-4"
                      />
                    </div>

                    <p className="font-bold text-[24px] sm:max-macair133:text-h1 text-default">
                      {minScore.toFixed(2)}
                    </p>
                  </div>
                  <div className="flex flex-col">
                    <p className="font-semibold text-b1 acerSwift:max-macair133:!text-b2 text-[#777777]">
                      Q3
                    </p>
                    <p className="font-bold text-[24px] sm:max-macair133:text-h1 text-default">
                      {q3.toFixed(2)}
                    </p>
                  </div>
                  <div className="flex flex-col">
                    <p className="font-semibold text-b1 acerSwift:max-macair133:!text-b2 text-[#777777]">
                      Q1
                    </p>
                    <p className="font-bold text-[24px] sm:max-macair133:text-h1 text-default">
                      {q1 ? q1.toFixed(2) : "-"}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className=" flex flex-col text-start mt-1 gap-2">
                <div className="flex flex-col gap-[2px]">
                  <div className=" font-semibold text-default text-[14px]">
                    {name}
                  </div>
                  <div className="font-semibold text-secondary text-[14px] ">
                    {fullScore?.toFixed(2)} pts.
                  </div>
                </div>
                <div className=" grid grid-cols-2 gap-4 text-[14px] p-3 text-start  border-b border-t  rounded-md">
                  <div className="flex flex-col">
                    <p className="font-semibold text-[#777777]">Mean</p>
                    <p className="font-bold sm:max-macair133:text-h1 text-default">
                      {mean.toFixed(2)}
                    </p>
                  </div>
                  <div className="flex flex-col">
                    <p className="font-semibold text-[#777777]">SD</p>
                    <p className="font-bold sm:max-macair133:text-h1 text-default">
                      {sd.toFixed(2)}
                    </p>
                  </div>
                  <div className="flex flex-col">
                    <p className="font-semibold text-[#777777]">Median</p>
                    <p className="font-bold sm:max-macair133:text-h1 text-default">
                      {median.toFixed(2)}
                    </p>
                  </div>
                  <div
                    className="flex flex-col cursor-pointer hover:bg-deemphasize/10 hover:rounded-md "
                    onClick={scrollMax}
                  >
                    <div className="flex gap-1">
                      <p className="font-semibold text-[#777777]">Max</p>
                      <Icon
                        IconComponent={IconListSearch}
                        className="text-default size-4"
                      />
                    </div>

                    <p className="font-bold sm:max-macair133:text-h1 text-default">
                      {maxScore.toFixed(2)}
                    </p>
                  </div>
                  <div
                    className="flex flex-col cursor-pointer hover:bg-deemphasize/10 hover:rounded-md"
                    onClick={scrollMin}
                  >
                    <div className="flex gap-1">
                      <p className="font-semibold text-[#777777]">Min</p>
                      <Icon
                        IconComponent={IconListSearch}
                        className="text-default size-4"
                      />
                    </div>

                    <p className="font-bold sm:max-macair133:text-h1 text-default">
                      {minScore.toFixed(2)}
                    </p>
                  </div>
                  <div className="flex flex-col">
                    <p className="font-semibold text-[#777777]">Q3</p>
                    <p className="font-bold sm:max-macair133:text-[20px] text-default">
                      {q3.toFixed(2)}
                    </p>
                  </div>
                  <div className="flex flex-col">
                    <p className="font-semibold text-[#777777]">Q1</p>
                    <p className="font-bold sm:max-macair133:text-[20px] text-default">
                      {q1 ? q1.toFixed(2) : "-"}
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="flex mx-1 gap-2 w-full">
              <TextInput
                leftSection={<TbSearch />}
                placeholder="Student ID, Name"
                size="xs"
                rightSectionPointerEvents="all"
                className="w-full"
                onChange={(event: any) => setFilter(event.currentTarget.value)}
              ></TextInput>
              <div className="flex gap-2 items-center">
                <div
                  aria-disabled={startEndPage.start == 1}
                  onClick={() => onChangePage(startEndPage.page - 1)}
                  className={`cursor-pointer aria-disabled:cursor-default aria-disabled:text-[#dcdcdc] p-1 ${
                    startEndPage.start !== 1 && "hover:bg-[#eeeeee]"
                  } rounded-full`}
                >
                  <Icon IconComponent={IconChevronLeft} />
                </div>
                <div className="text-b3 text-nowrap">
                  {startEndPage.start} - {startEndPage.end} of{" "}
                  {studentFilter.length}
                </div>
                <div
                  aria-disabled={startEndPage.end >= studentFilter.length}
                  onClick={() => onChangePage(startEndPage.page + 1)}
                  className={` cursor-pointer aria-disabled:cursor-default aria-disabled:text-[#dcdcdc] p-1 ${
                    startEndPage.end !== studentFilter.length &&
                    "hover:bg-[#eeeeee]"
                  } rounded-full`}
                >
                  <Icon IconComponent={IconChevronRight} />
                </div>
              </div>
              {!isMobile && (
                <Button
                  className="min-w-fit acerSwift:max-macair133:!text-b5 !h-full"
                  disabled={!isSort}
                  onClick={() => {
                    setSort((prev: any) => {
                      const resetSort: any = {};
                      for (const key in prev) {
                        resetSort[key] = null;
                      }
                      return resetSort;
                    });
                    setStudents(
                      students?.sort((a, b) =>
                        a.student.studentId!.localeCompare(b.student.studentId!)
                      )
                    );
                    setIsSort(false);
                  }}
                >
                  Reset Sort
                </Button>
              )}
            </div>

            {/* Table */}
            {!isMobile ? (
              <div
                className="overflow-y-auto overflow-x-auto m w-full h-fit max-h-full border flex flex-col rounded-lg border-secondary"
                style={{
                  boxShadow: "0px 0px 4px 0px rgba(0, 0, 0, 0.30)",
                  height: "fit-content",
                }}
              >
                <Table stickyHeader striped>
                  <Table.Thead>
                    <Table.Tr>
                      <Table.Th
                        onClick={() => onClickSort("studentId")}
                        className={`hover:!bg-[#d0def7]  w-[15%] cursor-pointer acerSwift:max-macair133:!text-b3 ${
                          sort.studentId !== null ? " !bg-[#d0def7]" : ""
                        }`}
                      >
                        <div className="flex items-center gap-2 acerSwift:max-macair133:!text-b3">
                          <p>Student ID</p>{" "}
                          {sort.studentId === null ? (
                            <IconNotSort className="size-4" />
                          ) : sort.studentId ? (
                            <IconSortAsc className="size-5" />
                          ) : (
                            <IconSortDes className="size-5" />
                          )}
                        </div>
                      </Table.Th>
                      <Table.Th className="w-[18%] acerSwift:max-macair133:!text-b3">
                        Name
                      </Table.Th>
                      <Table.Th
                        onClick={() => onClickSort("score")}
                        className={`hover:!bg-[#d0def7] !text-end !justify-end w-[12%] cursor-pointer acerSwift:max-macair133:!text-b3 ${
                          sort.score !== null ? " !bg-[#d0def7]" : ""
                        }`}
                      >
                        <div className="flex items-center gap-2 cursor-pointer !text-end !justify-end pr-2">
                          <p>Score</p>
                          {sort.score === null ? (
                            <IconNotSort className="size-4" />
                          ) : sort.score ? (
                            <IconSortAsc className="size-5" />
                          ) : (
                            <IconSortDes className="size-5" />
                          )}
                        </div>
                      </Table.Th>

                      {assignment?.questions.map((item, index) => (
                        <Table.Th
                          className="hover:!bg-[#d0def7] cursor-pointer pr-2"
                          key={index}
                        >
                          <div
                            className="flex justify-end gap-2 cursor-pointer acerSwift:max-macair133:!text-b3 pr-10"
                            onClick={() => onClickSort(item.name)}
                          >
                            <p>{item.name}</p>
                            {(sort as any)[item.name] === null ? (
                              <IconNotSort className="size-4" />
                            ) : (sort as any)[item.name] ? (
                              <IconSortAsc className="size-5" />
                            ) : (
                              <IconSortDes className="size-5" />
                            )}
                          </div>
                        </Table.Th>
                      ))}
                    </Table.Tr>
                  </Table.Thead>

                  <Table.Tbody className="text-default text-b3 acerSwift:max-macair133:!text-b4">
                    {studentFilter
                      ?.slice(startEndPage.start - 1, startEndPage.end)
                      .map((student) => {
                        const studentId = student.student.studentId!;
                        if (
                          student.sumScore == maxScore &&
                          !studentMaxMin.max.includes(studentId)
                        ) {
                          setStudentMaxMin((prev) => ({
                            ...prev,
                            max: [...prev.max, studentId],
                          }));
                        } else if (
                          student.sumScore == minScore &&
                          !studentMaxMin.min.includes(studentId)
                        ) {
                          setStudentMaxMin((prev) => ({
                            ...prev,
                            min: [...prev.min, studentId],
                          }));
                        }
                        return (
                          <Table.Tr
                            key={studentId}
                            ref={(el) => studentRefs.current.set(studentId, el)}
                          >
                            <Table.Td className="!py-[19px]">
                              {studentId}
                            </Table.Td>
                            <Table.Td className="w-[18%]">
                              {getUserName(student.student, 3)}
                            </Table.Td>
                            <Table.Td className="w-[12%] ">
                              <div className="flex gap-3 justify-end items-center">
                                <p>{student.sumScore?.toFixed(2)}</p>
                                <div
                                  className="hover:bg-[#e9e9e9] p-1 rounded-lg mt-0.5 "
                                  onClick={() => {
                                    setEditScore({
                                      student: student.student,
                                      questions: student.questions || [],
                                    });
                                    setOpenEditScore(true);
                                  }}
                                >
                                  <Icon
                                    IconComponent={IconEdit}
                                    className="size-4 cursor-pointer text-default"
                                  />
                                </div>
                              </div>
                            </Table.Td>
                            {assignment?.questions.map((ques, index) => {
                              const score: any = student.questions?.find(
                                (e: any) => e.name == ques.name
                              )?.score;
                              return (
                                <Table.Td key={index}>
                                  <div className=" justify-end flex pr-10">
                                    {score == undefined || score < 0
                                      ? "-"
                                      : score.toFixed(2)}
                                  </div>
                                </Table.Td>
                              );
                            })}
                          </Table.Tr>
                        );
                      })}
                  </Table.Tbody>
                </Table>
              </div>
            ) : (
              <div className="flex flex-col rounded-md  border">
                {studentFilter
                  ?.slice(startEndPage.start - 1, startEndPage.end)
                  .map((student) => {
                    const studentId = student.student.studentId!;
                    if (
                      student.sumScore == maxScore &&
                      !studentMaxMin.max.includes(studentId)
                    ) {
                      setStudentMaxMin((prev) => ({
                        ...prev,
                        max: [...prev.max, studentId],
                      }));
                    } else if (
                      student.sumScore == minScore &&
                      !studentMaxMin.min.includes(studentId)
                    ) {
                      setStudentMaxMin((prev) => ({
                        ...prev,
                        min: [...prev.min, studentId],
                      }));
                    }
                    return (
                      <div
                        key={studentId}
                        ref={(el) => studentRefs.current.set(studentId, el)}
                        className=" flex flex-col border-b text-[12px]  font-normal p-4 w-full"
                      >
                        <div className="grid grid-cols-2 w-full items-center">
                          <div className="flex gap-[2px] flex-col">
                            <div>{studentId}</div>
                            <div> {getUserName(student.student, 3)}</div>{" "}
                          </div>

                          <div className="flex gap-3 w-full text-end justify-end  items-center">
                            <p>{student.sumScore?.toFixed(2)}</p>
                            <div
                              className="hover:bg-[#e9e9e9] p-1 rounded-lg mt-0.5 "
                              onClick={() => {
                                setEditScore({
                                  student: student.student,
                                  questions: student.questions || [],
                                });
                                setOpenEditScore(true);
                              }}
                            >
                              <Icon
                                IconComponent={IconEdit}
                                className="size-4 cursor-pointer text-default"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>
            )}
          </>
        ) : (
          <div className="flex px-16  flex-row items-center justify-between h-full">
            <div className="flex justify-center  h-full items-start gap-2 flex-col">
              <p className="   text-secondary font-semibold text-[22px]">
                You need access
              </p>
              <p className=" text-[#333333] leading-6 font-medium text-[14px]">
                You're not listed as a Co-Instructor. <br /> Please contact the
                instructor for access.
              </p>
            </div>
            {!isMobile && (
              <img
                className=" z-50  size-[460px] "
                src={needAccess}
                alt="loginImage"
              />
            )}
          </div>
        )}
      </div>
    </>
  );
}
