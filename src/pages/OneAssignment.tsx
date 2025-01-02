import { useAppDispatch, useAppSelector } from "@/store";
import { useEffect, useRef, useState } from "react";
import { Button, Table, TextInput } from "@mantine/core";
import { useParams, useSearchParams } from "react-router-dom";
import { setDashboard, setShowNavbar, setShowSidebar } from "@/store/config";
import Loading from "@/components/Loading/Loading";
import { ROLE } from "@/helpers/constants/enum";
import { ROUTE_PATH } from "@/helpers/constants/route";
import Breadcrumbs from "@/components/Breadcrumbs";
import { getSectionNo, getUserName } from "@/helpers/functions/function";
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
import { calStat, scrollToStudent } from "@/helpers/functions/score";
import ModalEvalChart from "@/components/Modal/Score/ModalEvalChart";

export default function OneAssignment() {
  const { courseNo, name } = useParams();
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
  const [params, setParams] = useSearchParams();
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
      title: "Evaluations",
      path: `${ROUTE_PATH.COURSE}/${courseNo}/${
        ROUTE_PATH.EVALUATION
      }?${params.toString()}`,
    },
    { title: name },
  ]);

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
      <div className="bg-white flex flex-col h-full w-full px-6 py-5 gap-2 overflow-hidden">
        <Breadcrumbs items={items} />
        {loading.loading ? (
          <Loading />
        ) : (
          <>
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
                  onClick={() =>
                    scrollToStudent(studentRefs, studentMaxMin.max)
                  }
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
                  onClick={() =>
                    scrollToStudent(studentRefs, studentMaxMin.min)
                  }
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
            <div className="flex my-2 gap-2 w-full">
              <TextInput
                leftSection={<TbSearch />}
                placeholder="Section No, Student ID, Name"
                size="xs"
                rightSectionPointerEvents="all"
                className="w-full"
                onChange={(event: any) => setFilter(event.currentTarget.value)}
              ></TextInput>
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
            </div>
            <div
              className="relative overflow-auto border rounded-lg border-secondary"
              style={{
                boxShadow: "0px 0px 4px 0px rgba(0, 0, 0, 0.30)",
              }}
            >
              <Table stickyHeader striped>
                <Table.Thead>
                  <Table.Tr className="bg-[#dfebff]">
                    <Table.Th className="acerSwift:max-macair133:!text-b3">
                      Section
                    </Table.Th>
                    <Table.Th>
                      <div
                        className="flex items-center gap-2 cursor-pointer acerSwift:max-macair133:!text-b3"
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
                    <Table.Th className="acerSwift:max-macair133:!text-b3">
                      Name
                    </Table.Th>
                    <Table.Th>
                      <div
                        className="flex items-center gap-2 cursor-pointer acerSwift:max-macair133:!text-b3"
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
                      <Table.Th key={index}>
                        <div
                          className="flex justify-end gap-2 cursor-pointer acerSwift:max-macair133:!text-b3  pr-6"
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
                <Table.Tbody className="text-default">
                  {allStudent
                    ?.filter((item) =>
                      parseInt(filter)
                        ? item.sectionNo.includes(filter) ||
                          item.student.studentId?.toString().includes(filter)
                        : getUserName(item.student, 3)?.includes(filter)
                    )
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
                          className="hover:bg-[#F3F3F3] text-b3 acerSwift:max-macair133:!text-b4 font-normal py-[14px] w-full"
                        >
                          <Table.Td>{item.sectionNo}</Table.Td>
                          <Table.Td>{studentId}</Table.Td>
                          <Table.Td>{getUserName(item.student, 3)}</Table.Td>
                          <Table.Td className="w-[5%]">
                            <div className="flex gap-3 justify-end items-center">
                              <p>{item.sumScore?.toFixed(2)}</p>
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
                            </div>
                          </Table.Td>
                          {questions?.map((ques, index) => (
                            <Table.Td key={index} className="text-end pr-9">
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
          </>
        )}
      </div>
    </>
  );
}
