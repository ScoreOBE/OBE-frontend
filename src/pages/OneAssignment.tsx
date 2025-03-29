import { useAppDispatch, useAppSelector } from "@/store";
import { useEffect, useMemo, useRef, useState } from "react";
import { Button, Table, TextInput, Tooltip } from "@mantine/core";
import { useParams, useSearchParams } from "react-router-dom";
import { setDashboard, setShowNavbar, setShowSidebar } from "@/store/config";
import Loading from "@/components/Loading/Loading";
import { ROLE } from "@/helpers/constants/enum";
import { ROUTE_PATH } from "@/helpers/constants/route";
import Breadcrumbs from "@/components/Breadcrumbs";
import {
  getSectionNo,
  getUserName,
  isMobile,
} from "@/helpers/functions/function";
import { IModelUser } from "@/models/ModelUser";
import { TbSearch } from "react-icons/tb";
import ModalEditStudentScore from "@/components/Modal/Score/ModalEditStudentScore";
import Icon from "@/components/Icon";
import IconEdit from "@/assets/icons/edit.svg?react";
import IconSortAsc from "@/assets/icons/sortAsc.svg?react";
import IconSortDes from "@/assets/icons/sortDes.svg?react";
import IconNotSort from "@/assets/icons/arrowUpDown.svg?react";
import IconListSearch from "@/assets/icons/listSearch.svg?react";
import IconChart from "@/assets/icons/histogram.svg?react";
import IconChevronLeft from "@/assets/icons/chevronLeft.svg?react";
import IconChevronRight from "@/assets/icons/chevronRight.svg?react";
import { calStat, scrollToStudent } from "@/helpers/functions/score";
import ModalEvalChart from "@/components/Modal/Score/ModalEvalChart";

export default function OneAssignment() {
  const { courseNo, name } = useParams();
  const [params, setParams] = useSearchParams();
  const academicYear = useAppSelector((state) => state.academicYear);
  const activeTerm = academicYear.find(
    (term) =>
      term.year == parseInt(params.get("year") || "") &&
      term.semester == parseInt(params.get("semester") || "")
  )?.isActive;
  const loading = useAppSelector((state) => state.loading);
  const [isSort, setIsSort] = useState(false);
  const course = useAppSelector((state) =>
    state.course.courses.find((e) => e.courseNo == courseNo)
  );
  const assignment = course?.sections[0].assignments?.find(
    (item) => item.name == name
  );
  const fullScore =
    assignment?.questions.reduce((a, { fullScore }) => a + fullScore, 0) || 0;
  const studentRefs = useRef(new Map());
  const [studentMaxMin, setStudentMaxMin] = useState({
    max: [] as string[],
    min: [] as string[],
  });
  const [allStudent, setAllStudent] = useState<
    ({
      sectionNo: string;
      student: IModelUser;
      scores: {
        score: string | number;
        name: string;
      }[];
      sumScore: number;
    } & Record<string, any>)[]
  >([]);
  const students = course?.sections.map((sec) => sec.students!).flat() || [];
  const [sort, setSort] = useState<any>({});
  const [filter, setFilter] = useState<string>("");
  const questions = assignment?.questions;
  const scores = allStudent
    .map((item) => {
      return questions?.reduce((sum, ques) => {
        const score = item[ques.name];
        return score >= 0 ? sum + score : sum;
      }, 0);
    })
    .filter((item) => item !== undefined)
    .sort((a, b) => a - b);
  const { mean, sd, median, maxScore, minScore, q1, q3 } = calStat(
    scores,
    allStudent.length
  );
  const dispatch = useAppDispatch();
  const [openEditScore, setOpenEditScore] = useState(false);
  const [openModalChart, setOpenModalChart] = useState(false);
  const [editScore, setEditScore] = useState<{
    section: number;
    student: IModelUser;
    questions: { name: string; score: number | string }[];
  }>();
  const [items, setItems] = useState<any[]>([
    {
      title: "Scores",
      path: `${ROUTE_PATH.COURSE}/${courseNo}/${
        ROUTE_PATH.EVALUATION
      }?${params.toString()}`,
    },
    { title: name },
  ]);
  const limit = 50;
  const [startEndPage, setStartEndPage] = useState({
    start: 1,
    end: limit,
    page: 1,
    scroll: null as null | "max" | "min",
  });

  useEffect(() => {
    dispatch(setShowSidebar(true));
    dispatch(setShowNavbar(true));
    dispatch(setDashboard(ROLE.INSTRUCTOR));
    localStorage.setItem("dashboard", ROLE.INSTRUCTOR);
  }, []);

  useEffect(() => {
    if (assignment && questions) {
      setSort({
        studentId: null,
        score: null,
        ...assignment.questions.reduce((acc, item) => {
          (acc as any)[item.name] = null;
          return acc;
        }, {}),
      });
      setAllStudent(
        (course?.sections
          .flatMap((sec) => {
            return sec.students
              ?.map((std) => {
                const score = std.scores.find(
                  ({ assignmentName }) => assignmentName == name
                );
                if (score) {
                  const questionsObject = score.questions.reduce(
                    (acc, question) => {
                      acc[question.name] = question.score;
                      return acc;
                    },
                    {} as Record<string, number>
                  );
                  const sumScore =
                    Object.values(questionsObject)?.reduce((sum, score) => {
                      return score >= 0 ? sum + score : sum;
                    }, 0) || 0;
                  return {
                    sectionNo: getSectionNo(sec.sectionNo),
                    student: std.student,
                    sumScore,
                    scores: score.questions.map((item) => ({
                      ...item,
                      score: item.score >= 0 ? item.score : "",
                    })),
                    ...questionsObject,
                  };
                }
                return null;
              })
              .filter((item) => item !== null);
          })
          .filter((item) => item !== undefined) as any[]) || []
      );
    }
  }, [course]);

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
    if (!allStudent.length) return [];
    setStartEndPage((prev) => ({ ...prev, start: 1, end: limit, page: 1 }));
    return allStudent.filter((item) =>
      parseInt(filter) >= 0
        ? getSectionNo(item.sectionNo).includes(filter) ||
          item.student.studentId?.toString().includes(filter)
        : getUserName(item.student, 3)?.includes(filter)
    );
  }, [allStudent, filter]);

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
    let newStudents = [...allStudent];
    newStudents = newStudents.sort((a, b) => {
      if (key === "studentId") {
        return toggleSort
          ? a.student.studentId!.localeCompare(b.student.studentId!)
          : b.student.studentId!.localeCompare(a.student.studentId!);
      } else if (key === "score") {
        return toggleSort ? a.sumScore - b.sumScore : b.sumScore - a.sumScore;
      } else {
        return toggleSort ? a[key] - b[key] : b[key] - a[key];
      }
    });
    setAllStudent(newStudents);
  };

  const onChangePage = async (page: number) => {
    if (page < 1 || page > Math.ceil(studentFilter.length! / limit)) return;
    setStartEndPage({
      start: (page - 1) * limit + 1,
      end: Math.min(page * limit, studentFilter.length!),
      page,
      scroll: null,
    });
  };

  const scrollMax = () => {
    setFilter("");
    const stdIndex = allStudent.findIndex(
      ({ student }) => student.studentId == studentMaxMin.max[0]
    );
    const page = Math.floor(stdIndex / limit) + 1;
    setStartEndPage({
      start: (page - 1) * limit + 1,
      end: Math.min(page * limit, allStudent.length!),
      page,
      scroll: "max",
    });
  };

  const scrollMin = () => {
    setFilter("");
    const stdIndex = allStudent.findIndex(
      ({ student }) => student.studentId == studentMaxMin.min[0]
    );
    const page = Math.floor(stdIndex / limit) + 1;
    setStartEndPage({
      start: (page - 1) * limit + 1,
      end: Math.min(page * limit, allStudent.length!),
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
        totalStudent={allStudent.length}
        assignment={assignment!}
        students={students}
        isAllsec={true}
      />
      <ModalEditStudentScore
        opened={openEditScore}
        onClose={() => setOpenEditScore(false)}
        course={course!}
        section={editScore?.section!}
        assignment={assignment!}
        data={editScore!}
      />
      <div className="bg-white flex flex-col h-full w-full sm:px-6 iphone:max-sm:p-4 iphone:max-sm:overflow-y-auto  py-5 gap-2 overflow-hidden">
        <Breadcrumbs items={items} />
        {loading.loading ? (
          <Loading />
        ) : (
          <>
            {!isMobile ? (
              <div className="flex flex-col border-b-2 border-nodata pt-2 pb-3 items-start gap-4 text-start">
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
                    <p className="text-secondary text-h1 font-semibold">
                      {fullScore?.toFixed(2)}{" "}
                      <span className="text-b1 acerSwift:max-macair133:!text-b2 ">
                        pts.
                      </span>
                    </p>
                  </div>
                  <p className="text-[#3f4474] mb-1 font-semibold sm:max-macair133:text-[14px] text-b1 acerSwift:max-macair133:!text-b2">
                    {allStudent.length} Students
                  </p>
                </div>
                <div className="flex px-10 flex-row justify-between w-full  ">
                  <div className="flex flex-col">
                    <p className="font-semibold text-b1 acerSwift:max-macair133:!text-b2 text-[#777777]">
                      Mean
                    </p>
                    <p className="font-bold text-[24px] sm:max-macair133:text-h1 text-default">
                      {mean.toFixed(2)}
                    </p>
                  </div>
                  <div className="flex flex-col">
                    <p className="font-semibold text-b1 acerSwift:max-macair133:!text-b2 text-[#777777]">
                      SD
                    </p>
                    <p className="font-bold text-[24px] sm:max-macair133:text-h1 text-default">
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
                    <p className="font-bold text-[24px] sm:max-macair133:text-[20px] text-default">
                      {q3.toFixed(2)}
                    </p>
                  </div>
                  <div className="flex flex-col">
                    <p className="font-semibold text-b1 acerSwift:max-macair133:!text-b2 text-[#777777]">
                      Q1
                    </p>
                    <p className="font-bold text-[24px] sm:max-macair133:text-[20px] text-default">
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
            <div className="flex my-2 gap-2 w-full">
              <TextInput
                leftSection={<TbSearch />}
                placeholder="Section No, Student ID, Name"
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
                    allStudent?.sort((a, b) =>
                      a.student.studentId!.localeCompare(b.student.studentId!)
                    );
                    setIsSort(false);
                  }}
                >
                  Reset Sort
                </Button>
              )}
            </div>
            {!isMobile ? (
              <div
                className="relative overflow-auto border rounded-lg border-secondary"
                style={{
                  boxShadow: "0px 0px 4px 0px rgba(0, 0, 0, 0.30)",
                }}
              >
                <Table stickyHeader striped className="w-full">
                  <Table.Thead>
                    <Table.Tr className="bg-[#f0f7ff] border-b border-gray-200 sticky top-0 z-10 shadow-sm">
                      <Table.Th className="acerSwift:max-macair133:!text-b3 py-4 px-4 font-semibold w-[100px] min-w-[100px]">
                        Section
                      </Table.Th>
                      <Table.Th className="py-4 px-4">
                        <div
                          className="flex items-center w-[120px] min-w-[120px] gap-2 cursor-pointer acerSwift:max-macair133:!text-b3 transition-colors duration-200"
                          onClick={() => onClickSort("studentId")}
                        >
                          <p>Student ID</p>
                          {sort.studentId === null ? (
                            <IconNotSort className="size-4" />
                          ) : sort.studentId ? (
                            <IconSortAsc className="size-5" />
                          ) : (
                            <IconSortDes className="size-5" />
                          )}
                        </div>
                      </Table.Th>
                      <Table.Th className="acerSwift:max-macair133:!text-b3 py-4 px-4 font-semibold w-[220px] min-w-[220px] max-w-[250px]">
                        Name
                      </Table.Th>
                      <Table.Th className="py-4 px-4">
                        <div
                          className="flex items-center justify-end text-end  gap-2 w-[100px] min-w-[100px]  cursor-pointer acerSwift:max-macair133:!text-b3 transition-colors duration-200"
                          onClick={() => onClickSort("score")}
                        >
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
                      {questions?.map((item, index) => (
                        <Table.Th key={index} className="py-4 w-[170px]  min-w-[170px] max-w-[200px] px-4">
                          <div
                            className="flex justify-end items-center text-end  gap-2 cursor-pointer acerSwift:max-macair133:!text-b3 pr-6 transition-colors duration-200"
                            onClick={() => onClickSort(item.name)}
                          >
                            <Tooltip
                              className="text-b4 acerSwift:max-macair133:text-b5"
                              label={item.desc}
                            >
                              <p>
                                {item.name} ({item.fullScore})
                              </p>
                            </Tooltip>
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
                  <Table.Tbody className="text-default divide-y divide-gray-100">
                    {studentFilter
                      .slice(startEndPage.start - 1, startEndPage.end)
                      .map((item) => {
                        const studentId = item.student.studentId!;
                        if (
                          item.sumScore == maxScore &&
                          !studentMaxMin.max.includes(studentId)
                        ) {
                          setStudentMaxMin((prev) => ({
                            ...prev,
                            max: [...prev.max, studentId],
                          }));
                        } else if (
                          item.sumScore == minScore &&
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
                            className="hover:bg-[#F8F9FF] text-b3 acerSwift:max-macair133:!text-b4 font-normal transition-colors duration-150"
                          >
                            <Table.Td className="py-4 px-4 w-[100px] min-w-[100px]">
                              {item.sectionNo}
                            </Table.Td>
                            <Table.Td className="py-4 px-4 w-[120px] min-w-[120px]">
                              {studentId}
                            </Table.Td>
                            <Table.Td className="py-4 px-4 w-[220px] min-w-[220px] max-w-[250px]">
                              {getUserName(item.student, 3)}
                            </Table.Td>
                            <Table.Td className="w-[100px] min-w-[100px] py-4 px-4">
                              <div className="flex gap-3 justify-end items-center">
                                <p className="font-medium">
                                  {item.sumScore?.toFixed(2)}
                                </p>
                                {activeTerm && (
                                  <div
                                    className="hover:bg-[#e9e9e9] p-1.5 rounded-lg transition-colors duration-200"
                                    onClick={() => {
                                      setEditScore({
                                        section: Number.parseInt(
                                          item.sectionNo
                                        ),
                                        student: item.student,
                                        questions: item.scores || [],
                                      });
                                      setOpenEditScore(true);
                                    }}
                                  >
                                    <Icon
                                      IconComponent={IconEdit}
                                      className="size-4 cursor-pointer text-default"
                                    />
                                  </div>
                                )}
                              </div>
                            </Table.Td>
                            {questions?.map((ques, index) => (
                              <Table.Td
                                key={index}
                                className="text-end pr-9 py-4 w-[150px]   min-w-[150px] max-w-[200px] px-4"
                              >
                                {item[ques.name] == undefined ||
                                item[ques.name] < 0
                                  ? "-"
                                  : item[ques.name].toFixed(2)}
                              </Table.Td>
                            ))}
                          </Table.Tr>
                        );
                      })}
                  </Table.Tbody>
                </Table>
              </div>
            ) : (
              <div className="flex flex-col rounded-md  border py-3 ">
                {studentFilter.map((item) => {
                  const studentId = item.student.studentId!;
                  if (
                    item.sumScore == maxScore &&
                    !studentMaxMin.max.includes(studentId)
                  ) {
                    setStudentMaxMin((prev) => ({
                      ...prev,
                      max: [...prev.max, studentId],
                    }));
                  } else if (
                    item.sumScore == minScore &&
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
                      className=" flex flex-col border-b text-[12px] font-normal p-4 w-full"
                    >
                      <div className="grid grid-cols-2 w-full items-center">
                        <div className="flex gap-[2px] flex-col">
                          <div>{studentId}</div>
                          <div>{getUserName(item.student, 3)}</div>{" "}
                          <div className="  text-default">
                            Section: {item.sectionNo}
                          </div>
                        </div>
                        <div>
                          <div className="flex gap-3 w-full text-end justify-end  items-center">
                            <p>{item.sumScore?.toFixed(2)}</p>
                            {activeTerm && (
                              <div
                                className="hover:bg-[#e9e9e9] p-1 rounded-lg mt-0.5 "
                                onClick={() => {
                                  setEditScore({
                                    section: parseInt(item.sectionNo),
                                    student: item.student,
                                    questions: item.scores || [],
                                  });
                                  setOpenEditScore(true);
                                }}
                              >
                                <Icon
                                  IconComponent={IconEdit}
                                  className="size-4 cursor-pointer text-default"
                                />
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}
