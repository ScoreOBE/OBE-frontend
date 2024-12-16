import { useAppDispatch, useAppSelector } from "@/store";
import { useEffect, useRef, useState } from "react";
import Breadcrumbs from "@/components/Breadcrumbs";
import { useParams, useSearchParams } from "react-router-dom";
import { getSectionNo, getUserName } from "@/helpers/functions/function";
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
import { calStat, scrollToStudent } from "@/helpers/functions/score";
import { TbSearch } from "react-icons/tb";
import { cloneDeep } from "lodash";
import { ROLE } from "@/helpers/constants/enum";
import ModalEditStudentScore from "@/components/Modal/Score/ModalEditStudentScore";
import { IModelScore } from "@/models/ModelCourse";

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
  const [editScore, setEditScore] = useState<{
    student: IModelUser;
    questions: { name: string; score: number | string }[];
  }>();
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
  const totalStudent =
    section?.students?.filter((item) =>
      item.scores.find(({ assignmentName }) => assignmentName == name)
    ).length || 0;
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

  const onClickSort = (key: string) => {
    const currentSort = (sort as any)[key];
    const toggleSort = currentSort === null ? true : !currentSort;
    setSort((prev: any) => ({ ...prev, [key]: toggleSort }));

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

  return (
    <>
      <ModalEditStudentScore
        opened={openEditScore}
        onClose={() => setOpenEditScore(false)}
        course={course!}
        section={parseInt(sectionNo || "")}
        assignment={assignment!}
        data={editScore!}
      />
      <div className="bg-white flex flex-col h-full w-full px-6 py-5 gap-3 overflow-hidden">
        <Breadcrumbs items={items} />
        {loading ? (
          <Loading />
        ) : (section?.instructor as IModelUser)?.id === user.id ||
          (section?.coInstructors as IModelUser[])
            ?.map(({ id }) => id)
            .includes(user.id) ? (
          <>
            <div className="flex flex-col border-b-2 border-nodata pt-2 pb-3  items-start gap-4 text-start">
              <p className="text-secondary text-[18px] font-semibold">
                {name} - {fullScore} Points
              </p>
              <div className="flex px-10 flex-row justify-between w-full">
                <div className="flex flex-col">
                  <p className="font-semibold text-[16px] text-[#777777]">
                    Mean
                  </p>
                  <p className="font-bold text-[24px] sm:max-macair133:text-[20px] text-defa">
                    {mean.toFixed(2)}
                  </p>
                </div>
                <div className="flex flex-col">
                  <p className="font-semibold text-[16px] text-[#777777]">SD</p>
                  <p className="font-bold text-[24px] sm:max-macair133:text-[20px] text-defa">
                    {sd.toFixed(2)}
                  </p>
                </div>
                <div className="flex flex-col">
                  <p className="font-semibold text-[16px] text-[#777777]">
                    Median
                  </p>
                  <p className="font-bold text-[24px] sm:max-macair133:text-[20px] text-default">
                    {median.toFixed(2)}
                  </p>
                </div>
                <div
                  className="flex flex-col cursor-pointer"
                  onClick={() =>
                    scrollToStudent(studentRefs, studentMaxMin.max)
                  }
                >
                  <p className="font-semibold text-[16px] text-[#777777]">
                    Max
                  </p>
                  <p className="font-bold text-[24px] sm:max-macair133:text-[20px] text-default">
                    {maxScore.toFixed(2)}
                  </p>
                </div>
                <div
                  className="flex flex-col cursor-pointer"
                  onClick={() =>
                    scrollToStudent(studentRefs, studentMaxMin.min)
                  }
                >
                  <p className="font-semibold text-[16px] text-[#777777]">
                    Min
                  </p>
                  <p className="font-bold text-[24px] sm:max-macair133:text-[20px] text-default">
                    {minScore.toFixed(2)}
                  </p>
                </div>
                <div className="flex flex-col">
                  <p className="font-semibold text-[16px] text-[#777777]">Q3</p>
                  <p className="font-bold text-[24px] sm:max-macair133:text-[20px] text-default">
                    {q3.toFixed(2)}
                  </p>
                </div>
                <div className="flex flex-col">
                  <p className="font-semibold text-[16px] text-[#777777]">Q1</p>
                  <p className="font-bold text-[24px] sm:max-macair133:text-[20px] text-default">
                    {q1 ? q1.toFixed(2) : "-"}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex mx-1 gap-2 w-full">
              <TextInput
                leftSection={<TbSearch />}
                placeholder="Student ID, Name"
                size="xs"
                rightSectionPointerEvents="all"
                className="w-full"
                onChange={(event: any) => setFilter(event.currentTarget.value)}
              ></TextInput>
              <Button
                className="min-w-fit"
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
                }}
              >
                Reset Sort
              </Button>
            </div>

            {/* Table */}
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
                      className={`hover:!bg-[#d0def7]  w-[15%] cursor-pointer ${
                        sort.studentId !== null ? " !bg-[#d0def7]" : ""
                      }`}
                    >
                      <div className="flex items-center gap-2 ">
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
                    <Table.Th className="w-[18%]">Name</Table.Th>
                    <Table.Th
                      onClick={() => onClickSort("score")}
                      className={`hover:!bg-[#d0def7] !text-end !justify-end w-[12%] cursor-pointer ${
                        sort.score !== null ? " !bg-[#d0def7]" : ""
                      }`}
                    >
                      <div className="flex items-center gap-2 cursor-pointer !text-start !justify-start">
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
                        className="hover:!bg-[#d0def7] cursor-pointer"
                        key={index}
                      >
                        <div
                          className="flex justify-end gap-2 cursor-pointer"
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

                <Table.Tbody className="text-default text-[13px]">
                  {students
                    ?.filter((student) =>
                      parseInt(filter)
                        ? student.student.studentId?.toString().includes(filter)
                        : getUserName(student.student, 3)?.includes(filter)
                    )
                    ?.map((student) => {
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
                          <Table.Td className="w-[12%]">
                            <div className="flex gap-3 justify-start items-center">
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
                                <div className=" justify-end flex">
                                  {score != undefined ? score.toFixed(2) : "-"}
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
          </>
        ) : (
          <div className="flex px-16  flex-row items-center justify-between h-full">
            <div className="flex justify-center  h-full items-start gap-2 flex-col">
              <p className="   text-secondary font-semibold text-[22px]">
                You need access
              </p>
              <p className=" text-[#333333] leading-6 font-medium text-[14px]">
                You're not listed as a Co-Instructor. <br /> Please contact the
                Owner section for access.
              </p>
            </div>
            <img
              className=" z-50  size-[460px] "
              src={needAccess}
              alt="loginImage"
            />
          </div>
        )}
      </div>
    </>
  );
}
