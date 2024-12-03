import { useAppDispatch, useAppSelector } from "@/store";
import { useEffect, useState } from "react";
import { Table } from "@mantine/core";
import { useParams, useSearchParams } from "react-router-dom";
import { setDashboard, setShowNavbar, setShowSidebar } from "@/store/config";
import Loading from "@/components/Loading/Loading";
import { ROLE } from "@/helpers/constants/enum";
import { ROUTE_PATH } from "@/helpers/constants/route";
import Breadcrumbs from "@/components/Breadcrumbs";
import { getUserName } from "@/helpers/functions/function";

export default function OneAssignment() {
  const { courseNo, name } = useParams();
  const loading = useAppSelector((state) => state.loading);
  const user = useAppSelector((state) => state.user);
  const course = useAppSelector((state) =>
    state.course.courses.find((e) => e.courseNo == courseNo)
  );
  const questions = course?.sections[0].assignments?.find(
    (item) => item.name == name
  )?.questions;
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
                sectionNo: sec.sectionNo,
                student: std.student,
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
      <div className="bg-white flex flex-col h-full w-full px-6 py-5 gap-2 overflow-hidden">
        <Breadcrumbs items={items} />
        {loading.loading ? (
          <Loading />
        ) : (
          <div
            className="relative overflow-auto mt-2 border rounded-lg border-secondary"
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
                  {questions?.map((item, index) => (
                    <Table.Th key={index}>{item.name}</Table.Th>
                  ))}
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody className="text-default">
                {allStudent?.map((item, index) => {
                  return (
                    <Table.Tr
                      key={index}
                      className="hover:bg-[#F3F3F3] text-[13px] font-normal py-[14px] w-full"
                    >
                      <Table.Td>{item.sectionNo}</Table.Td>
                      <Table.Td>{item.student.studentId}</Table.Td>
                      <Table.Td>{getUserName(item.student, 3)}</Table.Td>
                      {questions?.map((ques, index) => (
                        <Table.Td key={index}>
                          {item[ques.name] == undefined || item[ques.name] < 0
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
        )}
      </div>
    </>
  );
}
