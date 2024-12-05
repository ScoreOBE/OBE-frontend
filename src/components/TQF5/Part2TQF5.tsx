import maintenace from "@/assets/image/maintenance.png";
import unplug from "@/assets/image/unplug.png";
import { IModelTQF3 } from "@/models/ModelTQF3";
import { useAppSelector, useAppDispatch } from "@/store";
import { Button, TextInput } from "@mantine/core";
import React from "react";
import { useEffect, useRef, useState } from "react";
import Icon from "../Icon";
import IconAdd from "@/assets/icons/plus.svg?react";
import IconTrash from "@/assets/icons/trash.svg?react";
import { useForm } from "@mantine/form";
import { updatePartTQF5 } from "@/store/tqf5";
import { isEqual, cloneDeep } from "lodash";
import { IModelTQF5Part2 } from "@/models/ModelTQF5";
import { initialTqf5Part2 } from "@/helpers/functions/tqf5";
import { METHOD_TQF5 } from "@/helpers/constants/enum";

type Props = {
  setForm: React.Dispatch<React.SetStateAction<any>>;
  tqf3: IModelTQF3;
};

export default function Part2TQF5({ setForm, tqf3 }: Props) {
  const tqf5 = useAppSelector((state) => state.tqf5);
  const dispatch = useAppDispatch();
  const sectionRefs = useRef(
    tqf3.part2?.clo.map(() => React.createRef<HTMLDivElement>())
  );
  const [activeSection, setActiveSection] = useState<number>(0);
  const [assignmentMapping, setAssignmentMapping] = useState();

  const form = useForm({
    mode: "controlled",
    initialValues: { data: [] as IModelTQF5Part2[] },
    validateInputOnBlur: true,
    onValuesChange(values, previous) {
      if (!isEqual(values, previous)) {
        // console.log(values);

        dispatch(
          updatePartTQF5({ part: "part2", data: cloneDeep(form.getValues()) })
        );
        setForm(form);
      }
    },
  });

  useEffect(() => {
    if (tqf5.part2) {
      form.setValues(cloneDeep(tqf5.part2));
    } else if (tqf3.part4) {
      form.setValues(initialTqf5Part2(tqf3.part4.data));
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
          threshold: 0.9,
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

  return tqf5.part1?.updatedAt ? (
    tqf5.method == METHOD_TQF5.MANUAL ? (
      <div className="flex w-full text-[15px] max-h-full gap-4 text-default">
        <div className="gap-4 flex flex-col w-full overflow-y-auto pt-1 max-h-full px-1">
          {form.getValues().data.map((item, indexClo) => {
            const clo = tqf3.part2?.clo.find((e) => e.id == item.clo);
            return (
              <div
                style={{
                  boxShadow: "0px 0px 4px 0px rgba(0, 0, 0, 0.25)",
                }}
                className={`last:mb-4 flex flex-col rounded-md gap-5 px-6 py-5 ${
                  activeSection === indexClo ? "active" : ""
                }`}
                id={`${clo?.id}`}
                key={indexClo}
                ref={sectionRefs.current!.at(indexClo)} // Dynamic refs
              >
                <div className="flex justify-between">
                  <div className="text-default font-medium text-[15px]">
                    <p>
                      CLO {clo?.no} - {clo?.descTH}
                    </p>
                    <p>{clo?.descEN}</p>
                  </div>
                </div>
                {item.assignments.map((item, indexEval) => {
                  const evaluation = tqf3.part3?.eval.find(
                    (e) => e.id == item.eval
                  );
                  return (
                    <div
                      key={indexEval}
                      className="rounded-md overflow-clip text-[14px]"
                      style={{
                        boxShadow: "0px 0px 4px 0px rgba(0, 0, 0, 0.30)",
                      }}
                    >
                      <div className="bg-bgTableHeader px-4 py-2 flex justify-between items-center font-medium text-secondary ">
                        <div>
                          <p>
                            {evaluation?.topicTH} | {evaluation?.topicEN}
                          </p>
                          <p>
                            Description:{" "}
                            {evaluation?.desc?.length ? evaluation.desc : "-"}
                          </p>
                        </div>
                        <Button
                          className="text-center px-3"
                          onClick={() =>
                            form.insertListItem(
                              `data.${indexClo}.assignments.${indexEval}.questions`,
                              ""
                            )
                          }
                        >
                          <Icon IconComponent={IconAdd} />
                        </Button>
                      </div>
                      {item.questions.map((ques, indexQues) => (
                        <div
                          key={form.key(
                            `data.${indexClo}.assignments.${indexEval}.questions.${indexQues}`
                          )}
                          className="flex px-4 py-4 justify-between items-center"
                        >
                          <div className="flex w-[95%] gap-2 items-center">
                            <p>{indexQues + 1}.</p>
                            <TextInput
                              withAsterisk={true}
                              size="xs"
                              placeholder="Question / Assignment No"
                              {...form.getInputProps(
                                `data.${indexClo}.assignments.${indexEval}.questions.${indexQues}`
                              )}
                              className="w-full"
                            />
                          </div>
                          <Button
                            className="text-center px-2 hover:bg-[#ff4747]/10"
                            variant="outline"
                            color="#ff4747"
                            onClick={() =>
                              form.removeListItem(
                                `data.${indexClo}.assignments.${indexEval}.questions`,
                                indexQues
                              )
                            }
                          >
                            <Icon
                              IconComponent={IconTrash}
                              className="stroke-[2px] size-5"
                            />
                          </Button>
                        </div>
                      ))}
                      <div></div>
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
        <div className="min-w-fit px-2 mt-3 flex flex-col">
          {tqf3.part2?.clo.map((item, index) => (
            <div
              key={index}
              className={`w-full ${activeSection === index ? "active" : ""}`}
            >
              <a href={`#${item.id}`}>
                <p
                  className={`mb-[7px] text-ellipsis font-semibold overflow-hidden whitespace-nowrap text-[13px] ${
                    activeSection === index
                      ? "text-secondary"
                      : "text-[#D2C9C9] "
                  }`}
                >
                  CLO {item.no}
                </p>
              </a>
            </div>
          ))}
        </div>
      </div>
    ) : !!assignmentMapping ? (
      <div className="flex px-16 sm:max-ipad11:px-8 flex-row items-center justify-between h-full">
        <div className="h-full  justify-center flex flex-col">
          <p className="text-secondary text-[21px] font-semibold">
            TQF 5 is coming soon to{" "}
            <span className="font-[600] text-transparent bg-clip-text bg-gradient-to-r from-[#4285f4] via-[#ec407a] via-[#a06ee1] to-[#fb8c00]">
              ScoreOBE +{" "}
            </span>{" "}
          </p>
          <br />
          <p className=" -mt-3 mb-6 text-b2 break-words font-medium leading-relaxed">
            Instructors, get ready to experience a new and improved way to
            complete TQF 5 <br /> starting February 2025.
          </p>
        </div>
        <img className=" z-50  w-[25vw] " src={maintenace} alt="loginImage" />
      </div>
    ) : (
      <div className="flex px-16  w-full ipad11:px-8 sm:px-2  gap-5  items-center justify-between h-full">
        <div className="flex justify-center  h-full items-start gap-2 flex-col">
          <p className="   text-secondary font-semibold text-[22px] sm:max-ipad11:text-[20px]">
            Complete Evaluation Mapping First
          </p>
          <p className=" text-[#333333] leading-6 font-medium text-[14px] sm:max-ipad11:text-[13px]">
            To start TQF5 Part 2, please complete evaluation mapping. <br />{" "}
            Once done, you can continue to do it.
          </p>
        </div>
        <img
          className=" z-50 ipad11:w-[380px] sm:w-[340px] w-[340px]  macair133:w-[580px] macair133:h-[300px] "
          src={unplug}
          alt="loginImage"
        />
      </div>
    )
  ) : (
    <div className="flex px-16  w-full ipad11:px-8 sm:px-2  gap-5  items-center justify-between h-full">
      <div className="flex justify-center  h-full items-start gap-2 flex-col">
        <p className="   text-secondary font-semibold text-[22px] sm:max-ipad11:text-[20px]">
          Complete TQF5 Part 1 First
        </p>
        <p className=" text-[#333333] leading-6 font-medium text-[14px] sm:max-ipad11:text-[13px]">
          To start TQF5 Part 2, please complete and save TQF5 Part 1. <br />{" "}
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
