import maintenace from "@/assets/image/maintenance.png";
import unplug from "@/assets/image/unplug.png";
import { IModelTQF3 } from "@/models/ModelTQF3";
import { useAppSelector, useAppDispatch } from "@/store";
import {
  Alert,
  Button,
  Group,
  Modal,
  MultiSelect,
  TextInput,
} from "@mantine/core";
import React from "react";
import { useEffect, useRef, useState } from "react";
import Icon from "../Icon";
import IconInfo2 from "@/assets/icons/Info2.svg?react";
import IconAdd from "@/assets/icons/plus.svg?react";
import IconTrash from "@/assets/icons/trash.svg?react";
import { useForm } from "@mantine/form";
import { updatePartTQF5 } from "@/store/tqf5";
import { isEqual, cloneDeep } from "lodash";
import { IModelTQF5Part2 } from "@/models/ModelTQF5";
import { initialTqf5Part2 } from "@/helpers/functions/tqf5";
import { METHOD_TQF5 } from "@/helpers/constants/enum";
import { IModelAssignment } from "@/models/ModelCourse";

type Props = {
  setForm: React.Dispatch<React.SetStateAction<any>>;
  tqf3: IModelTQF3;
  assignments: IModelAssignment;
};

export default function Part2TQF5({ setForm, tqf3, assignments }: Props) {
  const loading = useAppSelector((state) => state.loading.loadingOverlay);
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

  const mapAssignForm = useForm({
    mode: "controlled",
    initialValues: { data: [] as { eval: string; assignment: string }[] },
    validateInputOnBlur: true,
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

  return (
    <>
      <Modal
        opened={openModalAssignmentMapping}
        onClose={() => setOpenModalAssignmentMapping(false)}
        closeOnClickOutside={false}
        centered
        size="45vw"
        title="Evaluation Mapping"
        transitionProps={{ transition: "pop" }}
      >
        <div>
          <Alert
            radius="md"
            icon={<Icon IconComponent={IconInfo2} />}
            variant="light"
            color="blue"
            className="mb-5"
            classNames={{
              icon: "size-6",
              body: " flex justify-center",
            }}
            title={
              <p>
                Course Evaluation Topics can be mapped to multiple assignment.
              </p>
            }
          ></Alert>
          <div className=" text-[15px] rounded-lg w-full h-fit px-8 mb-2 flex justify-between font-semibold text-secondary">
            <p>From: Course Evaluation</p>
            <p className="w-[350px]">To: Assignment</p>
          </div>
          {tqf3?.part3?.eval.map((eva, index) => (
            <div
              key={eva.id}
              className="bg-[#F3F3F3] rounded-lg w-full h-fit px-8 py-4 mb-4 flex justify-between"
            >
              <div className="text-[13px]">
                <p>{eva.topicTH}</p>
                <p>{eva.topicEN}</p>
              </div>
              <MultiSelect
                className="w-[350px]"
                // placeholder="Choose Assignment"
                data={Array.isArray(assignments) ? assignments : []}
                classNames={{ pill: "bg-secondary text-white font-medium" }}
                // searchable
                // nothingFoundMessage="Nothing found..."
              />
            </div>
          ))}

          <div className="flex gap-2 sm:max-macair133:fixed sm:max-macair133:bottom-6 sm:max-macair133:right-8 items-end  justify-end h-fit mt-4">
            <Group className="flex w-full gap-2 h-fit items-end justify-end">
              <Button
                onClick={() => setOpenModalAssignmentMapping(false)}
                variant="subtle"
              >
                Cancel
              </Button>
              <Button
                loading={loading}
                // onClick={}
              >
                Done
              </Button>
            </Group>
          </div>
        </div>
      </Modal>
      {tqf5.part1?.updatedAt ? (
        !!tqf5.assignmentsMap?.length || tqf5.method == METHOD_TQF5.MANUAL ? (
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
                                {evaluation?.desc?.length
                                  ? evaluation.desc
                                  : "-"}
                              </p>
                            </div>
                            {tqf5.method == METHOD_TQF5.MANUAL && (
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
                            )}
                          </div>
                          {tqf5.method == METHOD_TQF5.MANUAL &&
                            item.questions.map((ques, indexQues) => (
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
                Complete Evaluation Mapping First
              </p>
              <p className=" text-[#333333] leading-6 font-medium text-[14px] sm:max-ipad11:text-[13px]">
                To start TQF5 Part 2, please complete evaluation mapping. <br />{" "}
                Once done, you can continue to do it.
              </p>
              <Button onClick={() => setOpenModalAssignmentMapping(true)}>
                Evaluation Mapping
              </Button>
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
      )}
    </>
  );
}
