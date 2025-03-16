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
import Loading from "@/components/Loading/Loading";
import { Table } from "@mantine/core";
import { calStat } from "@/helpers/functions/score";
import { isMobile } from "@/helpers/functions/function";
import IconChevron from "@/assets/icons/chevronRight.svg?react";
import Icon from "@/components/Icon";

export default function StdAssignment() {
  const { courseNo } = useParams();
  const path = useLocation().pathname;
  const [params, setParams] = useSearchParams();
  const navigate = useNavigate();
  const loading = useAppSelector((state) => state.loading.loading);
  const user = useAppSelector((state) => state.user);
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
    <div className="bg-white h-full  overflow-hidden  ">
      {/* Header */}

      {/* Content */}
      <div className=" flex flex-col h-full w-full sm:px-6 iphone:max-sm:px-4 iphone:max-sm:py-3 sm:py-5 gap-3 overflow-y-auto">
        {loading ? (
          <Loading />
        ) : (
          <div className="!h-full ">
            {course?.section?.assignments?.length !== 0 && (
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <h3 className="font-semibold text-gray-800">
                    {course?.section?.assignments?.length} Evaluation
                    {course?.section?.assignments?.length! > 1 && "s"}
                  </h3>
                </div>
                <div className="bg-[#1f69f3]/10 text-[#1f69f3] text-sm font-medium px-3 py-1 rounded-full">
                  Course Statistics
                </div>
              </div>
            )}

            {course?.section?.assignments?.length !== 0 ? (
              !isMobile ? (
                // Desktop Table View
                <div className="overflow-auto border border-[#1f69f3]/20 rounded-md ">
                  <table className="w-full min-w-[800px]">
                    <thead>
                      <tr className="bg-[#1f69f3]/10 text-[14px]">
                        <th className="py-3 px-4 text-left text-[#1f69f3] font-semibold border-b border-[#1f69f3]/10 w-[20%]">
                          Evaluation
                        </th>
                        <th className="py-3 px-4 text-right text-[#1f69f3] font-semibold border-b border-[#1f69f3]/10 w-[10%]">
                          Your Score
                        </th>
                        <th className="py-3 px-4 text-right text-[#1f69f3] font-semibold border-b border-[#1f69f3]/10 w-[10%]">
                          Mean
                        </th>
                        <th className="py-3 px-4 text-right text-[#1f69f3] font-semibold border-b border-[#1f69f3]/10 w-[10%]">
                          SD
                        </th>
                        <th className="py-3 px-4 text-right text-[#1f69f3] font-semibold border-b border-[#1f69f3]/10 w-[10%]">
                          Median
                        </th>
                        <th className="py-3 px-4 text-right text-[#1f69f3] font-semibold border-b border-[#1f69f3]/10 w-[10%]">
                          Max
                        </th>
                        <th className="py-3 px-4 text-right text-[#1f69f3] font-semibold border-b border-[#1f69f3]/10 w-[10%]">
                          Q3
                        </th>
                        <th className="py-3 px-4 text-right text-[#1f69f3] font-semibold border-b border-[#1f69f3]/10 w-[10%]">
                          Q1
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {course?.section?.assignments?.map(
                        (assignment, index) => {
                          const totalStudent = assignment.scores.length;
                          const stat = calStat(assignment.scores, totalStudent);

                          // Calculate your score
                          const yourScore =
                            course?.scores
                              .find(
                                ({ assignmentName }) =>
                                  assignmentName === assignment.name
                              )
                              ?.questions.filter(({ score }) => score >= 0)
                              .reduce((a, { score }) => a + score, 0) || 0;

                          // Calculate full score
                          const fullScore =
                            assignment.questions.reduce(
                              (a, { fullScore }) => a + fullScore,
                              0
                            ) || 0;

                          // Calculate score percentage for visual indicator
                          const scorePercentage = (yourScore / fullScore) * 100;

                          return (
                            <tr
                              key={index}
                              onClick={() => goToAssignment(assignment.name)}
                              className={`hover:bg-blue-50/30 text-[13px] cursor-pointer transition-colors ${
                                index % 2 === 0 ? "bg-white" : "bg-gray-50/50"
                              }`}
                            >
                              <td className="py-4 px-4 border-b border-gray-100">
                                <div className="flex items-center">
                                  <span className="font-medium text-gray-800">
                                    {assignment.name}
                                  </span>
                                </div>
                              </td>
                              <td className="py-4 px-4 text-right border-b border-gray-100">
                                <div className="inline-flex items-center">
                                  {isMobile && (
                                    <div className="mr-2 w-16 bg-gray-200 rounded-full h-2.5">
                                      <div
                                        className="bg-[#1f69f3] h-2.5 rounded-full"
                                        style={{ width: `${scorePercentage}%` }}
                                      ></div>
                                    </div>
                                  )}
                                  <span className="font-medium text-[#1f69f3]">
                                    {yourScore.toFixed(2)} /{" "}
                                    {fullScore.toFixed(2)}
                                  </span>
                                </div>
                              </td>
                              <td className="py-4 px-4 text-right border-b border-gray-100 font-medium">
                                {stat.mean.toFixed(2)}
                              </td>
                              <td className="py-4 px-4 text-right border-b border-gray-100 font-medium">
                                {stat.sd.toFixed(2)}
                              </td>
                              <td className="py-4 px-4 text-right border-b border-gray-100 font-medium">
                                {stat.median.toFixed(2)}
                              </td>
                              <td className="py-4 px-4 text-right border-b border-gray-100 font-medium">
                                {stat.maxScore.toFixed(2)}
                              </td>
                              <td className="py-4 px-4 text-right border-b border-gray-100 font-medium">
                                {stat.q3.toFixed(2)}
                              </td>
                              <td className="py-4 px-4 text-right border-b border-gray-100 font-medium">
                                {stat.q1 ? stat.q1.toFixed(2) : "-"}
                              </td>
                            </tr>
                          );
                        }
                      )}
                    </tbody>
                  </table>
                </div>
              ) : (
                // Mobile Card View
                <div className="space-y-4 overflow-y-auto">
                  {course?.section?.assignments?.map((assignment, index) => {
                    const totalStudent = assignment.scores.length;
                    const stat = calStat(assignment.scores, totalStudent);

                    // Calculate your score
                    const yourScore =
                      course?.scores
                        .find(
                          ({ assignmentName }) =>
                            assignmentName === assignment.name
                        )
                        ?.questions.filter(({ score }) => score >= 0)
                        .reduce((a, { score }) => a + score, 0) || 0;

                    // Calculate full score
                    const fullScore =
                      assignment.questions.reduce(
                        (a, { fullScore }) => a + fullScore,
                        0
                      ) || 0;

                    // Calculate score percentage for visual indicator
                    const scorePercentage = (yourScore / fullScore) * 100;

                    return (
                      <div
                        key={index}
                        onClick={() => goToAssignment(assignment.name)}
                        className="bg-white  rounded-xl shadow-sm border  border-[#1f69f3]/20 overflow-hidden hover:shadow-md transition-all duration-300 cursor-pointer"
                      >
                        <div className="p-4 border-b border-gray-100">
                          <div className="flex justify-between items-center">
                            <h4 className="font-semibold text-[14px] text-gray-800">
                              {assignment.name}
                            </h4>
                            <Icon
                              IconComponent={IconChevron}
                              className="h-5 w-5 text-gray-400"
                            />
                          </div>

                          <div className="mt-3">
                            <div className="flex justify-between items-center mb-1">
                              <span className="text-sm text-gray-600">
                                Your Score
                              </span>
                              <span className="font-semibold text-[13px] text-[#1f69f3]">
                                {yourScore.toFixed(2)} / {fullScore.toFixed(2)}
                              </span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2.5">
                              <div
                                className="bg-[#1f69f3] h-2.5 rounded-full"
                                style={{ width: `${scorePercentage}%` }}
                              ></div>
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2 p-4 bg-gray-50">
                          <div className="bg-white p-2 rounded-lg border border-gray-100">
                            <div className="text-xs text-gray-500">Mean</div>
                            <div className="font-semibold text-gray-800">
                              {stat.mean.toFixed(2)}
                            </div>
                          </div>
                          <div className="bg-white p-2 rounded-lg border border-gray-100">
                            <div className="text-xs text-gray-500">SD</div>
                            <div className="font-semibold text-gray-800">
                              {stat.sd.toFixed(2)}
                            </div>
                          </div>
                          <div className="bg-white p-2 rounded-lg border border-gray-100">
                            <div className="text-xs text-gray-500">Median</div>
                            <div className="font-semibold text-gray-800">
                              {stat.median.toFixed(2)}
                            </div>
                          </div>
                          <div className="bg-white p-2 rounded-lg border border-gray-100">
                            <div className="text-xs text-gray-500">Max</div>
                            <div className="font-semibold text-gray-800">
                              {stat.maxScore.toFixed(2)}
                            </div>
                          </div>
                          <div className="bg-white p-2 rounded-lg border border-gray-100">
                            <div className="text-xs text-gray-500">Q3</div>
                            <div className="font-semibold text-gray-800">
                              {stat.q3.toFixed(2)}
                            </div>
                          </div>
                          <div className="bg-white p-2 rounded-lg border border-gray-100">
                            <div className="text-xs text-gray-500">Q1</div>
                            <div className="font-semibold text-gray-800">
                              {stat.q1 ? stat.q1.toFixed(2) : "-"}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )
            ) : (
              // No Evaluations State
              <div className="flex items-center  !h-full !w-full justify-between  sm:px-16">
                <div className="flex flex-col gap-3 iphone:max-sm:text-center sm:text-start">
                  <p className="!h-full text-[20px] text-secondary font-semibold">
                    No Evaluation
                  </p>
                  <p className=" text-[#333333] -mt-1  text-b2 break-words font-medium leading-relaxed">
                    The evaluation will show when your score is published <br />{" "}
                    by the instructor or co-instructor.
                  </p>
                </div>
                {!isMobile && (
                  <div className=" items-center justify-center flex">
                    <img
                      src={notFoundImage}
                      className="h-full items-center  w-[24vw] justify-center flex flex-col"
                      alt="notFound"
                    ></img>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
