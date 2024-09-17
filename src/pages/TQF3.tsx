import { useAppDispatch, useAppSelector } from "@/store";
import { useEffect, useState } from "react";
import {
  Alert,
  Button,
  FocusTrapInitialFocus,
  Modal,
  Select,
  Tabs,
  Tooltip,
} from "@mantine/core";
import dupTQF from "@/assets/icons/dupTQF.svg?react";
import Icon from "@/components/Icon";
import { useParams } from "react-router-dom";
import CheckIcon from "@/assets/icons/Check.svg?react";
import Part1TQF3 from "@/components/TQF3/Part1TQF3";
import Part2TQF3 from "@/components/TQF3/Part2TQF3";
import Part3TQF3 from "@/components/TQF3/Part3TQF3";
import Part4TQF3 from "@/components/TQF3/Part4TQF3";
import Part5TQF3 from "@/components/TQF3/Part5TQF3";
import Part6TQF3 from "@/components/TQF3/Part6TQF3";
import { IconExclamationCircle, IconInfoCircle } from "@tabler/icons-react";
import SaveTQFbar, { partLabel, partType } from "@/components/SaveTQFBar";
import { isEmpty, isEqual } from "lodash";
import { getOneCourse } from "@/services/course/course.service";
import { saveTQF3 } from "@/services/tqf3/tqf3.service";
import { getKeyByValue, showNotifications } from "@/helpers/functions/function";
import { COURSE_TYPE, NOTI_TYPE } from "@/helpers/constants/enum";
import { UseFormReturnType } from "@mantine/form";
import { editCourse } from "@/store/course";
import exportFile from "@/assets/icons/exportFile.svg?react";
import Loading from "@/components/Loading";
import { IModelCLO, IModelTQF3 } from "@/models/ModelTQF3";
import { setShowNavbar } from "@/store/showNavbar";
import { setShowSidebar } from "@/store/showSidebar";
import Part7TQF3 from "@/components/TQF3/Part7TQF3";
import { LearningMethod } from "@/components/Modal/TQF3/ModalManageCLO";

export default function TQF3() {
  const { courseNo } = useParams();
  const loading = useAppSelector((state) => state.loading);
  const academicYear = useAppSelector((state) => state.academicYear[0]);
  const course = useAppSelector((state) =>
    state.course.courses.find((c) => c.courseNo == courseNo)
  );
  // const [course, setCourse] = useState<IModelCourse>();
  const [tqf3Original, setTqf3Original] = useState<IModelTQF3>();
  const [tqf3, setTqf3] = useState<Partial<IModelTQF3>>();
  const dispatch = useAppDispatch();
  const [form, setForm] = useState<UseFormReturnType<any>>();
  const [tqf3Part, setTqf3Part] = useState<string | null>(
    Object.keys(partLabel)[0]
  );
  const [openModalReuse, setOpenModalReuse] = useState(false);
  const partTab = [
    {
      value: Object.keys(partLabel)[0],
      tab: partLabel.part1,
      compo: <Part1TQF3 data={course!} setForm={setForm} />,
    },
    {
      value: Object.keys(partLabel)[1],
      tab: partLabel.part2,
      compo: <Part2TQF3 data={course!} setForm={setForm} />,
    },
    {
      value: Object.keys(partLabel)[2],
      tab: partLabel.part3,
      compo: <Part3TQF3 data={course!} setForm={setForm} />,
    },
    {
      value: Object.keys(partLabel)[3],
      tab: partLabel.part4,
      compo: <Part4TQF3 data={course!} setForm={setForm} />,
    },
    {
      value: Object.keys(partLabel)[4],
      tab: partLabel.part5,
      compo: <Part5TQF3 data={course!} setForm={setForm} />,
    },
    {
      value: Object.keys(partLabel)[5],
      tab: partLabel.part6,
      compo: <Part6TQF3 data={course!} setForm={setForm} />,
    },
    {
      value: Object.keys(partLabel)[6],
      tab: partLabel.part7,
      compo: <Part7TQF3 data={course!} setForm={setForm} />,
    },
  ];

  useEffect(() => {
    dispatch(setShowSidebar(true));
    dispatch(setShowNavbar(true));
  }, []);

  useEffect(() => {
    if (academicYear) fetchOneCourse(true);
  }, [academicYear]);

  useEffect(() => {
    if (tqf3 && form && !isEqual(form, tqf3[tqf3Part as keyof IModelTQF3])) {
      updateTQF3();
    }
  }, [form]);

  const fetchOneCourse = async (firstFetch: boolean = false) => {
    const res = await getOneCourse({
      academicYear: academicYear.id,
      courseNo,
    });
    if (res) {
      if (res.type == COURSE_TYPE.SEL_TOPIC.en) {
        setTqf3Original(res.sections[0].TQF3!);
        setTqf3(res.sections[0].TQF3!);
        if (firstFetch) {
          setCurrentPartTQF3(res.sections[0].TQF3!);
        }
        if (!course?.sections[0].TQF3?.updatedAt) {
          dispatch(editCourse(res));
        }
      } else {
        setTqf3Original(res.TQF3!);
        setTqf3(res.TQF3!);
        if (firstFetch) {
          setCurrentPartTQF3(res.TQF3!);
        }
        if (!course?.TQF3?.updatedAt) {
          dispatch(editCourse(res));
        }
      }
    }
  };

  const updateTQF3 = () => {
    const part = tqf3Part as keyof Pick<
      IModelTQF3,
      "part1" | "part2" | "part3" | "part4" | "part5" | "part6" | "part7"
    >;
    if (
      course &&
      tqf3 &&
      part &&
      tqf3Original &&
      (part == "part1" || tqf3Original[part])
    ) {
      let newTqf3;
      if (course.type == COURSE_TYPE.SEL_TOPIC.en) {
        dispatch(
          editCourse({
            id: course.id,
            sections: course.sections.map((sec) => {
              if (sec.TQF3?.id == tqf3.id) {
                newTqf3 = {
                  ...sec.TQF3!,
                  [part]: {
                    ...sec.TQF3![part],
                    ...form?.getValues(),
                  },
                };
                sec.TQF3 = { ...newTqf3 };
              }
              return sec;
            }),
          })
        );
      } else {
        newTqf3 = {
          ...course.TQF3,
          [part]: { ...course.TQF3![part], ...form?.getValues() },
        };
        dispatch(
          editCourse({
            id: course.id,
            TQF3: { ...newTqf3 },
          })
        );
      }
      setTqf3(newTqf3);
    }
  };

  const setCurrentPartTQF3 = (tqf3: IModelTQF3) => {
    if (!tqf3.part1) {
      setTqf3Part("part1");
    } else if (!tqf3.part2) {
      setTqf3Part("part2");
    } else if (!tqf3.part3) {
      setTqf3Part("part3");
    } else if (!tqf3.part4) {
      setTqf3Part("part4");
    } else if (!tqf3.part5) {
      setTqf3Part("part5");
    } else {
      setTqf3Part("part6");
    }
  };

  const topicPart = () => {
    switch (tqf3Part) {
      case Object.keys(partLabel)[0]:
        return "Part 1 - ข้อมูลกระบวนวิชา\nCourse Information";
      case Object.keys(partLabel)[1]:
        return "Part 2 - คำอธิบายลักษณะกระบวนวิชาและแผนการสอน\nDescription and Planning";
      case Object.keys(partLabel)[2]:
        return "Part 3 - การประเมินผลคะแนนกระบวนวิชา\nCourse Evaluation";
      case Object.keys(partLabel)[3]:
        return "Part 4 - การเชื่อมโยงหัวข้อประเมิน\nAssessment Mapping";
      case Object.keys(partLabel)[4]:
        return "Part 5 - ทรัพยากรประกอบการเรียนการสอน\nCourse Materials";
      case Object.keys(partLabel)[5]:
        return "Part 6 - การประเมินกระบวนวิชาและกระบวนการปรับปรุง\nCourse evaluation and improvement processes";
      case Object.keys(partLabel)[6]:
        return "Part 7 - การเชื่อมโยงหัวข้อประเมินวัตถุประสงค์การเรียนรู้\nCurriculum Mapping";
      default:
        return;
    }
  };

  const onSave = async () => {
    if (form && course) {
      const validationResult = form.validate();
      if (Object.keys(validationResult.errors).length > 0) {
        const firstErrorPath = Object.keys(validationResult.errors)[0];
        form
          .getInputNode(firstErrorPath)
          ?.scrollIntoView({ behavior: "smooth" });
      } else {
        const payload = form.getValues();
        if (course.type == COURSE_TYPE.SEL_TOPIC.en) {
          payload.id = course.sections![0].TQF3?.id; // select first topic
        } else {
          payload.id = course.TQF3?.id;
        }
        switch (tqf3Part) {
          case Object.keys(partLabel)[0]:
            payload.instructors = payload.instructors.filter((ins: any) => ins);
          case Object.keys(partLabel)[1]:
            payload.clo?.forEach((clo: IModelCLO) => {
              if (!clo.learningMethod.includes(LearningMethod.Other)) {
                delete clo.other;
              }
            });
          case Object.keys(partLabel)[2]:
          case Object.keys(partLabel)[3]:
          case Object.keys(partLabel)[4]:
          case Object.keys(partLabel)[5]:
        }
        const res = await saveTQF3(tqf3Part!, payload);
        if (res) {
          setTqf3Original({ ...tqf3Original, ...res });
          form.setValues(res[tqf3Part!]);
          updateTQF3();
          showNotifications(
            NOTI_TYPE.SUCCESS,
            `TQF 3, ${tqf3Part} save success`,
            `TQF 3 - ${tqf3Part} is saved`
          );
        }
      }
    }
  };

  return loading ? (
    <Loading />
  ) : (
    <>
      {/* Reuse TQF3 */}
      <Modal
        title="Reuse TQF3"
        opened={openModalReuse}
        closeOnClickOutside={false}
        onClose={() => setOpenModalReuse(false)}
        transitionProps={{ transition: "pop" }}
        size="34vw"
        centered
        classNames={{
          content: "flex flex-col overflow-hidden pb-2  max-h-full h-fit",
          body: "flex flex-col overflow-hidden max-h-full h-fit",
        }}
      >
        <FocusTrapInitialFocus />
        <div className="flex flex-col gap-3 ">
          <Alert
            variant="light"
            color="blue"
            title={`Reusing TQF will import all 6 parts of TQF3 data from your selected course to automatically fill in the TQF3 for this course.`}
            icon={<IconInfoCircle />}
            classNames={{ icon: "size-6" }}
          ></Alert>
          <Alert
            variant="light"
            color="red"
            title={`After reuse TQF 3, you should have to recheck data from course that you select again.`}
            icon={<IconExclamationCircle />}
            classNames={{ icon: "size-6" }}
          ></Alert>
          <Select
            rightSectionPointerEvents="all"
            placeholder="course"
            searchable
            allowDeselect
            size="xs"
            label="Select course to reuse"
            className="w-full border-none "
            classNames={{
              input: `rounded-md`,
              option: `py-1  `,
            }}
          ></Select>
          <div className="flex gap-2 mt-3 justify-end">
            <Button variant="subtle" onClick={() => setOpenModalReuse(false)}>
              Cancel
            </Button>
            <Button>Reuse TQF3</Button>
          </div>
        </div>
      </Modal>
      <div className="flex flex-col h-full  w-full overflow-hidden">
        <Tabs
          value={tqf3Part}
          onChange={setTqf3Part}
          defaultValue={"part1"}
          classNames={{
            root: "overflow-hidden w-full flex flex-col h-full",
            tab: "px-0 !bg-transparent hover:!text-tertiary",
            tabLabel: "!font-semibold",
          }}
          className="px-6 pt-2 flex flex-col h-full w-full"
        >
          <div
            className={`flex flex-col w-full h-fit ${
              tqf3Part === "part4" ? "pb-1" : "border-b-[2px] pb-4 mb-1"
            } 
            ${tqf3Part === "part6" && "!mb-4"}
            `}
          >
            <Tabs.List className="md:gap-x-7 gap-x-4 w-full">
              {partTab.map(({ tab, value }) => (
                <Tabs.Tab key={value} value={value}>
                  <div className="flex flex-row items-center gap-2">
                    <Icon
                      IconComponent={CheckIcon}
                      className={
                        !tqf3Original ||
                        !tqf3 ||
                        isEmpty(tqf3Original[value as keyof IModelTQF3])
                          ? "text-[#DEE2E6]"
                          : !isEqual(
                              tqf3Original[value as keyof IModelTQF3],
                              tqf3[value as keyof IModelTQF3]
                            )
                          ? "text-edit"
                          : "text-[#24b9a5]"
                      }
                    />
                    {tab}
                  </div>
                </Tabs.Tab>
              ))}
            </Tabs.List>
            <div className="flex justify-between pt-4 items-center">
              <div className=" text-secondary  overflow-y-auto font-semibold  whitespace-break-spaces">
                {topicPart()}
              </div>
              <div className="flex flex-row flex-wrap gap-3">
                <Tooltip
                  onClick={() => setOpenModalReuse(true)}
                  withArrow
                  arrowPosition="side"
                  arrowOffset={15}
                  arrowSize={7}
                  position="bottom-end"
                  label={
                    <div className="text-default text-[13px] p-2 flex flex-col gap-2">
                      <p className=" font-medium">
                        <span className="text-secondary font-bold">
                          Reuse TQF 3
                        </span>
                        <br />
                        Simplify your course TQF3. Choose any course, and we'll
                        automatically fill <br />
                        the TQF documentation for you. Saving your time!
                      </p>
                    </div>
                  }
                  color="#FCFCFC"
                >
                  <Button
                    variant="outline"
                    leftSection={
                      <Icon IconComponent={dupTQF} className="size-5 -mr-1" />
                    }
                    color="#ee933e"
                    className="pr-4 px-3"
                  >
                    Reuse TQF3
                  </Button>
                </Tooltip>
                <Button color="#24b9a5" className="px-4">
                  <div className="flex gap-2 items-center">
                    <Icon IconComponent={exportFile} />
                    Export TQF3
                  </div>
                </Button>
              </div>
            </div>
          </div>
          <div
            className={`h-full w-full flex overflow-y-auto ${
              tqf3Part !== "part4" && "pt-3 px-3"
            }  ${tqf3Part === "part6" && "!pt-0"} rounded-md text-[14px]`}
          >
            {partTab.map((part, index) => (
              <Tabs.Panel key={index} value={part.value} className="w-full">
                {tqf3Part === part.value && course && part.compo}
              </Tabs.Panel>
            ))}
          </div>
        </Tabs>
      </div>
      {tqf3Original &&
        tqf3 &&
        (tqf3Part == "part1" ||
          tqf3Original[
            Object.keys(partLabel)[
              Object.keys(partLabel).findIndex((e) => e == tqf3Part) - 1
            ] as keyof IModelTQF3
          ]) && (
          <SaveTQFbar
            tqf="3"
            part={tqf3Part as partType}
            data={tqf3Original[tqf3Part as keyof IModelTQF3]}
            onSave={onSave}
            disabledSave={isEqual(
              tqf3Original[tqf3Part as keyof IModelTQF3],
              tqf3[tqf3Part as keyof IModelTQF3]
            )}
          />
        )}
    </>
  );
}
