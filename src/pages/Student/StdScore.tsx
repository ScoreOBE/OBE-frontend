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
      <div className="bg-white flex flex-col h-full w-full sm:px-6 iphone:max-sm:px-3 iphone:max-sm:py-3 sm:py-5 gap-3 iphone:max-sm:overflow-y-auto  overflow-hidden">
        <Breadcrumbs items={items} />
        {loading ? (
          <Loading />
        ) : (
          <>
            <div className="flex  flex-col border-b-2 border-nodata sm:pt-2 pb-3 items-start gap-4 text-start">
              <div className="flex justify-between w-full sm:px-2 items-center">
                <div className="flex flex-col sm:pb-1 sm:px-2">
                  <div className="flex gap-1">
                    <p className="text-[#3f4474] iphone:max-sm:text-[14px] font-semibold text-b1 acerSwift:max-macair133:!size-b2">
                      {name}
                    </p>
                    {!isMobile && (
                      <div
                        className="p-1 rounded-full w-6 h-6 bg-deemphasize/10 hover:bg-deemphasize/20 cursor-pointer"
                        onClick={() => setOpenModalEvalChart(true)}
                      >
                        <Icon
                          IconComponent={IconChart}
                          className="size-3 acerSwift:max-macair133:size-3 text-[#3f4474]"
                        />
                      </div>
                    )}
                  </div>
                  <p className="text-default iphone:max-sm:text-[14px]  text-h1 font-semibold">
                    {fullScore?.toFixed(2)}{" "}
                    <span className="text-b1 acerSwift:max-macair133:!text-b2 ">
                      pts.
                    </span>
                  </p>
                </div>
                <p className="text-[#3f4474] mb-1 iphone:max-sm:text-[12px]  font-semibold sm:max-macair133:text-[14px] text-b1 acerSwift:max-macair133:!text-b2">
                  {totalStudent} Students
                </p>
              </div>
              <div className="sm:flex  sm:px-10 iphone:max-sm:-mt-1 iphone:max-sm:grid iphone:max-sm:gap-3 iphone:max-sm:grid-cols-2 iphone:max-sm:p-3 iphone:max-sm:bg-slate-100 iphone:max-sm:rounded-md sm:flex-row justify-between w-full">
                <div className="flex flex-col">
                  <p className="font-semibold sm:text-[16px] iphone:max-sm:text-[14px] text-secondary">
                    Your Score
                  </p>
                  <p className="font-bold text-[24px] iphone:max-sm:text-[14px] sm:max-macair133:text-[20px] text-secondary">
                    {yourScores?.questions
                      .filter(({ score }) => score >= 0)
                      .reduce((a, { score }) => a + score, 0)
                      .toFixed(2)}
                  </p>
                </div>
                <div className="flex flex-col">
                  <p className="font-semibold iphone:max-sm:text-[14px] text-[16px] text-[#777777]">
                    Mean
                  </p>
                  <p className="font-bold iphone:max-sm:text-[14px] text-[24px] sm:max-macair133:text-[20px] text-default">
                    {mean.toFixed(2)}
                  </p>
                </div>
                <div className="flex flex-col">
                  <p className="font-semibold iphone:max-sm:text-[14px] text-[16px] text-[#777777]">
                    SD
                  </p>
                  <p className="font-bold iphone:max-sm:text-[14px] text-[24px] sm:max-macair133:text-[20px] text-default">
                    {sd.toFixed(2)}
                  </p>
                </div>
                <div className="flex flex-col">
                  <p className="font-semibold iphone:max-sm:text-[14px] text-[16px] text-[#777777]">
                    Median
                  </p>
                  <p className="font-bold iphone:max-sm:text-[14px] text-[24px] sm:max-macair133:text-[20px] text-default">
                    {median.toFixed(2)}
                  </p>
                </div>
                <div className="flex flex-col">
                  <p className="font-semibold iphone:max-sm:text-[14px] text-[16px] text-[#777777]">
                    Max
                  </p>
                  <p className="font-bold iphone:max-sm:text-[14px] text-[24px] sm:max-macair133:text-[20px] text-default">
                    {maxScore.toFixed(2)}
                  </p>
                </div>
                <div className="flex flex-col">
                  <p className="font-semibold iphone:max-sm:text-[14px] text-[16px] text-[#777777]">
                    Q3
                  </p>
                  <p className="font-bold iphone:max-sm:text-[14px] text-[24px] sm:max-macair133:text-[20px] text-default">
                    {q3.toFixed(2)}
                  </p>
                </div>
                <div className="flex flex-col">
                  <p className="font-semibold iphone:max-sm:text-[14px] text-[16px] text-[#777777]">
                    Q1
                  </p>
                  <p className="font-bold iphone:max-sm:text-[14px] text-[24px] sm:max-macair133:text-[20px] text-default">
                    {q1 ? q1.toFixed(2) : "-"}
                  </p>
                </div>
              </div>
            </div>
            {/* Table */}
            {!isMobile ? (
              <div
                className="overflow-y-auto mt-2  overflow-x-auto w-full h-fit max-h-full border flex flex-col rounded-lg border-secondary"
                style={{
                  boxShadow: "0px 0px 4px 0px rgba(0, 0, 0, 0.30)",
                  height: "fit-content",
                }}
              >
                <Table stickyHeader striped>
                  <Table.Thead>
                    <Table.Tr className="bg-[#e5e7f6]">
                      <Table.Th className="w-[10%]">Question</Table.Th>
                      <Table.Th className="text-end w-[10%]">
                        Your Score
                      </Table.Th>
                      <Table.Th className="text-end w-[10%]">Mean</Table.Th>
                      <Table.Th className="text-end w-[10%]">SD</Table.Th>
                      <Table.Th className="text-end w-[10%]">Median</Table.Th>
                      <Table.Th className="text-end w-[10%]">Max</Table.Th>
                      <Table.Th className="text-end w-[10%]">Q3</Table.Th>
                      <Table.Th className="text-end w-[10%] px-8">Q1</Table.Th>
                      {/* <Table.Th className="text-end pr-[30px] w-[10%]"></Table.Th> */}
                    </Table.Tr>
                  </Table.Thead>
                  <Table.Tbody className="text-default">
                    {assignment?.questions.map((ques, index) => {
                      const stat = calStat(ques.scores, ques.scores.length);
                      const studentScore = yourScores?.questions.find(
                        (item) => item.name == ques.name
                      )?.score;
                      return (
                        <Table.Tr
                          key={index}
                          className="text-[13px] font-normal py-[14px] w-full cursor-pointer"
                          onClick={() => {
                            setSelectQuestion({
                              assignment,
                              ...ques,
                              studentScore,
                            });
                            setOpenModalChart(true);
                          }}
                        >
                          <Table.Td className="text-start w-[10%]">
                            {ques.name}
                          </Table.Td>
                          <Table.Td className="text-end w-[10%]">
                            {!studentScore || studentScore < 0
                              ? "-"
                              : studentScore.toFixed(2)}{" "}
                            / {ques.fullScore.toFixed(2)}
                          </Table.Td>
                          <Table.Td className="text-end w-[10%]">
                            {stat.mean.toFixed(2)}
                          </Table.Td>
                          <Table.Td className="text-end w-[10%]">
                            {stat.sd.toFixed(2)}
                          </Table.Td>
                          <Table.Td className="text-end w-[10%]">
                            {stat.median.toFixed(2)}
                          </Table.Td>
                          <Table.Td className="text-end w-[10%]">
                            {stat.maxScore.toFixed(2)}
                          </Table.Td>
                          <Table.Td className="text-end w-[10%]">
                            {stat.q3.toFixed(2)}
                          </Table.Td>
                          <Table.Td className="text-end px-8 w-[10%]">
                            {stat.q1 ? stat.q1.toFixed(2) : "-"}
                          </Table.Td>
                        </Table.Tr>
                      );
                    })}
                  </Table.Tbody>
                </Table>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {" "}
                {assignment?.questions.map((ques, index) => {
                  const stat = calStat(ques.scores, ques.scores.length);
                  const studentScore = yourScores?.questions.find(
                    (item) => item.name == ques.name
                  )?.score;
                  return (
                    <div
                      key={index}
                      className={` border flex flex-col  justify-between rounded-md p-3 `}
                    >
                      <div className="flex  justify-between">
                        <div className="flex flex-col">
                          <div className=" font-semibold text-default text-[14px]">
                            {ques.name}
                          </div>
                          <div className="font-semibold text-secondary text-[12px] ">
                            {!studentScore || studentScore < 0
                              ? "-"
                              : studentScore.toFixed(2)}{" "}
                            / {ques.fullScore.toFixed(2)}
                          </div>
                        </div>
                  
                      </div>
                      <div className="mt-2 text-[12px] flex flex-col ">
                        <div className="grid grid-cols-2 p-2 bg-slate-100 rounded-t-md">
                          <div className="text-start">
                            Mean: {stat.mean.toFixed(2)}
                          </div>
                          <div className="text-start">
                            SD: {stat.sd.toFixed(2)}
                          </div>
                        </div>
                        <div className="grid grid-cols-2 p-2 bg-slate-100">
                          <div className="text-start">
                            Median: {stat.median.toFixed(2)}
                          </div>
                          <div className="text-start">
                            Max: {stat.maxScore.toFixed(2)}
                          </div>
                        </div>
                        <div className="grid grid-cols-2 p-2 bg-slate-100 rounded-b-md">
                          <div className="text-start">
                            Q3: {stat.q3.toFixed(2)}
                          </div>
                          <div className="text-start">
                            Q1: {stat.q1 ? stat.q1.toFixed(2) : "-"}
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
