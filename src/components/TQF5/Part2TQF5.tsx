import unplug from "@/assets/image/unplug.png";
import pictureTQF5 from "@/assets/image/TQF5.jpg";
import { IModelTQF3 } from "@/models/ModelTQF3";
import { useAppSelector, useAppDispatch } from "@/store";
import { Button, Checkbox, TextInput } from "@mantine/core";
import React from "react";
import { useEffect, useRef, useState } from "react";
import Icon from "../Icon";
import IconAdd from "@/assets/icons/plus.svg?react";
import IconOneToMany from "@/assets/icons/onetomany.svg?react";
import IconTrash from "@/assets/icons/trash.svg?react";
import { useForm } from "@mantine/form";
import { updatePartTQF5 } from "@/store/tqf5";
import { isEqual, cloneDeep } from "lodash";
import { IModelTQF5Part2 } from "@/models/ModelTQF5";
import { initialTqf5Part2 } from "@/helpers/functions/tqf5";
import { METHOD_TQF5 } from "@/helpers/constants/enum";
import ModalMappingAssignment from "../Modal/TQF5/ModalMappingAssignment";
import { IModelAssignment } from "@/models/ModelCourse";

type Props = {
  setForm: React.Dispatch<React.SetStateAction<any>>;
  tqf3: IModelTQF3;
  assignments: IModelAssignment[];
};

export default function Part2TQF5({ setForm, tqf3, assignments }: Props) {
  const tqf5 = useAppSelector((state) => state.tqf5);
  const dispatch = useAppDispatch();
  const sectionRefs = useRef(
    tqf3.part2?.clo.map(() => React.createRef<HTMLDivElement>())
  );
  const [activeSection, setActiveSection] = useState<number>(0);
  const [openModalAssignmentMapping, setOpenModalAssignmentMapping] =
    useState(false);

  const form = useForm({
    mode: "controlled",
    initialValues: { data: [] as IModelTQF5Part2[] },
    validate: {
      data: {
        assignments: {
          questions: (value) =>
            !value.length && "Please input at least one question.",
        },
      },
    },
    validateInputOnBlur: true,
    onValuesChange(values, previous) {
      if (!isEqual(values, previous)) {
        dispatch(
          updatePartTQF5({ part: "part2", data: cloneDeep(form.getValues()) })
        );
        setForm(form);
      }
    },
  });

  useEffect(() => {
    form.reset();
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

  return (
    <>
      <ModalMappingAssignment
        opened={openModalAssignmentMapping}
        onClose={() => setOpenModalAssignmentMapping(false)}
        tqf3={tqf3}
        assignments={assignments}
      />
      {tqf5.part1?.updatedAt ? (
        !!tqf5.assignmentsMap?.length || tqf5.method == METHOD_TQF5.MANUAL ? (
          <div className="flex w-full text-[15px] max-h-full gap-4 text-default">
            <div className="gap-4 flex flex-col w-full -mt-3 overflow-y-auto  max-h-full px-1">
              {form.getValues().data.map((cloItem, indexClo) => {
                const clo = tqf3.part2?.clo.find((e) => e.id == cloItem.clo);
                return (
                  <div
                    className={` flex flex-col border-b-[2px] last:border-none  gap-5  pb-6 first:pt-3 ${
                      activeSection === indexClo ? "active" : ""
                    }`}
                    id={`${clo?.id}`}
                    key={indexClo}
                    ref={sectionRefs.current!.at(indexClo)}
                  >
                    <div className="flex justify-between">
                      <div className="text-default flex items-center  font-medium text-[14px]">
                        <p className="text-[16px] text-secondary mr-2 font-semibold">
                          CLO {clo?.no}{" "}
                        </p>
                        <div className="flex flex-col ml-2 gap-[2px]">
                          <p>{clo?.descTH}</p>
                          <p>{clo?.descEN}</p>
                        </div>
                      </div>
                    </div>
                    {cloItem.assignments.map((item, indexEval) => {
                      const evaluation = tqf3.part3?.eval.find(
                        (e) => e.id == item.eval
                      );
                      const assignment = tqf5.assignmentsMap?.find(
                        (e) => e.eval == evaluation?.topicEN
                      )?.assignment;
                      return (
                        <div
                          key={indexEval}
                          className="rounded-md overflow-clip  text-[14px] mx-2 border"
                        >
                          <div className="px-6 flex justify-between items-center font-medium text-secondary ">
                            {tqf5.method == METHOD_TQF5.MANUAL && (
                              <div className=" py-3 w-full flex justify-between items-center font-medium text-secondary ">
                                <div className="flex flex-col">
                                  <p>
                                    {evaluation?.topicTH} |{" "}
                                    {evaluation?.topicEN}
                                  </p>
                                  <p>
                                    Description:{" "}
                                    {evaluation?.desc?.length
                                      ? evaluation.desc
                                      : "-"}
                                  </p>
                                </div>
                                <Button
                                  className="min-w-fit text-center px-3"
                                  onClick={() => {
                                    form.insertListItem(
                                      `data.${indexClo}.assignments.${indexEval}.questions`,
                                      ""
                                    );
                                    form.validateField(
                                      `data.${indexClo}.assignments.${indexEval}.questions`
                                    );
                                  }}
                                >
                                  <Icon IconComponent={IconAdd} />
                                </Button>
                              </div>
                            )}
                          </div>
                          {tqf5.method == METHOD_TQF5.MANUAL ? (
                            <>
                              {item.questions.map((ques, indexQues) => (
                                <div
                                  key={form.key(
                                    `data.${indexClo}.assignments.${indexEval}.questions.${indexQues}`
                                  )}
                                  className="flex px-6 pt-2 pb-4 justify-between gap-5 items-center"
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
                                      onBlur={() => {
                                        if (!ques.length) {
                                          form.setFieldError(
                                            `data.${indexClo}.assignments.${indexEval}.questions.${indexQues}`,
                                            "Please input question."
                                          );
                                        } else {
                                          form.clearFieldError(
                                            `data.${indexClo}.assignments.${indexEval}.questions.${indexQues}`
                                          );
                                        }
                                      }}
                                      className="w-full"
                                    />
                                  </div>
                                  <Button
                                    className="min-w-fit text-center px-2 hover:bg-[#ff4747]/10"
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
                                      className="stroke-[1.5px] size-5"
                                    />
                                  </Button>
                                </div>
                              ))}
                              <p className="error-text mx-6 mb-2">
                                {
                                  form.getInputProps(
                                    `data.${indexClo}.assignments.${indexEval}.questions`
                                  ).error
                                }
                              </p>
                            </>
                          ) : (
                            <div>
                              <div className="bg-bgTableHeader font-semibold text-secondary px-4 py-3">
                                <div className="flex flex-col gap-[2px]">
                                  <p className="text-[15px]">
                                    {evaluation?.topicTH} |{" "}
                                    {evaluation?.topicEN}
                                  </p>
                                  <p>
                                    Description:
                                    {evaluation?.desc?.length
                                      ? evaluation.desc
                                      : "-"}
                                  </p>
                                </div>
                              </div>
                              <Checkbox.Group
                                {...form.getInputProps(
                                  `data.${indexClo}.assignments.${indexEval}.questions`
                                )}
                                classNames={{ error: "px-4 pb-2" }}
                              >
                                {assignment?.map((assign, indexAssign) => {
                                  const questions = assignments.find(
                                    (e) => e.name == assign
                                  )?.questions;
                                  return (
                                    <div
                                      key={indexAssign}
                                      className="flex flex-col gap-2 mb-2"
                                    >
                                      <div className="bg-[#F3F3F3] text-default font-semibold px-4 py-3">
                                        <p>{assign}</p>
                                      </div>
                                      {questions?.map((ques, indexQues) => (
                                        <Checkbox
                                          key={`${ques.name}-${indexQues}`}
                                          size="xs"
                                          className="px-4 py-1"
                                          classNames={{
                                            label:
                                              "font-medium text-[13px] text-default",
                                          }}
                                          label={`${ques.name}${
                                            ques.desc?.length
                                              ? ` - ${ques.desc}`
                                              : ""
                                          }`}
                                          value={`${assign}-${ques.name}`}
                                        />
                                      ))}
                                    </div>
                                  );
                                })}
                              </Checkbox.Group>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>
            <div className="min-w-[70px] px-2 mt-[26px] flex flex-col">
              {tqf3.part2?.clo.map((item, index) => (
                <div
                  key={index}
                  className={`w-full ${
                    activeSection === index ? "active" : ""
                  }`}
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
        ) : (
          <div className="flex px-16  w-full ipad11:px-8 sm:px-2  gap-5  items-center justify-between h-full">
            <div className="flex justify-center  h-full items-start gap-2 flex-col">
              <p className="   text-secondary font-semibold text-[22px] sm:max-ipad11:text-[20px]">
                Setup Evaluation Mapping
              </p>
              <p className=" text-[#333333] leading-6 font-medium text-[14px] sm:max-ipad11:text-[13px]">
                Map the Evaluation Items to the Scores you import in this
                course <br /> to ensure accurate assessment and analysis.
              </p>
              {tqf5.method == METHOD_TQF5.SCORE_OBE && (
                <Button
                  className="mt-3"
                  onClick={() => setOpenModalAssignmentMapping(true)}
                >
                  <Icon className="mr-2" IconComponent={IconOneToMany} />
                  Evaluation Mapping
                </Button>
              )}
            </div>
            <img
              className=" z-50  w-[38vw] "
              src={pictureTQF5}
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
      )}
    </>
  );
}
