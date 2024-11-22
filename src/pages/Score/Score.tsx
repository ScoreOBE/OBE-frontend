import { useAppDispatch, useAppSelector } from "@/store";
import { useEffect, useState } from "react";
import { Accordion, Table } from "@mantine/core";
import Breadcrumbs from "@/components/Breadcrumbs";
import { useParams, useSearchParams } from "react-router-dom";
import { getSectionNo } from "@/helpers/functions/function";
import { ROUTE_PATH } from "@/helpers/constants/route";
import needAccess from "@/assets/image/needAccess.jpg";
import { setShowNavbar, setShowSidebar } from "@/store/config";
import { IModelUser } from "@/models/ModelUser";
import Loading from "@/components/Loading/Loading";
import Icon from "@/components/Icon";
import IconChevronDown from "@/assets/icons/chevronDown.svg?react";
import ChartContainer from "@/components/Chart/ChartContainer";
import { calStat } from "@/helpers/functions/score";

export default function Overall() {
  const { courseNo, sectionNo, name } = useParams();
  const loading = useAppSelector((state) => state.loading.loading);
  const user = useAppSelector((state) => state.user);
  const course = useAppSelector((state) =>
    state.course.courses.find((e) => e.courseNo == courseNo)
  );
  const section = course?.sections.find(
    (sec) => parseInt(sectionNo!) === sec.sectionNo
  );
  const assignment = section?.assignments?.find((item) => item.name == name);
  const [params, setParams] = useSearchParams();
  const dispatch = useAppDispatch();
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
      title: `Assignment Section ${getSectionNo(sectionNo)}`,
      path: `${ROUTE_PATH.COURSE}/${courseNo}/${
        ROUTE_PATH.SECTION
      }/${sectionNo}/${ROUTE_PATH.ASSIGNMENT}?${params.toString()}`,
    },
    { title: `${name}` },
  ]);

  useEffect(() => {
    dispatch(setShowSidebar(true));
    dispatch(setShowNavbar(true));
  }, []);

  const fullScore =
    assignment?.questions.reduce((a, { fullScore }) => a + fullScore, 0) || 0;
  const scores = section?.students
    ?.map(({ scores }) =>
      scores
        .find(({ assignmentName }) => assignmentName == name)
        ?.questions?.reduce((sum, { score }) => sum + score, 0)
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

  return (
    <>
      <div className="bg-white flex flex-col h-full w-full px-6 py-5 gap-3 overflow-hidden">
        <Breadcrumbs items={items} />
        {loading ? (
          <Loading />
        ) : (section?.instructor as IModelUser)?.id === user.id ||
          (section?.coInstructors as IModelUser[])
            ?.map(({ id }) => id)
            .includes(user.id) ? (
          <>
            <div className="flex flex-col border-b-2 border-nodata pt-2 pb-3 items-start gap-4 text-start">
              <p className="text-secondary text-[18px] font-semibold">
                {name} - {fullScore} Points
              </p>
              <div className="flex px-10 flex-row justify-between w-full">
                <div className="flex flex-col">
                  <p className="font-semibold text-[16px] text-[#777777]">
                    Mean
                  </p>
                  <p className="font-bold text-[24px] sm:max-macair133:text-[20px] text-default">
                    {mean.toFixed(2)}
                  </p>
                </div>
                <div className="flex flex-col">
                  <p className="font-semibold text-[16px] text-[#777777]">SD</p>
                  <p className="font-bold text-[24px] sm:max-macair133:text-[20px] text-default">
                    {sd.toFixed(2)}
                  </p>
                </div>
                <div className="flex flex-col">
                  <p className="font-semibold text-[16px] text-[#777777]">
                    Median
                  </p>
                  <p className="font-bold text-[24px] sm:max-macair133:text-[20px]] text-default">
                    {median.toFixed(2)}
                  </p>
                </div>
                <div className="flex flex-col">
                  <p className="font-semibold text-[16px] text-[#777777]">
                    Max
                  </p>
                  <p className="font-bold text-[24px] sm:max-macair133:text-[20px] text-default">
                    {maxScore.toFixed(2)}
                  </p>
                </div>
                <div className="flex flex-col">
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
                    {q1.toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
            {/* Table */}
            <div
              className="overflow-y-auto mt-2  overflow-x-auto w-full h-fit max-h-full border flex flex-col rounded-lg border-secondary"
              style={{
                boxShadow: "0px 0px 4px 0px rgba(0, 0, 0, 0.30)",
                height: "fit-content",
              }}
            >
              <Table stickyHeader>
                <Table.Thead>
                  <Table.Tr className="bg-[#e5e7f6]">
                    <Table.Th className="w-[12%]">Question</Table.Th>
                    <Table.Th className="text-end pr-[70px] w-[14%]">
                      Full Score
                    </Table.Th>
                    <Table.Th className="text-end pr-[70px]  w-[11%]">
                      Mean
                    </Table.Th>
                    <Table.Th className="text-end pr-[70px]  w-[11%]">
                      SD
                    </Table.Th>
                    <Table.Th className="text-end pr-[70px]  w-[11%]">
                      Median
                    </Table.Th>
                    <Table.Th className="text-end pr-[70px] w-[11%]">
                      Max
                    </Table.Th>
                    <Table.Th className="text-end pr-[70px] w-[11%]">
                      Q3
                    </Table.Th>
                    <Table.Th className="text-end pr-[70px] w-[11%]">
                      Q1
                    </Table.Th>
                    <Table.Th className="text-end pr-[70px] w-[8%]"></Table.Th>
                  </Table.Tr>
                </Table.Thead>
              </Table>

              <Accordion chevron={false} unstyled>
                {assignment?.questions.map((ques, index) => {
                  const dataScores =
                    section?.students
                      ?.flatMap(({ scores }) =>
                        scores
                          .filter((item) => item.assignmentName === name)
                          .flatMap((item) =>
                            item.questions.filter((q) => q.name === ques.name)
                          )
                          .map((question) => question.score)
                      )
                      .sort((a, b) => a - b) || [];
                  const stat = calStat(dataScores, scores?.length);
                  return (
                    <Accordion.Item
                      value={ques.name}
                      key={index}
                      className={`!px-0 ${
                        index % 2 === 0 ? "bg-[#F8F9FA]" : ""
                      }`}
                    >
                      <Accordion.Control
                        className="pl-0 py-1.5 w-full"
                        classNames={{
                          label: `flex-itemstart w-full`,
                        }}
                      >
                        <Table>
                          <Table.Tbody className="text-default">
                            {/* Entire Table Row as Control */}
                            <Table.Tr className="text-[13px] font-normal py-[14px] w-full ">
                              <Table.Td className="text-start w-[12%]">
                                {ques.name}
                              </Table.Td>
                              <Table.Td className="text-end pr-[70px] w-[14%]">
                                {ques.fullScore}
                              </Table.Td>
                              <Table.Td className="text-end pr-[70px] w-[11%]">
                                {stat.mean.toFixed(2)}
                              </Table.Td>
                              <Table.Td className="text-end pr-[70px] w-[11%]">
                                {stat.sd.toFixed(2)}
                              </Table.Td>
                              <Table.Td className="text-end pr-[70px] w-[11%]">
                                {stat.median.toFixed(2)}
                              </Table.Td>
                              <Table.Td className="text-end pr-[70px]  w-[11%]">
                                {stat.maxScore.toFixed(2)}
                              </Table.Td>
                              <Table.Td className="text-end pr-[70px] w-[11%]">
                                {stat.q3.toFixed(2)}
                              </Table.Td>
                              <Table.Td className="text-end pr-[70px] w-[11%]">
                                {stat.q1.toFixed(2)}
                              </Table.Td>
                              <Table.Th className="text-end pr-[70px] w-[8%]">
                                <Icon
                                  IconComponent={IconChevronDown}
                                  className="size-4"
                                />
                              </Table.Th>
                            </Table.Tr>
                          </Table.Tbody>
                        </Table>
                      </Accordion.Control>
                      <Accordion.Panel className="!py-0">
                        <div className="flex justify-between px-20 pb-6 pt-0">
                          <p className="text-secondary text-[16px] font-semibold">
                            {ques.name} - {ques.fullScore} Points
                          </p>
                          <p className="text-secondary text-[16px] font-semibold">
                            {scores?.length} Students
                          </p>
                        </div>
                        <ChartContainer
                          type="histogram"
                          data={assignment}
                          students={section?.students!}
                          questionName={ques.name}
                        />
                      </Accordion.Panel>
                    </Accordion.Item>
                  );
                })}
              </Accordion>
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
