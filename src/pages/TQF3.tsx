import { useAppDispatch, useAppSelector } from "@/store";
import { useEffect, useState } from "react";
import {
  Alert,
  Button,
  FocusTrap,
  Modal,
  Select,
  Tabs,
  Tooltip,
} from "@mantine/core";
import dupTQF from "@/assets/icons/dupTQF.svg?react";
import Icon from "@/components/Icon";
import { useLocation, useParams } from "react-router-dom";
import CheckIcon from "@/assets/icons/Check.svg?react";
import Part1TQF3 from "@/components/TQF3/Part1TQF3";
import Part2TQF3 from "@/components/TQF3/Part2TQF3";
import Part3TQF3 from "@/components/TQF3/Part3TQF3";
import Part4TQF3 from "@/components/TQF3/Part4TQF3";
import Part5TQF3 from "@/components/TQF3/Part5TQF3";
import Part6TQF3 from "@/components/TQF3/Part6TQF3";
import { IconInfoCircle } from "@tabler/icons-react";
import SaveTQFbar, { partLabel, partType } from "@/components/SaveTQFBar";
import { IModelCourse } from "@/models/ModelCourse";
import { isEmpty, isEqual } from "lodash";
import { getOneCourse } from "@/services/course/course.service";
import { saveTQF3 } from "@/services/tqf3/tqf3.service";
import { showNotifications } from "@/helpers/functions/function";
import { COURSE_TYPE, NOTI_TYPE } from "@/helpers/constants/enum";
import { UseFormReturnType } from "@mantine/form";
import { ROUTE_PATH } from "@/helpers/constants/route";
import { editCourse } from "@/store/course";
import Loading from "@/components/Loading";

export default function TQF3() {
  const location = useLocation().pathname;
  const { courseNo } = useParams();
  const loading = useAppSelector((state) => state.loading);
  const academicYear = useAppSelector((state) => state.academicYear[0]);
  const [course, setCourse] = useState<Partial<IModelCourse>>({});
  const dispatch = useAppDispatch();
  const [form, setForm] = useState<UseFormReturnType<any>>();
  const [tqf3Part, setTqf3Part] = useState<string | null>(partLabel.part1);
  const [openModalReuse, setOpenModalReuse] = useState(false);
  const partTab = [
    {
      value: partLabel.part1,
      tab: "Part 1",
      compo: <Part1TQF3 data={course!} setForm={setForm} />,
    },
    {
      value: partLabel.part2,
      tab: "Part 2",
      compo: <Part2TQF3 data={course!} setForm={setForm} />,
    },
    {
      value: partLabel.part3,
      tab: "Part 3",
      compo: <Part3TQF3 data={course!} setForm={setForm} />,
    },
    {
      value: partLabel.part4,
      tab: "Part 4",
      compo: <Part4TQF3 data={course!} setForm={setForm} />,
    },
    {
      value: partLabel.part5,
      tab: "Part 5",
      compo: <Part5TQF3 data={course!} setForm={setForm} />,
    },
    {
      value: partLabel.part6,
      tab: "Part 6",
      compo: <Part6TQF3 data={course!} setForm={setForm} />,
    },
  ];

  useEffect(() => {
    if (course) {
      console.log(course);
    }
  }, [course]);

  useEffect(() => {
    const fetchOneCourse = async () => {
      const res = await getOneCourse({
        academicYear: academicYear.id,
        courseNo,
      });
      if (res) {
        setCourse(res);
      }
    };
    if (academicYear && location.includes(ROUTE_PATH.TQF3)) fetchOneCourse();
  }, [academicYear, location]);

  const topicPart = () => {
    switch (tqf3Part) {
      case partLabel.part1:
        return "Part 1 - ข้อมูลกระบวนวิชา\nCourse Information";
      case partLabel.part2:
        return "Part 2 - คำอธิบายลักษณะกระบวนวิชาและแผนการสอน\nDescription and Planning";
      case partLabel.part3:
        return "Part 3 -  การประเมินผลคะแนนกระบวนวิชา\nCourse Evaluation";
      case partLabel.part4:
        return "Part 4 - การเชื่อมโยงหัวข้อประเมิน\nAssessment Mapping";
      case partLabel.part5:
        return "Part 5 - การเชื่อมโยงหัวข้อประเมินวัตถุประสงค์การเรียนรู้\nCurriculum Mapping";
      case partLabel.part6:
        return "Part 6 - การประเมินกระบวนวิชาและกระบวนการปรับปรุง\nCourse evaluation and improvement processes";
      default:
        return;
    }
  };

  const onSave = async () => {
    if (form) {
      const validationResult = form.validate();
      if (Object.keys(validationResult.errors).length > 0) {
        const firstErrorPath = Object.keys(validationResult.errors)[0];
        form
          .getInputNode(firstErrorPath)
          ?.scrollIntoView({ behavior: "smooth" });
      } else {
        const part = tqf3Part?.replace(" ", "").toLowerCase()!;
        const payload = form.getValues();
        if (course.type == COURSE_TYPE.SEL_TOPIC.en) {
          payload.id = course.sections![0].TQF3?.id; // select first topic
        } else {
          payload.id = course.TQF3?.id;
        }
        payload.instructors = payload.instructors.filter((ins: any) => ins);
        const res = await saveTQF3(part, payload);
        if (res) {
          form.reset();
          form.setValues(res);
          setCourse({ ...course, TQF3: res });
          dispatch(editCourse({ ...course, TQF3: { ...course.TQF3, ...res } }));
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
        size="35vw"
        centered
        classNames={{
          content: "flex flex-col overflow-hidden pb-2  max-h-full h-fit",
          body: "flex flex-col overflow-hidden max-h-full h-fit",
        }}
      >
        <FocusTrap.InitialFocus />
        <div className="flex flex-col gap-3 ">
          <Alert
            variant="light"
            color="blue"
            title={` lorem ipsum `}
            icon={<IconInfoCircle />}
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
            <Button
              onClick={() => setOpenModalReuse(false)}
              variant="subtle"
              color="#575757"
              className="rounded-[8px] text-[12px] h-[32px] w-fit "
            >
              Cancel
            </Button>
            <Button className="rounded-[8px] text-[12px] h-[32px] w-fit ">
              Reuse TQF3
            </Button>
          </div>
        </div>
      </Modal>
      <div className=" flex flex-col h-full  w-full overflow-hidden">
        <Tabs
          value={tqf3Part}
          onChange={setTqf3Part}
          defaultValue={partLabel.part1}
          classNames={{
            root: "overflow-hidden w-full flex flex-col h-full",
            tab: "px-0 !bg-transparent hover:!text-tertiary",
            tabLabel: "!font-semibold",
          }}
          className="px-6 pt-2 flex flex-col h-full w-full"
        >
          <div
            className={`flex flex-col w-full h-fit ${
              tqf3Part === partLabel.part4 ? "pb-1" : "border-b-[2px] pb-4 mb-1"
            } 
            ${tqf3Part === partLabel.part6 && "!mb-4"}
            `}
          >
            <div className="flex gap-2">
              <Tabs.List className="gap-7 w-full">
                {partTab.map((part) => (
                  <Tabs.Tab key={part.value} value={part.value}>
                    <div className="flex flex-row items-center gap-2 ">
                      <Icon
                        IconComponent={CheckIcon}
                        className={
                          !course.TQF3 ||
                          (course?.TQF3 &&
                            isEmpty(
                              course?.TQF3[
                                part.tab.replace(" ", "").toLowerCase()
                              ]
                            ))
                            ? "text-[#DEE2E6]"
                            : "text-save"
                        }
                      />
                      {part.tab}
                    </div>
                  </Tabs.Tab>
                ))}
              </Tabs.List>
            </div>
            <div className="flex justify-between pt-4 items-center">
              <div className=" text-secondary  overflow-y-auto font-semibold  whitespace-break-spaces">
                {topicPart()}
              </div>
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
                      </span>{" "}
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
                  leftSection={
                    <Icon IconComponent={dupTQF} className="h-5 w-5 -mr-1" />
                  }
                  color="#F39D4E"
                  className="  cursor-pointer pr-4 text-[12px] font-semibold w-fit px-3 h-[32px] rounded-[8px]"
                >
                  Reuse TQF3
                </Button>
              </Tooltip>
            </div>
          </div>
          <div
            className={`h-full w-full flex overflow-y-auto ${
              tqf3Part !== partLabel.part4 && "pt-3 px-3"
            }  ${
              tqf3Part === partLabel.part6 && "!pt-0"
            } rounded-md text-[14px]`}
          >
            {partTab.map((part, index) => (
              <Tabs.Panel key={index} value={part.tab} className="w-full">
                {part.compo}
              </Tabs.Panel>
            ))}
          </div>
        </Tabs>
      </div>
      <SaveTQFbar
        tqf="3"
        part={tqf3Part as partType}
        data={course.TQF3!}
        onSave={onSave}
        canSave={true}
      />
    </>
  );
}
