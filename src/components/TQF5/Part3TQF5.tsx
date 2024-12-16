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

type TabState = {
  [key: number]: string;
};
type Props = {
  setForm: React.Dispatch<React.SetStateAction<any>>;
  tqf3: IModelTQF3;
};

export default function Part3TQF5({ setForm, tqf3 }: Props) {
  const tqf5 = useAppSelector((state) => state.tqf5);
  const dispatch = useAppDispatch();
  const { courseNo, sectionNo } = useParams();
  const [isEdit, setIsEdit] = useState(false);
  const [activeSection, setActiveSection] = useState<number>(0);
  const [tabStates, setTabStates] = useState<TabState>({});
  const handleTabChange = (index: any, newValue: any) => {
    setTabStates((prevStates) => ({
      ...prevStates,
      [index]: newValue,
    }));
  };
  const course = useAppSelector((state) =>
    state.course.courses.find((e) => e.courseNo == courseNo)
  );
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
    } else if (tqf3.part2) {
      form.setValues(initialTqf5Part3(tqf3.part2.clo));
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

  return tqf5.part2?.updatedAt ? (
    tqf5.method == METHOD_TQF5.MANUAL ? (
      <div className="flex w-full flex-col text-[15px] max-h-full gap-2 text-default ">
        <div className="flex flex-col w-full text-secondary gap-4">
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
                {form.getValues().data?.map((item, index) => {
                  const clo = tqf3.part2?.clo.find((e) => e.id == item.clo);
                  const data = Object.values(item)
                    .slice(1)
                    .map((e: any) => parseInt(e));
                  const total = data.reduce((a, b: any) => a + b, 0);
                  const avg =
                    total > 0
                      ? (0 * item.score0 +
                          1 * item.score1 +
                          2 * item.score2 +
                          3 * item.score3 +
                          4 * item.score4) /
                        total
                      : 0;
                  return (
                    <Table.Tr
                      className="font-medium text-default text-[13px]"
                      key={item.clo as string}
                    >
                      <Table.Td>{clo?.no}</Table.Td>
                      <Table.Td className="w-[35%]">
                        <div>
                          <p>{clo?.descTH}</p>
                          <p>{clo?.descEN}</p>
                        </div>
                      </Table.Td>
                      {Object.keys(item)
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
                                {...form.getInputProps(`data.${index}.${key}`)}
                              />
                            ) : (
                              (item as any)[key] ?? "-"
                            )}
                          </Table.Td>
                        ))}
                      <Table.Td className="text-end pr-6">{total}</Table.Td>
                      <Table.Td className="text-end  pr-8">
                        {avg.toFixed(2)}
                      </Table.Td>
                    </Table.Tr>
                  );
                })}
              </Table.Tbody>
            </Table>
          </div>
        </div>
      </div>
    ) : (
      // <div className="flex px-16 sm:max-ipad11:px-8 flex-row items-center justify-between h-full">
      //   <div className="h-full  justify-center flex flex-col">
      //     <p className="text-secondary text-[21px] font-semibold">
      //       TQF 5 is coming soon to{" "}
      //       <span className="font-[600] text-transparent bg-clip-text bg-gradient-to-r from-[#4285f4] via-[#ec407a] via-[#a06ee1] to-[#fb8c00]">
      //         ScoreOBE +{" "}
      //       </span>{" "}
      //     </p>
      //     <br />
      //     <p className=" -mt-3 mb-6 text-b2 break-words font-medium leading-relaxed">
      //       Instructors, get ready to experience a new and improved way to
      //       complete TQF 5 <br /> starting February 2025.
      //     </p>
      //   </div>
      //   <img className=" z-50  w-[25vw] " src={maintenace} alt="loginImage" />
      // </div>

      <div className="flex w-full text-[15px] max-h-full gap-4 text-default">
        <div className="gap-2 flex flex-col w-full -mt-3 overflow-y-auto  max-h-full">
          {form.getValues().data?.map((item, index) => {
            const clo = tqf3.part2?.clo.find((e) => e.id == item.clo);
            const assessment = tqf3.part4?.data.find(
              (cl) => cl.clo === clo?.id
            )?.evals;

            return (
              <div
                className={`last:mb-4 flex flex-col gap-10 pb-4 border-b-2 mr-1 ${
                  activeSection === index ? "active" : ""
                }`}
                id={`${clo?.no}`}
                key={clo?.id}
                ref={sectionRefs.current!.at(index)}
              >
                <Tabs
                  classNames={{
                    root: "overflow-hidden mt-1 flex flex-col max-h-full",
                  }}
                  value={tabStates[index] || "assessmentTool"}
                  onChange={(newValue) => handleTabChange(index, newValue)}
                >
                  <Tabs.List className="mb-2">
                    <Tabs.Tab value="assessmentTool">Assessment Tool</Tabs.Tab>
                    <Tabs.Tab value="scoreRange">Score Range</Tabs.Tab>
                  </Tabs.List>
                  <Tabs.Panel
                    className="flex flex-col gap-5 py-3 px-4"
                    value="assessmentTool"
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

                      <Button>See Detail Criteria</Button>
                    </div>

                    {assessment?.map((eva, evaIndex) => {
                      const evaluation = tqf3.part3?.eval.find(
                        (e) => e.id === eva.eval
                      );
                      const assignment = tqf5.assignmentsMap?.find(
                        (as) => as.eval === evaluation?.topicEN
                      )?.assignment;

                      return (
                        <div
                          key={evaIndex}
                          className="rounded-md overflow-clip text-[14px] border ml-1"
                        >
                          <div className="flex flex-col">
                            <p className="bg-bgTableHeader font-semibold text-secondary px-4 py-3">
                              <div className="flex flex-col gap-[2px]">
                                <p className="text-[15px]">
                                  {evaluation?.topicTH} | {evaluation?.topicEN}
                                </p>
                                <p>
                                  Description:
                                  {evaluation?.desc?.length
                                    ? evaluation.desc
                                    : "-"}
                                </p>
                              </div>
                            </p>

                            {assignment?.map((as, assignIndex) => (
                              <div
                                key={assignIndex}
                                className=" font-medium text-default"
                              >
                                <div className="bg-[#F3F3F3] text-default font-semibold px-4 py-3">
                                  <p>{as}</p>
                                </div>

                                <p className="flex items-center px-4 py-3 font-medium text-[13px] text-default pl-8">
                                  1 - wkok
                                </p>
                              </div>
                            ))}
                          </div>{" "}
                        </div>
                      );
                    })}
                    <p>Test</p>
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

                      <Button>See Detail Criteria</Button>
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
                          {form.getValues().data?.map((item, index) => {
                            const clo = tqf3.part2?.clo.find(
                              (e) => e.id == item.clo
                            );
                            const data = Object.values(item)
                              .slice(1)
                              .map((e: any) => parseInt(e));
                            const total = data.reduce((a, b: any) => a + b, 0);
                            const avg =
                              total > 0
                                ? (0 * item.score0 +
                                    1 * item.score1 +
                                    2 * item.score2 +
                                    3 * item.score3 +
                                    4 * item.score4) /
                                  total
                                : 0;
                            return (
                              <Table.Tr
                                className="font-medium text-default text-[13px]"
                                key={item.clo as string}
                              >
                                <Table.Td>mock 00{clo?.no}</Table.Td>
                                {Object.keys(item)
                                  .slice(1)
                                  .map((key) => (
                                    <Table.Td key={key} className={`text-end `}>
                                      {(item as any)[key] ?? "-"}
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

                            <Table.Th className={`text-nowrap text-end`}>
                              0
                            </Table.Th>
                            <Table.Th className={`text-nowrap text-end`}>
                              0
                            </Table.Th>
                            <Table.Th className={`text-nowrap text-end`}>
                              0
                            </Table.Th>
                            <Table.Th className={`text-nowrap text-end`}>
                              0
                            </Table.Th>
                            <Table.Th className={`text-nowrap text-end`}>
                              0
                            </Table.Th>
                            <Table.Th className="w-[15%] text-end pr-3">
                              0
                            </Table.Th>
                            <Table.Th className="w-[13%] text-end pr-8">
                              0.00
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
