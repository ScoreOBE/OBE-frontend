import { useAppDispatch, useAppSelector } from "@/store";
import { useEffect, useState } from "react";
import {
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import notFoundImage from "@/assets/image/notFound.jpg";
import { setDashboard, setShowNavbar, setShowSidebar } from "@/store/config";
import { ROLE } from "@/helpers/constants/enum";
import { setLoading } from "@/store/loading";
import { getEnrollCourse } from "@/services/student/student.service";
import { setEnrollCourseList } from "@/store/enrollCourse";
import Loading from "@/components/Loading/Loading";
import Icon from "@/components/Icon";
import { dateFormatter } from "@/helpers/functions/function";
import { Table } from "@mantine/core";
import { ROUTE_PATH } from "@/helpers/constants/route";
import { calStat } from "@/helpers/functions/score";

export default function StdAssignment() {
  const { courseNo } = useParams();
  const path = useLocation().pathname;
  const [params, setParams] = useSearchParams();
  const navigate = useNavigate();
  const loading = useAppSelector((state) => state.loading.loading);
  const user = useAppSelector((state) => state.user);
  const term = useAppSelector((state) =>
    state.academicYear.find(
      (term) =>
        term.year == parseInt(params.get("year") || "") &&
        term.semester == parseInt(params.get("semester") || "")
    )
  );
  const course = useAppSelector((state) =>
    state.enrollCourse.courses.find((c) => c.courseNo == courseNo)
  );
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(setShowSidebar(true));
    dispatch(setShowNavbar(true));
    dispatch(setDashboard(ROLE.STUDENT));
    localStorage.setItem("dashboard", ROLE.STUDENT);
  }, []);

  const goToAssignment = (name: string) => {
    navigate({
      pathname: `${path}/${name}`,
      search: "?" + params.toString(),
    });
  };

  return (
    <div className="bg-white flex flex-col h-full w-full px-6 py-5 gap-3 overflow-hidden">
      {loading ? (
        <Loading />
      ) : (
        <>
          {course?.section?.assignments?.length !== 0 && (
            <div className="flex flex-row  py-1  items-center justify-between">
              <p className="text-secondary text-[18px] font-semibold">
                {course?.section?.assignments?.length} Assignment
                {course?.section?.assignments?.length! > 1 && "s"}
              </p>
            </div>
          )}

          {course?.section?.assignments?.length !== 0 ? (
            <div
              className="overflow-y-auto overflow-x-auto w-full h-fit max-h-full  border flex flex-col rounded-lg border-secondary"
              style={{
                boxShadow: "0px 0px 4px 0px rgba(0, 0, 0, 0.30)",
                height: "fit-content",
              }}
            >
              <Table stickyHeader>
                <Table.Thead>
                  <Table.Tr className="bg-[#e5e7f6]">
                    <Table.Th className="w-20 sm:max-macair133:text-b3">
                      Name
                    </Table.Th>
                    <Table.Th className="w-20 sm:max-macair133:text-b3  text-end pr-14 !pl-0">
                      Your Score
                    </Table.Th>
                    <Table.Th className="w-20 sm:max-macair133:text-b3  text-end pr-14 !pl-0">
                      Full Scores
                    </Table.Th>
                    <Table.Th className=" w-10 sm:max-macair133:text-b3 text-end pr-20 !pl-0">
                      Mean
                    </Table.Th>
                    <Table.Th className=" w-10 sm:max-macair133:text-b3 text-end pr-20 !pl-0">
                      SD
                    </Table.Th>
                    <Table.Th className=" w-10 sm:max-macair133:text-b3 text-end pr-20 !pl-0">
                      Median
                    </Table.Th>
                    <Table.Th className=" w-10 sm:max-macair133:text-b3 text-end pr-20 !pl-0">
                      Max
                    </Table.Th>
                    <Table.Th className=" w-10 sm:max-macair133:text-b3 text-end pr-20 !pl-0">
                      Q3
                    </Table.Th>
                    <Table.Th className=" w-10 sm:max-macair133:text-b3 text-end pr-20 !pl-0">
                      Q1
                    </Table.Th>
                  </Table.Tr>
                </Table.Thead>

                <Table.Tbody className="text-default sm:max-macair133:text-b3 font-medium text-[13px] ">
                  {course?.section?.assignments?.map((assignment, index) => {
                    const totalStudent = assignment.scores.length;
                    const totalScore = assignment.scores.reduce(
                      (a, b) => a + b
                    );
                    const stat = calStat(assignment.scores, totalStudent);
                    return (
                      <Table.Tr
                        key={index}
                        className={`hover:bg-[#F3F3F3] cursor-pointer ${
                          index % 2 === 0 && "bg-[#F8F9FA]"
                        }`}
                        onClick={() => goToAssignment(`${assignment.name}`)}
                      >
                        <Table.Td>{assignment.name}</Table.Td>
                        <Table.Td className="text-end pr-14 !pl-0">
                          {course?.scores
                            .find(
                              ({ assignmentName }) =>
                                assignmentName == assignment.name
                            )
                            ?.questions.reduce((a, { score }) => a + score, 0)
                            .toFixed(2)}
                        </Table.Td>
                        <Table.Td className="text-end pr-14 !pl-0">
                          {stat.mean.toFixed(2)}
                        </Table.Td>
                        <Table.Td className="text-end pr-14 !pl-0">
                          {stat.sd.toFixed(2)}
                        </Table.Td>
                        <Table.Td className="text-end pr-14 !pl-0">
                          {stat.median.toFixed(2)}
                        </Table.Td>
                        <Table.Td className="text-end pr-14 !pl-0">
                          {stat.maxScore.toFixed(2)}
                        </Table.Td>
                        <Table.Td className="text-end pr-14 !pl-0">
                          {stat.q3.toFixed(2)}
                        </Table.Td>
                        <Table.Td className="text-end pr-14 !pl-0">
                          {stat.q1.toFixed(2)}
                        </Table.Td>
                        <Table.Td className="text-end pr-20 !pl-0">
                          {((totalScore || 0) / (totalStudent || 1)).toFixed(2)}
                        </Table.Td>
                      </Table.Tr>
                    );
                  })}
                </Table.Tbody>
              </Table>
            </div>
          ) : (
            <div className="flex items-center  !h-full !w-full justify-between px-16">
              <div className="flex flex-col gap-3 text-start">
                <p className="!h-full text-[20px] text-secondary font-semibold">
                  No Assignment
                </p>
                <p className=" text-[#333333] -mt-1  text-b2 break-words font-medium leading-relaxed">
                  It seems like no assignments.
                </p>
              </div>
              <div className=" items-center justify-center flex">
                <img
                  src={notFoundImage}
                  className="h-full items-center  w-[24vw] justify-center flex flex-col"
                  alt="notFound"
                ></img>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
