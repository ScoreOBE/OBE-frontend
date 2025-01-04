import React, { useEffect, useState, useRef } from "react";
import maintenace from "@/assets/image/maintenance.jpg";
import unplug from "@/assets/image/unplug.png";
import { useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/store";
import { Button, Table, Tabs, TextInput, Checkbox } from "@mantine/core";
import Icon from "../Icon";
import IconEdit from "@/assets/icons/edit.svg?react";
import IconCheck2 from "@/assets/icons/Check2.svg?react";
import { METHOD_TQF5 } from "@/helpers/constants/enum";
import { useForm } from "@mantine/form";
import { IModelTQF5Part3 } from "@/models/ModelTQF5";
import { updatePartTQF5 } from "@/store/tqf5";
import { isEqual, cloneDeep } from "lodash";
import { initialTqf5Part3 } from "@/helpers/functions/tqf5";
import { IModelTQF3 } from "@/models/ModelTQF3";
import { IModelAssignment } from "@/models/ModelCourse";
import { getSectionNo } from "@/helpers/functions/function";

type TabState = {
  [key: number]: string;
};
type Props = {
  setForm: React.Dispatch<React.SetStateAction<any>>;
  tqf3: IModelTQF3;
  assignments: IModelAssignment[];
};

export default function Part3TQF5({ setForm, tqf3, assignments }: Props) {
  const { courseNo } = useParams();
  const course = useAppSelector((state) =>
    state.course.courses.find((e) => e.courseNo == courseNo)
  );
  const tqf5 = useAppSelector((state) => state.tqf5);
  const dispatch = useAppDispatch();
  const [assessmentCloScores, setAssessmentCloScores] = useState<
    { clo: string; assess: any[] }[]
  >([]);
  const [isEdit, setIsEdit] = useState(false);
  const [activeSection, setActiveSection] = useState<number>(0);
  const [tabStates, setTabStates] = useState<TabState>({});
  const handleTabChange = (index: any, newValue: any) => {
    setTabStates((prevStates) => ({
      ...prevStates,
      [index]: newValue,
    }));
  };
  const sectionRefs = useRef(
    tqf3.part2?.clo.map(() => React.createRef<HTMLDivElement>())
  );

  const form = useForm({
    mode: "controlled",
    initialValues: { data: [] as IModelTQF5Part3[] },
    validateInputOnBlur: true,
    onValuesChange(values, previous) {
      if (!isEqual(values, previous)) {
        dispatch(
          updatePartTQF5({ part: "part3", data: cloneDeep(form.getValues()) })
        );
        setForm(form);
      }
    },
  });
  useEffect(() => {
    if (tqf5.part3) {
      form.setValues(cloneDeep(tqf5.part3));
      combinedAssess();
    } else if (tqf3.part2) {
      form.setValues(
        initialTqf5Part3(tqf5, tqf3.part4?.data, course?.sections as any)
      );
      combinedAssess(form.getValues().data);
    }
  }, [tqf5.method]);

  useEffect(() => {
    if (tqf3.part2) {
      sectionRefs.current = tqf3.part2.clo.map(
        (_, i) => sectionRefs.current?.at(i) || React.createRef()
      );
    }
  }, [tqf3]);

  useEffect(() => {
    if (sectionRefs.current) {
      if (!sectionRefs.current.every((ref) => ref.current)) return;
      let observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const index = sectionRefs.current!.findIndex(
                (ref) => ref.current === entry.target
              );
              setActiveSection(index);
            }
          });
        },
        {
          root: null,
          threshold: 0.6,
        }
      );

      sectionRefs.current.forEach((ref, i) => {
        if (ref.current) {
          observer.observe(ref.current);
        }
      });

      return () => {
        sectionRefs.current!.forEach((ref) => {
          if (ref.current) {
            observer.unobserve(ref.current);
          }
        });
      };
    }
  }, [sectionRefs.current]);

  const combinedAssess = (data?: IModelTQF5Part3[]) => {
    const dataAssess =
      data ??
      initialTqf5Part3(tqf5, tqf3.part4?.data, course?.sections as any).data;
    const result = dataAssess.map((cloData) => {
      const aggregatedAssess = cloData.sections
        .flatMap((section: any) => section.assess)
        .reduce((acc, assess) => {
          if (!acc[assess.eval]) {
            acc[assess.eval] = {
              eval: assess.eval,
              fullScore: assess.fullScore,
              percent: assess.percent,
              score0: 0,
              score1: 0,
              score2: 0,
              score3: 0,
              score4: 0,
            };
          }
          acc[assess.eval].score0 += assess.score0;
          acc[assess.eval].score1 += assess.score1;
          acc[assess.eval].score2 += assess.score2;
          acc[assess.eval].score3 += assess.score3;
          acc[assess.eval].score4 += assess.score4;
          return acc;
        }, {});

      return {
        clo: cloData.clo as string,
        assess: Object.values(aggregatedAssess),
      };
    });
    setAssessmentCloScores(result);
  };

  return tqf5.part2?.updatedAt ? (
    tqf5.method == METHOD_TQF5.MANUAL ? (
      <div className="flex w-full flex-col text-[15px] max-h-full gap-2 text-default">
        <div className="flex flex-col w-full text-secondary gap-4 pb-6">
          <div className="flex text-secondary items-center justify-between flex-row gap-1 text-[15px] w-full ">
            <p className="font-bold">
              Score Range 0 - 4<span className="ml-1 text-red-500">*</span>
            </p>
            <div className="flex gap-2">
              <Button
                leftSection={
                  <Icon
                    IconComponent={isEdit ? IconCheck2 : IconEdit}
                    className="size-4"
                  />
                }
                className="font-bold"
                color={isEdit ? "#0eb092" : "#ee933e"}
                onClick={() => setIsEdit(!isEdit)}
              >
                {isEdit ? "Done" : "Edit"}
              </Button>
            </div>
          </div>
          <div
            className="overflow-x-auto w-full h-fit bg max-h-full border flex flex-col rounded-lg border-secondary"
            style={{
              boxShadow: "0px 0px 4px 0px rgba(0, 0, 0, 0.30)",
            }}
          >
            <Table stickyHeader striped>
              <Table.Thead>
                <Table.Tr className="bg-[#e5e7f6]">
                  <Table.Th>No.</Table.Th>
                  <Table.Th className="w-[35%]">CLO Description</Table.Th>
                  <Table.Th>Section</Table.Th>
                  <Table.Th
                    className={`text-nowrap ${!isEdit && "text-end pr-6"}`}
                  >
                    Score 0
                  </Table.Th>
                  <Table.Th
                    className={`text-nowrap ${!isEdit && "text-end pr-6"}`}
                  >
                    Score 1
                  </Table.Th>
                  <Table.Th
                    className={`text-nowrap ${!isEdit && "text-end pr-6"}`}
                  >
                    Score 2
                  </Table.Th>
                  <Table.Th
                    className={`text-nowrap ${!isEdit && "text-end pr-6"}`}
                  >
                    Score 3
                  </Table.Th>
                  <Table.Th
                    className={`text-nowrap ${!isEdit && "text-end pr-6"}`}
                  >
                    Score 4
                  </Table.Th>
                  <Table.Th className="w-[10%] text-end pr-6">
                    Number of Student
                  </Table.Th>
                  <Table.Th className=" text-end pr-8">Average</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {form.getValues().data?.map((item, cloIndex) => {
                  const clo = tqf3.part2?.clo.find((e) => e.id == item.clo);
                  return item.sections.map((sec, index) => {
                    const data = Object.values(sec)
                      .slice(1)
                      .map((e: any) => parseInt(e));
                    const total = data.reduce((a, b: any) => a + b, 0) || 0;
                    const avg =
                      total > 0
                        ? (0 * sec.score0 +
                            1 * sec.score1 +
                            2 * sec.score2 +
                            3 * sec.score3 +
                            4 * sec.score4) /
                          total
                        : 0;
                    return (
                      <Table.Tr
                        className="font-medium text-default text-[13px]"
                        key={`${cloIndex}-${sec.sectionNo}`}
                      >
                        {index == 0 && (
                          <>
                            <Table.Td rowSpan={item.sections.length}>
                              {clo?.no}
                            </Table.Td>
                            <Table.Td
                              className="w-[35%]"
                              rowSpan={item.sections.length}
                            >
                              <div>
                                <p>{clo?.descTH}</p>
                                <p>{clo?.descEN}</p>
                              </div>
                            </Table.Td>
                          </>
                        )}
                        <Table.Td>{sec.sectionNo}</Table.Td>
                        {Object.keys(sec)
                          .slice(1)
                          .map((key) => (
                            <Table.Td
                              key={key}
                              className={`text-end ${!isEdit && "pr-6"}`}
                            >
                              {isEdit ? (
                                <TextInput
                                  size="xs"
                                  className="w-[60px]"
                                  {...form.getInputProps(
                                    `data.${cloIndex}.sections.${index}.${key}`
                                  )}
                                />
                              ) : (
                                (sec as any)[key] ?? "-"
                              )}
                            </Table.Td>
                          ))}
                        <Table.Td className="text-end pr-6">{total}</Table.Td>
                        <Table.Td className="text-end pr-8">
                          {avg.toFixed(2)}
                        </Table.Td>
                      </Table.Tr>
                    );
                  });
                })}
              </Table.Tbody>
            </Table>
          </div>
        </div>
      </div>
    ) : (
      <div className="flex w-full text-[15px] max-h-full gap-4 text-default">
        <div className="gap-2 flex flex-col w-full -mt-3 overflow-y-auto  max-h-full">
          {form.getValues().data?.map((cloItem, cloIndex) => {
            const clo = tqf3.part2?.clo.find((e) => e.id == cloItem.clo);
            const assessment = tqf5.part2?.data.find(
              (cl) => cl.clo === clo?.id
            )?.assignments;

            return (
              <div
                className={`last:mb-4 flex flex-col gap-10 pb-4 border-b-2 mr-1 ${
                  activeSection === cloIndex ? "active" : ""
                }`}
                id={`${clo?.no}`}
                key={clo?.id}
                ref={sectionRefs.current!.at(cloIndex)}
              >
                <Tabs
                  classNames={{
                    root: "overflow-hidden mt-1 flex flex-col max-h-full",
                  }}
                  value={tabStates[cloIndex] || "assessmentTool"}
                  onChange={(newValue) => handleTabChange(cloIndex, newValue)}
                >
                  <Tabs.List className="mb-2">
                    <Tabs.Tab value="assessmentTool">Assessment Tool</Tabs.Tab>
                    <Tabs.Tab value="scoreRange">Score Range</Tabs.Tab>
                    <Tabs.Tab value="detailCriteria">Detail Criteria</Tabs.Tab>
                  </Tabs.List>
                  <Tabs.Panel
                    className="flex flex-col gap-5 py-3 px-4"
                    value="assessmentTool"
                  >
                    <div className="flex justify-between items-center">
                      <div className="flex justify-between">
                        <div className="text-default flex items-center  font-medium text-[15px]">
                          <p className="text-[18px] text-secondary mr-2 font-semibold">
                            CLO {clo?.no}
                          </p>
                          <div className="flex flex-col ml-2 gap-[2px]">
                            <p>{clo?.descTH}</p>
                            <p>{clo?.descEN}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    {assessment?.map((eva, evaIndex) => {
                      const evaluation = tqf3.part3?.eval.find(
                        (e) => e.id === eva.eval
                      );
                      const assess = [
                        ...new Set(
                          eva.questions.flatMap((e) =>
                            e.substring(0, e.lastIndexOf("-"))
                          )
                        ),
                      ].sort();
                      const fullScore = assignments
                        .filter((e) => assess.includes(e.name))
                        .flatMap((e) =>
                          e.questions.map((question) => ({
                            sheet: e.name,
                            ...question,
                          }))
                        )
                        .filter((e) =>
                          eva.questions.includes(`${e.sheet}-${e.name}`)
                        )
                        .reduce((a, b) => a + b.fullScore, 0);
                      const percent = tqf3.part4?.data[cloIndex].evals.find(
                        (e) => e.eval == eva.eval
                      )?.percent;
                      return (
                        <div
                          key={evaIndex}
                          className="rounded-md overflow-clip text-[14px] border ml-1"
                        >
                          <div className="flex flex-col">
                            <div className="bg-bgTableHeader font-semibold text-secondary px-4 py-3 flex justify-between items-center">
                              <div className="flex flex-col gap-[2px]">
                                <p className="text-[15px]">
                                  {evaluation?.topicTH} | {evaluation?.topicEN}{" "}
                                  ({percent} %)
                                </p>
                                <p>
                                  Description:
                                  {evaluation?.desc?.length
                                    ? evaluation.desc
                                    : "-"}
                                </p>
                              </div>

                              <p>{fullScore}</p>
                            </div>

                            {assess?.map((sheet, sheetIndex) => {
                              const questions = eva.questions
                                .filter((e) => e.includes(sheet))
                                .map((e) =>
                                  e.substring(e.lastIndexOf("-")).slice(1)
                                );
                              return (
                                <div
                                  key={sheetIndex}
                                  className=" font-medium text-default"
                                >
                                  <div className="bg-[#F3F3F3] text-default font-semibold px-4 py-3">
                                    <p>{sheet}</p>
                                  </div>

                                  {questions.map((ques, quesIndex) => {
                                    const question = assignments
                                      ?.find((e) => e.name == sheet)
                                      ?.questions.find((e) => e.name == ques);

                                    return (
                                      <div
                                        key={quesIndex}
                                        className="flex justify-between items-center pl-8 px-4 py-3 "
                                      >
                                        <p className="font-medium text-[13px] text-default">
                                          {ques}
                                          {question?.desc?.length
                                            ? ` - ${question.desc}`
                                            : ""}
                                        </p>
                                        <p>{question?.fullScore}</p>
                                      </div>
                                    );
                                  })}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </Tabs.Panel>
                  <Tabs.Panel
                    className="flex flex-col gap-5 py-3 px-4"
                    value="scoreRange"
                  >
                    <div className="flex justify-between items-center">
                      <div className="flex justify-between">
                        <div className="text-default flex items-center  font-medium text-[15px]">
                          <p className="text-[18px] text-secondary mr-2 font-semibold">
                            CLO {clo?.no}{" "}
                          </p>
                          <div className="flex flex-col ml-2 gap-[2px]">
                            <p>{clo?.descTH}</p>
                            <p>{clo?.descEN}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="overflow-x-auto h-fit bg max-h-full border flex flex-col rounded-lg border-secondary">
                      <Table stickyHeader striped>
                        <Table.Thead>
                          <Table.Tr>
                            <Table.Th>Section</Table.Th>
                            <Table.Th className={`text-nowrap text-end`}>
                              Score 0
                            </Table.Th>
                            <Table.Th className={`text-nowrap text-end`}>
                              Score 1
                            </Table.Th>
                            <Table.Th className={`text-nowrap text-end`}>
                              Score 2
                            </Table.Th>
                            <Table.Th className={`text-nowrap text-end`}>
                              Score 3
                            </Table.Th>
                            <Table.Th className={`text-nowrap text-end`}>
                              Score 4
                            </Table.Th>
                            <Table.Th className="w-[15%] text-end pr-3">
                              Number of Student
                            </Table.Th>
                            <Table.Th className="w-[13%] text-end pr-8">
                              Average
                            </Table.Th>
                          </Table.Tr>
                        </Table.Thead>
                        <Table.Tbody>
                          {cloItem.sections?.map((sec) => {
                            const data = Object.values(sec)
                              .slice(-5)
                              .map((e: any) => parseInt(e));
                            const total =
                              data.reduce((a, b: any) => a + b, 0) || 0;
                            const avg =
                              total > 0
                                ? (0 * sec.score0 +
                                    1 * sec.score1 +
                                    2 * sec.score2 +
                                    3 * sec.score3 +
                                    4 * sec.score4) /
                                  total
                                : 0;
                            return (
                              <Table.Tr
                                className="font-medium text-default text-[13px]"
                                key={sec.sectionNo}
                              >
                                <Table.Td>
                                  {getSectionNo(sec.sectionNo)}
                                </Table.Td>
                                {Object.keys(sec)
                                  .slice(-5)
                                  .map((key) => (
                                    <Table.Td key={key} className={`text-end `}>
                                      {(sec as any)[key] ?? "-"}
                                    </Table.Td>
                                  ))}
                                <Table.Td className="text-end pr-3 w-[13%]">
                                  {total}
                                </Table.Td>
                                <Table.Td className="text-end  pr-8 w-[13%]">
                                  {avg.toFixed(2)}
                                </Table.Td>
                              </Table.Tr>
                            );
                          })}
                        </Table.Tbody>
                        <Table.Tfoot>
                          <Table.Tr className="bg-bgTableHeader text-secondary">
                            <Table.Th>Total</Table.Th>
                            {[
                              "score0",
                              "score1",
                              "score2",
                              "score3",
                              "score4",
                            ].map((key) => (
                              <Table.Th key={key} className="text-end">
                                {cloItem.sections?.reduce(
                                  (sum, sec) => sum + ((sec as any)[key] || 0),
                                  0
                                ) ?? 0}
                              </Table.Th>
                            ))}
                            <Table.Th className="w-[15%] text-end pr-3">
                              {cloItem.sections?.reduce(
                                (sum, sec) =>
                                  sum +
                                  Object.values(sec)
                                    .slice(-5)
                                    .reduce(
                                      (a, b: any) => a + parseInt(b || 0),
                                      0
                                    ),
                                0
                              ) ?? 0}
                            </Table.Th>
                            <Table.Th className="w-[13%] text-end pr-8">
                              {(
                                cloItem.sections?.reduce((sum, sec) => {
                                  const data = Object.values(sec)
                                    .slice(-5)
                                    .map((e: any) => parseInt(e));
                                  const total = data.reduce((a, b) => a + b, 0);
                                  return (
                                    sum +
                                    (total > 0
                                      ? (0 * sec.score0 +
                                          1 * sec.score1 +
                                          2 * sec.score2 +
                                          3 * sec.score3 +
                                          4 * sec.score4) /
                                        total
                                      : 0)
                                  );
                                }, 0) / cloItem.sections?.length || 0
                              ).toFixed(2)}
                            </Table.Th>
                          </Table.Tr>
                        </Table.Tfoot>
                      </Table>
                    </div>
                  </Tabs.Panel>
                  <Tabs.Panel
                    className="flex flex-col gap-5 py-3 px-4"
                    value="detailCriteria"
                  >
                    <div className="flex justify-between items-center">
                      <div className="flex justify-between">
                        <div className="text-default flex items-center  font-medium text-[15px]">
                          <p className="text-[18px] text-secondary mr-2 font-semibold">
                            CLO {clo?.no}{" "}
                          </p>
                          <div className="flex flex-col ml-2 gap-[2px]">
                            <p>{clo?.descTH}</p>
                            <p>{clo?.descEN}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="overflow-x-auto h-fit bg max-h-full border flex flex-col rounded-lg border-secondary">
                      <Table stickyHeader striped>
                        <Table.Thead>
                          <Table.Tr>
                            <Table.Th>Assessment Tool</Table.Th>
                            <Table.Th className={`text-nowrap text-end`}>
                              Score 0
                            </Table.Th>
                            <Table.Th className={`text-nowrap text-end`}>
                              Score 1
                            </Table.Th>
                            <Table.Th className={`text-nowrap text-end`}>
                              Score 2
                            </Table.Th>
                            <Table.Th className={`text-nowrap text-end`}>
                              Score 3
                            </Table.Th>
                            <Table.Th className={`text-nowrap text-end`}>
                              Score 4
                            </Table.Th>
                            <Table.Th className="w-[15%] text-end pr-3">
                              Number of Student
                            </Table.Th>
                            <Table.Th className="w-[13%] text-end pr-8">
                              Average
                            </Table.Th>
                          </Table.Tr>
                        </Table.Thead>
                        <Table.Tbody>
                          {assessmentCloScores[cloIndex].assess.map(
                            (assess) => {
                              const evaluation = tqf3.part3?.eval.find(
                                (e) => e.id === assess.eval
                              );
                              const data = Object.values(assess)
                                .slice(-5)
                                .map((e: any) => parseInt(e));
                              const total =
                                data.reduce((a, b: any) => a + b, 0) || 0;
                              const avg =
                                total > 0
                                  ? (0 * assess.score0 +
                                      1 * assess.score1 +
                                      2 * assess.score2 +
                                      3 * assess.score3 +
                                      4 * assess.score4) /
                                    total
                                  : 0;
                              return (
                                <Table.Tr
                                  className="font-medium text-default text-[13px]"
                                  key={assess.eval}
                                >
                                  <Table.Td>
                                    <div>
                                      <p>
                                        {evaluation?.topicTH} |{" "}
                                        {evaluation?.topicEN}
                                        <span className="text-secondary">
                                          {" "}
                                          {assess.fullScore} pts.
                                        </span>
                                        ({assess.percent} %)
                                      </p>
                                    </div>
                                  </Table.Td>
                                  {Object.keys(assess)
                                    .slice(-5)
                                    .map((key) => (
                                      <Table.Td
                                        key={key}
                                        className={`text-end `}
                                      >
                                        {(assess as any)[key] ?? "-"}
                                      </Table.Td>
                                    ))}
                                  <Table.Td className="text-end pr-3 w-[13%]">
                                    {total}
                                  </Table.Td>
                                  <Table.Td className="text-end  pr-8 w-[13%]">
                                    {avg.toFixed(2)}
                                  </Table.Td>
                                </Table.Tr>
                              );
                            }
                          )}
                        </Table.Tbody>
                        <Table.Tfoot>
                          <Table.Tr className="bg-bgTableHeader text-secondary">
                            <Table.Th>Total</Table.Th>
                            {[
                              "score0",
                              "score1",
                              "score2",
                              "score3",
                              "score4",
                            ].map((key) => (
                              <Table.Th
                                key={key}
                                className="text-nowrap text-end"
                              >
                                {assessmentCloScores[cloIndex].assess.reduce(
                                  (sum, assess) => sum + (assess[key] || 0),
                                  0
                                ) ?? 0}
                              </Table.Th>
                            ))}
                            <Table.Th className="w-[15%] text-end pr-3">
                              {assessmentCloScores[cloIndex].assess.reduce(
                                (sum, assess) => {
                                  const data = Object.values(assess)
                                    .slice(-5)
                                    .map((e: any) => parseInt(e));
                                  return sum + data.reduce((a, b) => a + b, 0);
                                },
                                0
                              )}
                            </Table.Th>
                            <Table.Th className="w-[13%] text-end pr-8">
                              {(() => {
                                const totals = assessmentCloScores[
                                  cloIndex
                                ].assess.map((assess) => {
                                  const data = Object.values(assess)
                                    .slice(-5)
                                    .map((e: any) => parseInt(e));
                                  const total = data.reduce((a, b) => a + b, 0);
                                  return total > 0
                                    ? (0 * assess.score0 +
                                        1 * assess.score1 +
                                        2 * assess.score2 +
                                        3 * assess.score3 +
                                        4 * assess.score4) /
                                        total
                                    : 0;
                                });
                                const overallTotal = totals.reduce(
                                  (a, b) => a + b,
                                  0
                                );
                                return (
                                  overallTotal /
                                  assessmentCloScores[cloIndex].assess.length
                                ).toFixed(2);
                              })()}
                            </Table.Th>
                          </Table.Tr>
                        </Table.Tfoot>
                      </Table>
                    </div>
                  </Tabs.Panel>
                </Tabs>
              </div>
            );
          })}
        </div>
        <div className="min-w-[70px] px-2 mt-1 flex flex-col">
          {form.getValues().data?.map((item, index) => {
            const clo = tqf3.part2?.clo.find((e) => e.id == item.clo);
            return (
              <div
                key={index}
                className={`max-w-fit ${
                  activeSection === index ? "active" : ""
                }`}
              >
                <a href={`#${clo?.no}`}>
                  <p
                    className={`mb-[7px] text-ellipsis font-semibold overflow-hidden whitespace-nowrap text-[13px] ${
                      activeSection === index
                        ? "text-secondary"
                        : "text-[#D2C9C9]"
                    }`}
                  >
                    CLO {clo?.no}
                  </p>
                </a>
              </div>
            );
          })}
        </div>
      </div>
    )
  ) : (
    <div className="flex px-16  w-full ipad11:px-8 sm:px-2  gap-5  items-center justify-between h-full">
      <div className="flex justify-center  h-full items-start gap-2 flex-col">
        <p className="   text-secondary font-semibold text-[22px] sm:max-ipad11:text-[20px]">
          Complete TQF5 Part 2 First
        </p>
        <p className=" text-[#333333] leading-6 font-medium text-[14px] sm:max-ipad11:text-[13px]">
          To start TQF5 Part 3, please complete and save TQF5 Part 2. <br />{" "}
          Once done, you can continue to do it.
        </p>
      </div>
      <img
        className=" z-50 ipad11:w-[380px] sm:w-[340px] w-[340px]  macair133:w-[580px] macair133:h-[300px] "
        src={unplug}
        alt="loginImage"
      />
    </div>
  );
}
