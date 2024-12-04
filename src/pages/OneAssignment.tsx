import { useAppDispatch, useAppSelector } from "@/store";
import { useEffect, useState } from "react";
import { Table, TextInput } from "@mantine/core";
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

export default function OneAssignment() {
  const { courseNo, name } = useParams();
  const loading = useAppSelector((state) => state.loading);
  const user = useAppSelector((state) => state.user);
  const course = useAppSelector((state) =>
    state.course.courses.find((e) => e.courseNo == courseNo)
  );
  const assignment = course?.sections[0].assignments?.find(
    (item) => item.name == name
  );
  const [filter, setFilter] = useState<string>("");
  const questions = assignment?.questions;
  const allStudent: any[] =
    course?.sections
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
              return {
                sectionNo: getSectionNo(sec.sectionNo),
                student: std.student,
                score: score.questions.map((item) => ({
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
      .filter((item) => item !== undefined) || [];
  const [params, setParams] = useSearchParams();
  const dispatch = useAppDispatch();
  const [openEditScore, setOpenEditScore] = useState(false);
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

  return (
    <>
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
            <TextInput
              leftSection={<TbSearch />}
              placeholder="Section No, Student ID, Name"
              size="xs"
              className="my-2"
              rightSectionPointerEvents="all"
              onChange={(event: any) => setFilter(event.currentTarget.value)}
            ></TextInput>
            <div
              className="relative overflow-auto border rounded-lg border-secondary"
              style={{
                boxShadow: "0px 0px 4px 0px rgba(0, 0, 0, 0.30)",
              }}
            >
              <Table stickyHeader striped>
                <Table.Thead>
                  <Table.Tr className="bg-[#dfebff]">
                    <Table.Th>Section</Table.Th>
                    <Table.Th>Student ID</Table.Th>
                    <Table.Th>Name</Table.Th>
                    <Table.Th>Score</Table.Th>
                    {questions?.map((item, index) => (
                      <Table.Th key={index}>{item.name}</Table.Th>
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
                    .map((item, index) => {
                      const sumScore =
                        questions?.reduce((sum, ques) => {
                          const score = item[ques.name];
                          return score >= 0 ? sum + score : sum;
                        }, 0) || 0;
                      return (
                        <Table.Tr
                          key={index}
                          className="hover:bg-[#F3F3F3] text-[13px] font-normal py-[14px] w-full"
                        >
                          <Table.Td>{item.sectionNo}</Table.Td>
                          <Table.Td>{item.student.studentId}</Table.Td>
                          <Table.Td>{getUserName(item.student, 3)}</Table.Td>
                          <Table.Td className="w-[5%]">
                            <div className="flex gap-3 justify-end items-center">
                              <p>{sumScore.toFixed(2)}</p>
                              <div
                                className="hover:bg-[#e9e9e9] p-1 rounded-lg mt-0.5 "
                                onClick={() => {
                                  setEditScore({
                                    section: parseInt(item.sectionNo),
                                    student: item.student,
                                    questions: item.score || [],
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
                            <Table.Td key={index}>
                              {item[ques.name] == undefined ||
                              item[ques.name] < 0
                                ? "-"
                                : item[ques.name]}
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
