import { useAppDispatch, useAppSelector } from "@/store";
import { useEffect, useState } from "react";
import { Accordion, Modal, Table } from "@mantine/core";
import Breadcrumbs from "@/components/Breadcrumbs";
import { useParams, useSearchParams } from "react-router-dom";
import { ROUTE_PATH } from "@/helpers/constants/route";
import { setDashboard, setShowNavbar, setShowSidebar } from "@/store/config";
import Loading from "@/components/Loading/Loading";
import Icon from "@/components/Icon";
import IconChart from "@/assets/icons/histogram.svg?react";
import { calStat } from "@/helpers/functions/score";
import { ROLE } from "@/helpers/constants/enum";
import ModalQuestionChart from "@/components/Modal/ModalQuestionChart";
import ModalEvalChart from "@/components/Modal/Score/ModalEvalChart";
import { isMobile } from "@/helpers/functions/function";

export default function StdScore() {
  const { courseNo, name } = useParams();
  const loading = useAppSelector((state) => state.loading.loading);
  const course = useAppSelector((state) =>
    state.enrollCourse.courses.find((e) => e.courseNo == courseNo)
  );
  const studentScore =
    course?.scores
      ?.find(({ assignmentName }) => assignmentName === name)
      ?.questions?.reduce((a, { score }) => a + score, 0) || 0;

  const assignment = course?.section?.assignments?.find(
    (item) => item.name == name
  );
  const yourScores = course?.scores.find(
    ({ assignmentName }) => assignmentName == name
  );
  const [params, setParams] = useSearchParams();
  const dispatch = useAppDispatch();
  const [items, setItems] = useState<any[]>([
    {
      title: "Your Course",
      path: `${ROUTE_PATH.STD_DASHBOARD}?${params.toString()}`,
    },
    {
      title: `Evaluations`,
      path: `${ROUTE_PATH.STD_DASHBOARD}/${courseNo}/${
        ROUTE_PATH.EVALUATION
      }?${params.toString()}`,
    },
    { title: `${name}` },
  ]);
  const [selectQuestion, setSelectQuestion] = useState<any>();
  const [openModalChart, setOpenModalChart] = useState(false);
  const [openModalEvalChart, setOpenModalEvalChart] = useState(false);

  useEffect(() => {
    dispatch(setShowSidebar(true));
    dispatch(setShowNavbar(true));
    dispatch(setDashboard(ROLE.STUDENT));
    localStorage.setItem("dashboard", ROLE.STUDENT);
  }, []);

  const fullScore =
    assignment?.questions.reduce((a, { fullScore }) => a + fullScore, 0) || 0;
  const totalStudent = assignment?.scores.length || 0;
  const { mean, sd, median, maxScore, minScore, q1, q3 } = calStat(
    assignment?.scores || [],
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
  assignment?.scores.forEach((score) => {
    const binIndex = scoresData.findIndex(
      (item) => item.start <= score && item.end >= score
    );
    if (binIndex !== -1) {
      scoresData[binIndex].Students += 1;
    }
  });

  return (
    <>
      <ModalEvalChart
        opened={openModalEvalChart}
        onClose={() => setOpenModalEvalChart(false)}
        fullScore={fullScore}
        totalStudent={totalStudent}
        assignment={assignment!}
        isStudent={true}
        studentScore={studentScore}
      />
      <ModalQuestionChart
        opened={openModalChart}
        onClose={() => setOpenModalChart(false)}
        question={selectQuestion}
      />
      <div className="bg-white rounded-2xl  overflow-hidden  ">
    
      <div className="bg-white flex flex-col h-full w-full sm:px-6 iphone:max-sm:px-4 iphone:max-sm:py-3 sm:py-5 gap-3 overflow-hidden">
          <Breadcrumbs items={items} />

          {loading ? (
            <Loading />
          ) : (
            <div className=" overflow-y-auto">
              {/* Assignment Summary */}
              <div className="border-b border-gray-200 pb-4  mt-2 mb-2">
                {/* Assignment Header */}
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-[#3f4474] font-semibold text-lg iphone:max-sm:text-[14px]">
                        {name}
                      </h3>
                    </div>
                    <p className="text-gray-800 font-semibold text-lg iphone:max-sm:text-[13px] iphone:max-sm:-mt-1">
                      {fullScore?.toFixed(2)}{" "}
                      <span className="text-base text-gray-600">pts.</span>
                    </p>
                  </div>
                  <div className="bg-[#3f4474]/10 px-3 py-1 rounded-full">
                    <p className="text-[#3f4474] font-semibold text-sm iphone:max-sm:text-[12px]">
                      {totalStudent} Students
                    </p>
                  </div>
                </div>

                {/* Statistics Summary */}
                <div
                  className={`grid ${
                    isMobile
                      ? "grid-cols-2 gap-3 bg-gray-50 p-4 -mt-3 rounded-lg"
                      : "sm:grid-cols-7 gap-6"
                  } w-full`}
                >
                  <div className="flex flex-col">
                    <p className="font-semibold text-sm iphone:max-sm:text-xs text-[#1f69f3]">
                      Your Score
                    </p>
                    <p className="font-bold text-xl iphone:max-sm:text-base text-[#1f69f3]">
                      {yourScores?.questions
                        .filter(({ score }) => score >= 0)
                        .reduce((a, { score }) => a + score, 0)
                        .toFixed(2)}
                    </p>
                  </div>

                  <div className="flex flex-col">
                    <p className="font-semibold text-sm iphone:max-sm:text-xs text-gray-500">
                      Mean
                    </p>
                    <p className="font-bold text-xl iphone:max-sm:text-base text-gray-800">
                      {mean.toFixed(2)}
                    </p>
                  </div>

                  <div className="flex flex-col">
                    <p className="font-semibold text-sm iphone:max-sm:text-xs text-gray-500">
                      SD
                    </p>
                    <p className="font-bold text-xl iphone:max-sm:text-base text-gray-800">
                      {sd.toFixed(2)}
                    </p>
                  </div>

                  <div className="flex flex-col">
                    <p className="font-semibold text-sm iphone:max-sm:text-xs text-gray-500">
                      Median
                    </p>
                    <p className="font-bold text-xl iphone:max-sm:text-base text-gray-800">
                      {median.toFixed(2)}
                    </p>
                  </div>

                  <div className="flex flex-col">
                    <p className="font-semibold text-sm iphone:max-sm:text-xs text-gray-500">
                      Max
                    </p>
                    <p className="font-bold text-xl iphone:max-sm:text-base text-gray-800">
                      {maxScore.toFixed(2)}
                    </p>
                  </div>

                  <div className="flex flex-col">
                    <p className="font-semibold text-sm iphone:max-sm:text-xs text-gray-500">
                      Q3
                    </p>
                    <p className="font-bold text-xl iphone:max-sm:text-base text-gray-800">
                      {q3.toFixed(2)}
                    </p>
                  </div>

                  <div className="flex flex-col">
                    <p className="font-semibold text-sm iphone:max-sm:text-xs text-gray-500">
                      Q1
                    </p>
                    <p className="font-bold text-xl iphone:max-sm:text-base text-gray-800">
                      {q1 ? q1.toFixed(2) : "-"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Questions Table/Cards */}
              {!isMobile ? (
                // Desktop Table View
                <div className="border border-[#1f69f3]/20 rounded-md  overflow-hidden">
                <div className="max-h-[60vh] overflow-auto relative">
                  <table className="w-full min-w-[800px] ">
                    <thead className="sticky top-0 z-10">
                      <tr className="bg-[#e5e7f6] text-[14px]">
                        <th className="py-3 px-4 text-left text-[#3f4474] font-semibold border-b border-[#1f69f3]/10 w-[20%]">
                          Question
                        </th>
                        <th className="py-3 px-4 text-right text-[#3f4474] font-semibold border-b border-[#1f69f3]/10 w-[10%]">
                          Your Score
                        </th>
                        <th className="py-3 px-4 text-right text-[#3f4474] font-semibold border-b border-[#1f69f3]/10 w-[10%]">
                          Mean
                        </th>
                        <th className="py-3 px-4 text-right text-[#3f4474] font-semibold border-b border-[#1f69f3]/10 w-[10%]">
                          SD
                        </th>
                        <th className="py-3 px-4 text-right text-[#3f4474] font-semibold border-b border-[#1f69f3]/10 w-[10%]">
                          Median
                        </th>
                        <th className="py-3 px-4 text-right text-[#3f4474] font-semibold border-b border-[#1f69f3]/10 w-[10%]">
                          Max
                        </th>
                        <th className="py-3 px-4 text-right text-[#3f4474] font-semibold border-b border-[#1f69f3]/10 w-[10%]">
                          Q3
                        </th>
                        <th className="py-3 px-4 text-right text-[#3f4474] font-semibold border-b border-[#1f69f3]/10 w-[10%]">
                          Q1
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {assignment?.questions.map((ques, index) => {
                        const stat = calStat(ques.scores, ques.scores.length);
                        const studentScore = yourScores?.questions.find(
                          (item) => item.name == ques.name
                        )?.score;

                        return (
                          <tr
                            key={index}
                            onClick={() => {
                              setSelectQuestion({
                                assignment,
                                ...ques,
                                studentScore,
                              });
                              setOpenModalChart(true);
                            }}
                            className={`hover:bg-blue-50/30 text-[13px] cursor-pointer transition-colors ${
                              index % 2 === 0 ? "bg-white" : "bg-gray-50/50"
                            }`}
                          >
                            <td className="py-4 px-4 border-b border-gray-100">
                              <div>
                                <span className="font-medium text-gray-800">
                                  {ques.name}
                                </span>
                                {ques.desc && (
                                  <p className="text-sm text-gray-500">
                                    ({ques.desc})
                                  </p>
                                )}
                              </div>
                            </td>
                            <td className="py-4 px-4 text-right border-b border-gray-100 font-medium">
                              <span
                                className={
                                  (studentScore ?? -1) >= 0
                                    ? "text-[#1f69f3]"
                                    : "text-gray-400"
                                }
                              >
                                {!studentScore || studentScore < 0
                                  ? "-"
                                  : studentScore.toFixed(2)}
                              </span>
                              <span className="text-gray-500">
                                {" "}
                                / {ques.fullScore.toFixed(2)}
                              </span>
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
                      })}
                    </tbody>
                  </table>
                  </div>
                </div>
              ) : (
                // Mobile Card View
                <div className="space-y-4">
                  {assignment?.questions.map((ques, index) => {
                    const stat = calStat(ques.scores, ques.scores.length);
                    const studentScore = yourScores?.questions.find(
                      (item) => item.name == ques.name
                    )?.score;

                    return (
                      <div
                        key={index}
                        onClick={() => {
                          setSelectQuestion({
                            assignment,
                            ...ques,
                            studentScore,
                          });
                          setOpenModalChart(true);
                        }}
                        className="bg-white rounded-lg shadow-sm border mt-5 border-gray-200 overflow-hidden hover:border-[#1f69f3]/30 transition-all duration-300 cursor-pointer"
                      >
                        <div className="p-4 border-b border-gray-100">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-medium text-gray-800">
                                {ques.name}
                              </h4>
                              {ques.desc && (
                                <p className="text-xs text-gray-500">
                                  ({ques.desc})
                                </p>
                              )}
                            </div>
                            <div className="bg-[#1f69f3]/10 px-2 py-1 rounded-md">
                              <p
                                className={`text-sm font-medium ${
                                  studentScore !== undefined &&
                                  studentScore >= 0
                                    ? "text-[#1f69f3]"
                                    : "text-gray-400"
                                }`}
                              >
                                {!studentScore || studentScore < 0
                                  ? "-"
                                  : studentScore.toFixed(2)}
                                <span className="text-gray-500">
                                  {" "}
                                  / {ques.fullScore.toFixed(2)}
                                </span>
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2 p-3 bg-gray-50">
                          <div className="p-2">
                            <p className="text-xs text-gray-500">Mean</p>
                            <p className="text-sm font-semibold text-gray-800">
                              {stat.mean.toFixed(2)}
                            </p>
                          </div>
                          <div className="p-2">
                            <p className="text-xs text-gray-500">SD</p>
                            <p className="text-sm font-semibold text-gray-800">
                              {stat.sd.toFixed(2)}
                            </p>
                          </div>
                          <div className="p-2">
                            <p className="text-xs text-gray-500">Median</p>
                            <p className="text-sm font-semibold text-gray-800">
                              {stat.median.toFixed(2)}
                            </p>
                          </div>
                          <div className="p-2">
                            <p className="text-xs text-gray-500">Max</p>
                            <p className="text-sm font-semibold text-gray-800">
                              {stat.maxScore.toFixed(2)}
                            </p>
                          </div>
                          <div className="p-2">
                            <p className="text-xs text-gray-500">Q3</p>
                            <p className="text-sm font-semibold text-gray-800">
                              {stat.q3.toFixed(2)}
                            </p>
                          </div>
                          <div className="p-2">
                            <p className="text-xs text-gray-500">Q1</p>
                            <p className="text-sm font-semibold text-gray-800">
                              {stat.q1 ? stat.q1.toFixed(2) : "-"}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
