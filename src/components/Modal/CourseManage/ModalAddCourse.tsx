import { useEffect, useState } from "react";
import {
  Stepper,
  Button,
  Group,
  Modal,
  TextInput,
  Checkbox,
  TagsInput,
  List,
  Menu,
  Chip,
  Alert,
  Select,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import IconChevronRight from "@/assets/icons/chevronRight.svg?react";
import IconCircleFilled from "@/assets/icons/circleFilled.svg?react";
import IconInfo2 from "@/assets/icons/Info2.svg?react";
import IconArrowRight from "@/assets/icons/arrowRight.svg?react";
import IconUsers from "@/assets/icons/users.svg?react";
import { COURSE_TYPE, NOTI_TYPE } from "@/helpers/constants/enum";
import { IModelCourse } from "@/models/ModelCourse";
import { SEMESTER } from "@/helpers/constants/enum";
import { useAppDispatch, useAppSelector } from "@/store";
import {
  validateTextInput,
  validateCourseNo,
  validateSectionNo,
} from "@/helpers/functions/validation";
import {
  checkCanCreateCourse,
  createCourse,
  getExistsCourseName,
} from "@/services/course/course.service";
import {
  getSectionNo,
  getUserName,
  sortData,
} from "@/helpers/functions/function";
import { showNotifications } from "@/helpers/notifications/showNotifications";
import CompoManageIns from "@/components/CompoManageIns";
import { IModelSection } from "@/models/ModelCourse";
import Icon from "@/components/Icon";
import { setLoadingOverlay } from "@/store/loading";

type Props = {
  opened: boolean;
  onClose: () => void;
  fetchCourse: (year: number, semester: number) => void;
};
export default function ModalAddCourse({
  opened,
  onClose,
  fetchCourse,
}: Props) {
  const user = useAppSelector((state) => state.user);
  const academicYear = useAppSelector((state) => state.academicYear[0]);
  const loading = useAppSelector((state) => state.loading.loadingOverlay);
  const dispatch = useAppDispatch();
  const [active, setActive] = useState(0);
  const [sectionNoList, setSectionNoList] = useState<string[]>([]);
  const [coInsList, setCoInsList] = useState<any[]>([]);
  const [firstInput, setFirstInput] = useState(true);

  const form = useForm({
    mode: "uncontrolled",
    initialValues: { sections: [{}] } as Partial<IModelCourse>,
    validate: {
      type: (value) => !value && "Course Type is required",
      courseNo: (value) => validateCourseNo(value),
      courseName: (value) => validateTextInput(value, "Course Name"),
      sections: {
        topic: (value) => validateTextInput(value, "Topic"),
        sectionNo: (value) => validateSectionNo(value),
        semester: (value) => {
          return value?.length ? null : "Please choose semester at least one.";
        },
      },
    },
    validateInputOnBlur: true,
    onValuesChange: (values, prev) => {
      if (prev.courseNo !== values.courseNo && values.courseNo?.length == 6) {
        getCourseName(values.courseNo!);
      }
    },
  });

  useEffect(() => {
    if (!opened) {
      closeModal();
    }
  }, [opened]);

  const nextStep = async (type?: string) => {
    dispatch(setLoadingOverlay(true));
    setFirstInput(false);
    let isValid = true;
    const length = form.getValues().sections?.length || 0;
    switch (active) {
      case 0:
        form.reset();
        form.setFieldValue("type", type);
        isValid = !form.validateField("type").hasError;
        setSectionNoList([]);
        setCoInsList([]);
        break;
      case 1:
        for (let i = 0; i < length; i++) {
          isValid = !form.validateField(`sections.${i}.sectionNo`).hasError;
          if (!isValid) break;
        }
        form.validateField("courseNo");
        form.validateField("courseName");
        form.validateField("sections.0.topic");
        isValid =
          isValid &&
          !form.validateField("courseNo").hasError &&
          !form.validateField("courseName").hasError &&
          (!form.validateField("sections.0.topic").hasError ||
            form.getValues().type !== COURSE_TYPE.SEL_TOPIC.en);
        if (isValid) {
          const res = await checkCanCreateCourse({
            courseNo: form.getValues().courseNo,
            sections: sectionNoList?.map((sec) => parseInt(sec)),
          });
          if (!res) isValid = false;
        }
        break;
      case 2:
        const secNoList: string[] = [];
        for (let i = 0; i < length; i++) {
          const isError = form.validateField(`sections.${i}.semester`).hasError;
          if (isValid) {
            isValid = !isError;
          } else {
            form.validateField(`sections.${i}.semester`);
          }
          if (isError) {
            secNoList.push(
              getSectionNo(form.getValues().sections?.at(i)?.sectionNo)
            );
          }
        }
        if (secNoList.length) {
          secNoList.sort((a: any, b: any) => parseInt(a) - parseInt(b));
          showNotifications(
            NOTI_TYPE.ERROR,
            "Missing Recurrence Semester",
            `Please select a semester for recurrence in section ${secNoList.join(
              ", "
            )}`
          );
        }
        break;
    }
    if (isValid) {
      setFirstInput(true);
      if (active == 4) {
        await addCourse();
      }
      setActive((cur) => (cur < 4 ? cur + 1 : cur));
    }
    dispatch(setLoadingOverlay(false));
  };
  const prevStep = () => setActive((cur) => (cur > 0 ? cur - 1 : cur));
  const closeModal = () => {
    setActive(0);
    setSectionNoList([]);
    setCoInsList([]);
    form.reset();
    onClose();
  };

  const getCourseName = async (courseNo: string) => {
    const res = await getExistsCourseName(courseNo, {
      academicyear: academicYear.year,
      academicterm: academicYear.semester,
    });
    form.setFieldValue("courseName", res);
  };

  const setPayload = () => {
    let payload = {
      ...form.getValues(),
      year: academicYear.year,
      semester: academicYear.semester,
    };
    payload.sections?.forEach((sec: any) => {
      if (payload.type == COURSE_TYPE.SEL_TOPIC.en) {
        sec.topic = form.getValues().sections![0].topic;
      }
      sec.semester = sec.semester?.map((term: string) => parseInt(term));
      sec.coInstructors = sec.coInstructors?.map((coIns: any) => coIns.value);
    });
    return payload;
  };

  const addCourse = async () => {
    const res = await createCourse(setPayload());
    if (res) {
      showNotifications(
        NOTI_TYPE.SUCCESS,
        "Course Added Successfully",
        `${
          form.getValues().courseNo
        } has been successfully added to your course`
      );
      closeModal();
      fetchCourse(academicYear.year, academicYear.semester);
    }
  };

  const setSectionList = (value: string[]) => {
    let sections = form.getValues().sections ?? [];
    const lastValue = value[value.length - 1];
    const type = form.getValues().type;
    // validate section No
    if (value.length && value.length >= sections.length) {
      if (
        !parseInt(lastValue) ||
        lastValue.length > 3 ||
        sections.some((sec) => sec.sectionNo === parseInt(lastValue))
      )
        return;
    }
    const sectionNo: string[] = value.sort((a, b) => parseInt(a) - parseInt(b));
    setSectionNoList(sectionNo.map((secNo) => getSectionNo(secNo)));
    // reset sections and instructors
    let initialSection: Partial<IModelSection> = { semester: [] };
    if (type == COURSE_TYPE.SEL_TOPIC.en) {
      initialSection.topic = sections[0]?.topic;
    }
    if (!sectionNo.length) {
      sections = [{ ...initialSection }];
      setCoInsList([]);
    } else if (sections?.length == sectionNo.length) {
      sections[sectionNo.length - 1] = {
        ...initialSection,
        sectionNo: parseInt(lastValue),
        instructor: user.id,
        coInstructors: coInsList.map((coIns) => ({ ...coIns })),
      };
    }
    // adjust coInstructors
    else if (sectionNo.length > sections?.length) {
      coInsList.forEach((coIns) => {
        coIns.sections = coIns.sections.filter((sec: string) =>
          sectionNo.includes(sec)
        );
        if (!coIns.sections.includes(lastValue)) {
          coIns.sections.push(getSectionNo(lastValue));
          coIns.sections.sort((a: any, b: any) => parseInt(a) - parseInt(b));
        }
      });
      setCoInsList(coInsList.filter((coIns) => coIns.sections.length > 0));
      sections.push({
        ...initialSection,
        sectionNo: parseInt(lastValue),
        instructor: user.id,
        coInstructors: coInsList.map((coIns) => ({ ...coIns })),
      });
    } else {
      coInsList.forEach((coIns) => {
        coIns.sections = coIns.sections.filter((sec: string) =>
          sectionNo.includes(sec)
        );
        if (!coIns.sections.includes(lastValue)) {
          coIns.sections.push(getSectionNo(lastValue));
          coIns.sections.sort((a: any, b: any) => parseInt(a) - parseInt(b));
        }
      });
      setCoInsList(coInsList.filter((coIns) => coIns.sections.length > 0));
      sections = sections.filter((sec) =>
        sectionNo.includes(getSectionNo(sec.sectionNo))
      );
    }
    sections.forEach((sec) => sortData(sec.coInstructors!, "label", "string"));
    sortData(sections, "sectionNo");
    form.setFieldValue("sections", [...sections]);
  };

  const addCoIns = (
    {
      inputUser,
      instructorOption,
    }: { inputUser: any; instructorOption: any[] },
    {
      setInputUser,
      setInstructorOption,
    }: {
      setInputUser: React.Dispatch<React.SetStateAction<any>>;
      setInstructorOption: React.Dispatch<React.SetStateAction<any[]>>;
    }
  ) => {
    if (inputUser?.value) {
      inputUser.sections = [];
      const updatedInstructorOptions = instructorOption.map((option: any) =>
        option?.value == inputUser.value
          ? { ...option, disabled: true }
          : option
      );
      setInstructorOption(updatedInstructorOptions);
      delete inputUser.disabled;
      const updatedSections = form.getValues().sections?.map((sec) => {
        const coInsArr = [...(sec.coInstructors ?? []), inputUser];
        sortData(coInsArr, "label", "string");
        inputUser.sections.push(getSectionNo(sec.sectionNo));
        inputUser.sections.sort((a: any, b: any) => parseInt(a) - parseInt(b));
        return {
          ...sec,
          coInstructors: [...coInsArr],
        };
      });
      setCoInsList([inputUser, ...coInsList]);
      form.setFieldValue("sections", [...updatedSections!]);
    }
    setInputUser({ value: null });
  };

  const removeCoIns = (coIns: any) => {
    const newList = coInsList.filter((e) => e.value !== coIns.value);
    const updatedSections = form.getValues().sections?.map((sec) => ({
      ...sec,
      coInstructors: (sec.coInstructors ?? []).filter(
        (p) => p.value !== coIns.value
      ),
    }));
    form.setFieldValue("sections", [...updatedSections!]);
    setCoInsList(newList);
  };

  const editCoInsInSec = (sectionNo: string, checked: boolean, coIns: any) => {
    const updatedSections = form.getValues().sections;
    updatedSections?.forEach((sec, index) => {
      const secNo = getSectionNo(sec.sectionNo);
      if (sectionNo == secNo) {
        if (checked) {
          if (!coIns.sections.includes(secNo)) {
            coIns.sections = [...coIns.sections, secNo].sort(
              (a: any, b: any) => a - b
            );
          }
          sec.coInstructors?.push({ ...coIns });
        } else {
          coIns.sections = coIns.sections.filter((e: any) => e !== secNo);
          sec.coInstructors = sec.coInstructors?.filter(
            (p: any) => p.value !== coIns.value
          );
        }
        sortData(sec.coInstructors, "label", "string");
      }
      return sec;
    });
    form.setFieldValue("sections", [...updatedSections!]);
  };

  const setSemesterInSec = (
    index: number,
    checked: boolean,
    semester?: string[]
  ) => {
    const semesterList: any[] =
      form.getValues().sections?.at(index)?.semester ?? [];
    if (!semester) {
      form.setFieldValue(`sections.${index}.openThisTerm`, checked);
      if (
        checked &&
        !semesterList?.includes(academicYear?.semester.toString())
      ) {
        semesterList.push(academicYear?.semester.toString());
        semesterList.sort((a: any, b: any) => parseInt(a) - parseInt(b));
        form.setFieldValue(`sections.${index}.semester`, semesterList);
      }
    } else {
      form.setFieldValue(`sections.${index}.semester`, semester.sort());
    }
  };

  return (
    <Modal
      opened={opened}
      onClose={closeModal}
      closeOnClickOutside={false}
      title="Add Course"
      size="50vw"
      centered
      transitionProps={{ transition: "pop" }}
      classNames={{
        title: "acerSwift:max-macair133:!text-b1",
        content:
          "flex flex-col justify-center bg-[#F6F7FA] item-center overflow-hidden",
      }}
    >
      <Stepper
        active={active}
        color="#6869AD"
        onStepClick={setActive}
        allowNextStepsSelect={false}
        icon={<Icon IconComponent={IconCircleFilled} />}
        classNames={{
          separator: `text-primary mb-12 h-[3px] `,
          step: "flex flex-col items-start w-[42px]",
          stepIcon: "mb-2 text-[#E6E6FF] bg-[#E6E6FF] border-[#E6E6FF]",
          stepBody: "flex-col-reverse m-0 text-nowrap",
          stepLabel: "text-b3 acerSwift:max-macair133:text-b4 font-semibold",
          stepDescription:
            "text-b3 acerSwift:max-macair133:text-b4 font-semibold ",
        }}
        className="justify-center items-center mt-1 text-b2  acerSwift:max-macair133:text-b3 max-h-full"
      >
        <Stepper.Step
          allowStepSelect={false}
          label="Course Type"
          description="STEP 1"
        >
          <p className="font-semibold  mt-5 text-[15px]  acerSwift:max-macair133:text-b3">
            Select type of course
          </p>
          <div className=" acerSwift:max-macair133:overflow-y-auto  acerSwift:max-macair133:overflow-clip acerSwift:max-macair133:max-h-[280px] acerSwift:max-macair133:mt-2">
            <div className="w-full mt-2 flex flex-col gap-3  bg-transparent rounded-md ">
              <Button
                onClick={() => nextStep(COURSE_TYPE.GENERAL.en)}
                rightSection={
                  <Icon
                    IconComponent={IconChevronRight}
                    className="size-5 stroke-[#1f69f3] stroke-[2px] items-center pt-1"
                  />
                }
                classNames={{
                  inner: "flex justify-between items-center w-full",
                }}
                color="#ffffff"
                className="!w-full !h-fit !text-b3  acerSwift:max-macair133:text-b4 !border border-secondary py-3 items-center flex hover:bg-bgSecond"
              >
                <p className="justify-start flex flex-col">
                  <span className="flex justify-start text-default acerSwift:max-macair133:!text-b4">
                    {COURSE_TYPE.GENERAL.en}
                  </span>
                  <br />
                  <span className="flex justify-start font-medium text-b4 text-secondary -mt-1 acerSwift:max-macair133:!text-b5">
                    - Learner Person
                  </span>
                  <span className="flex justify-start font-medium text-b4 text-secondary mt-2 acerSwift:max-macair133:!text-b5">
                    - Innovative Co-creator
                  </span>
                  <span className="flex justify-start font-medium text-b4 text-secondary mt-2 acerSwift:max-macair133:!text-b5">
                    - Active Citizen
                  </span>
                </p>
              </Button>
              <Button
                onClick={() => nextStep(COURSE_TYPE.SPECIAL.en)}
                rightSection={
                  <Icon
                    IconComponent={IconChevronRight}
                    className="size-5 stroke-[#1f69f3] stroke-[2px] items-center pt-1"
                  />
                }
                classNames={{
                  inner: "flex justify-between items-center w-full",
                }}
                color="#ffffff"
                className="!w-full !h-fit !text-b3  acerSwift:max-macair133:text-b4 !border border-secondary py-3 items-center flex hover:bg-bgSecond"
              >
                <p className="justify-start flex flex-col">
                  <span className="flex justify-start text-default acerSwift:max-macair133:!text-b4">
                    {COURSE_TYPE.SPECIAL.en}
                  </span>
                  <br />
                  <span className="flex justify-start font-medium text-b4 text-secondary -mt-1 acerSwift:max-macair133:!text-b5">
                    - Core Courses
                  </span>
                  <span className="flex justify-start font-medium text-b4 text-secondary mt-2 acerSwift:max-macair133:!text-b5">
                    - Major Courses
                  </span>
                  <span className="flex justify-start font-medium text-b4 text-secondary mt-2 acerSwift:max-macair133:!text-b5">
                    - Minor Courses
                  </span>
                </p>
              </Button>
              <Button
                onClick={() => nextStep(COURSE_TYPE.SEL_TOPIC.en)}
                rightSection={
                  <Icon
                    IconComponent={IconChevronRight}
                    className="size-5 stroke-[#1f69f3] stroke-[2px] items-center pt-1"
                  />
                }
                classNames={{
                  inner: "flex justify-between items-center w-full",
                }}
                color="#ffffff"
                className="!w-full !h-fit !text-b3  acerSwift:max-macair133:text-b4 !border border-secondary py-4 items-center flex hover:bg-bgSecond"
              >
                <p className="justify-start flex flex-col">
                  <span className="flex justify-start mb-1 text-default acerSwift:max-macair133:!text-b4">
                    Selected Topics Course
                  </span>
                </p>
              </Button>
              <Button
                onClick={() => nextStep(COURSE_TYPE.FREE.en)}
                color="#ffffff"
                rightSection={
                  <Icon
                    IconComponent={IconChevronRight}
                    className="size-5 stroke-[#1f69f3] stroke-[2px] items-center pt-1"
                  />
                }
                classNames={{
                  inner: "flex justify-between items-center w-full ",
                }}
                className="!w-full !h-fit !text-b3  acerSwift:max-macair133:text-b4 !border border-secondary py-4 items-center flex hover:bg-bgSecond"
              >
                <p className="justify-start flex flex-col">
                  <span className="flex justify-start mb-1 text-default acerSwift:max-macair133:!text-b4">
                    {COURSE_TYPE.FREE.en}
                  </span>
                </p>
              </Button>
            </div>
          </div>
        </Stepper.Step>
        <Stepper.Step
          allowStepSelect={false}
          label="Course Info"
          description="STEP 2"
        >
          {" "}
          <Alert
            radius="md"
            icon={<Icon IconComponent={IconInfo2} />}
            variant="light"
            color="blue"
            className="mb-3"
            classNames={{
              icon: "size-6 acerSwift:max-macair133:size-5",
              body: " flex  justify-center",
              label:
                "sm:text-b3  acerSwift:max-macair133:text-b4 ipad11:text-b2",
            }}
            title={
              "Please fill only the section number for the section you own."
            }
          ></Alert>
          <div className="w-full mt-2 h-fitbg-white mb-5 acerSwift:max-macair133:mb-3 rounded-md acerSwift:max-macair133:overflow-y-auto acerSwift:max-macair133:max-h-[240px]">
            <div className="flex flex-col gap-3 acerSwift:max-macair133:gap-2">
              <TextInput
                classNames={{
                  input:
                    "focus:border-primary acerSwift:max-macair133:!text-b5",
                  label: "acerSwift:max-macair133:!text-b4",
                }}
                label="Course No."
                size="xs"
                withAsterisk
                placeholder={
                  form.getValues().type == COURSE_TYPE.SEL_TOPIC.en
                    ? "Ex. 26X4XX"
                    : "Ex. 001102"
                }
                maxLength={6}
                {...form.getInputProps("courseNo")}
              />
              <TextInput
                label="Course Name"
                withAsterisk
                size="xs"
                classNames={{
                  input:
                    "focus:border-primary acerSwift:max-macair133:!text-b5",
                  label: "acerSwift:max-macair133:!text-b4",
                }}
                placeholder={
                  form.getValues().type == COURSE_TYPE.SEL_TOPIC.en
                    ? "Ex. Select Topic in Comp Engr"
                    : "Ex. English 2"
                }
                {...form.getInputProps("courseName")}
              />
              {form.getValues().type == COURSE_TYPE.SEL_TOPIC.en && (
                <TextInput
                  label="Course Topic"
                  withAsterisk
                  size="xs"
                  classNames={{
                    input:
                      "focus:border-primary acerSwift:max-macair133:!text-b5",
                    label: "acerSwift:max-macair133:!text-b4",
                  }}
                  placeholder="Ex. Full Stack Development"
                  {...form.getInputProps("sections.0.topic")}
                />
              )}
              <TagsInput
                label="Section No."
                withAsterisk
                classNames={{
                  input:
                    "macair133:h-[130px] sm:h-[75px] ipad11:h-[90px] acerSwift:max-macair133:h-[75px] overflow-y-scroll bg-[#ffffff] mt-[2px] p-3 text-b4 acerSwift:max-macair133:!text-b5  rounded-md",
                  pill: "bg-secondary text-white font-bold pb-1 !pr-1 acerSwift:max-macair133:!text-b5",
                  label:
                    "font-semibold text-tertiary text-b2 acerSwift:max-macair133:!text-b4",
                  error: "text-b6 !border-none",
                }}
                placeholder="Ex. 001 or 1 (Press Enter or Spacebar for fill the next section)"
                splitChars={[",", " ", "|"]}
                {...form.getInputProps(`section.sectionNo`)}
                error={
                  !firstInput &&
                  form.validateField(`sections.0.sectionNo`).error
                }
                value={sectionNoList}
                onChange={setSectionList}
              ></TagsInput>
              <p>{form.validateField("sections.sectionNo").error}</p>
            </div>
          </div>
        </Stepper.Step>
        <Stepper.Step
          allowStepSelect={false}
          label="Section Infor"
          description="STEP 3"
        >
          <div className="flex flex-col macair133:max-h-[420px]  sm:max-h-[260px] ipad11:max-h-[340px] acerSwift:max-macair133:max-h-[260px] h-fit w-full mt-2 mb-5 p-[2px] overflow-y-auto">
            <div className="flex flex-col font-medium text-b2  acerSwift:max-macair133:text-b3 gap-4">
              {form.getValues().sections?.map((sec: any, index) => (
                <div className="flex flex-col gap-1" key={index}>
                  <span className="text-secondary text-b2  acerSwift:max-macair133:text-b3 font-bold">
                    Section {getSectionNo(sec.sectionNo)}
                    <span className="text-red-500"> *</span>
                  </span>
                  <div className="w-full justify-center pr-[18px] border-b-[1.5px] pt-1 pb-5   flex flex-col ">
                    <div className="gap-2 flex flex-col">
                      <TextInput
                        label={`Select the Curriculum for Section ${getSectionNo(
                          sec.sectionNo
                        )} (Optional)`}
                        size="xs"
                        maxLength={5}
                        placeholder="Curriculum"
                        classNames={{
                          input:
                            "focus:border-primary acerSwift:max-macair133:!text-b5",
                          label: "acerSwift:max-macair133:!text-b4",
                        }}
                        {...form.getInputProps(`sections.${index}.curriculum`)}
                      />
                      <div className="p-5 acerSwift:max-macair133:p-4 mt-1 bg-[#f5f5f5] rounded-xl">
                        <span className="font-semibold mt-2 text-default text-b2 acerSwift:max-macair133:!text-b3">
                          Repeat on semester
                        </span>
                        <Chip.Group
                          {...form.getInputProps(`sections.${index}.semester`)}
                          value={sec.semester}
                          onChange={(event) => {
                            setSemesterInSec(index, true, event as string[]);
                          }}
                          multiple
                        >
                          <Group className=" items-center h-full mt-2 flex flex-row gap-4">
                            {SEMESTER.map((item, index) => (
                              <Chip
                                key={index}
                                icon={<></>}
                                classNames={{
                                  input:
                                    "!bg-black border-[1.5px] disabled:bg-gray-500",
                                  iconWrapper: "w-0 !bg-black ",
                                  label:
                                    "text-b3 !px-5 cursor-pointer acerSwift:max-macair133:!text-b4",
                                  root: "",
                                }}
                                size="sm"
                                value={item.toString()}
                                disabled={
                                  sec.openThisTerm &&
                                  item == academicYear.semester &&
                                  sec.semester?.includes(item.toString())
                                }
                              >
                                {item}
                              </Chip>
                            ))}
                          </Group>
                        </Chip.Group>
                        <Checkbox
                          classNames={{
                            input:
                              "bg-white bg-opacity-0 border-[1.5px] border-tertiary cursor-pointer disabled:bg-gray-400",
                            body: "mr-3 px-0",
                            label:
                              "text-b3 acerSwift:max-macair133:!text-b4 acerSwift:max-macair133:text-b4 text-default font-semibold  cursor-pointer ",
                          }}
                          className="mt-5 ml-1"
                          size="xs"
                          label={`Section ${getSectionNo(
                            sec.sectionNo
                          )} open in this semester (${
                            academicYear?.semester
                          }/${academicYear?.year.toString()?.slice(-2)})`}
                          checked={sec.openThisTerm}
                          onChange={(event) =>
                            setSemesterInSec(index, event.target.checked)
                          }
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Stepper.Step>
        <Stepper.Step
          allowStepSelect={false}
          label="Co-Instructor"
          description="STEP 4"
        >
          <div className="flex flex-col macair133:max-h-[420px] sm:max-h-[300px] ipad11:max-h-[360px] acerSwift:max-macair133:max-h-[290px] mb-5 h-fit overflow-y-scroll mt-2 p-[2px]">
            <div>
              <Alert
                radius="md"
                icon={<Icon IconComponent={IconInfo2} />}
                variant="light"
                color="blue"
                className="mb-1"
                classNames={{
                  icon: "size-6 acerSwift:max-macair133:size-5",
                  body: " flex justify-center",
                  label:
                    "sm:text-b3 acerSwift:max-macair133:text-b4 ipad11:text-b2 ",
                }}
                title={
                  <p>
                    Co-instructors can only access and upload scores for your
                    selected sections and manage the course TQF documents.
                  </p>
                }
              ></Alert>
            </div>
            <CompoManageIns
              opened={active == 3}
              type="add"
              action={addCoIns}
              sections={form.getValues().sections}
              setUserList={setCoInsList}
            />
            {!!coInsList.length && (
              <div className="w-full flex flex-col mt-3 bg-white border-secondary border-[1px]  rounded-md">
                <div className=" bg-bgTableHeader acerSwift:max-macair133:!text-b3 flex gap-3 h-fit font-semibold items-center rounded-t-md border-b-secondary border-[1px] px-4 py-3 text-secondary ">
                  <Icon
                    IconComponent={IconUsers}
                    className="acerSwift:max-macair133:!size-5"
                  />{" "}
                  Added Co-Instructor
                </div>
                <div className="flex flex-col  h-fit w-full px-2">
                  <div className="flex flex-col h-fit p-1 ">
                    {coInsList.map((coIns, index) => (
                      <div
                        key={index}
                        className="w-full h-fit p-3 gap-4 flex flex-col border-b-[1px] border-[#c9c9c9] last:border-none"
                      >
                        <div className="flex w-full justify-between items-center">
                          <span className="text-tertiary -translate-y-1 font-semibold text-b2 acerSwift:max-macair133:text-b3">
                            {coIns.label}
                          </span>

                          <div className="flex justify-end gap-4 mt-1">
                            <Menu shadow="md" width={200}>
                              <Menu.Target>
                                <Button variant="outline" className="!h-7 px-3">
                                  Access
                                </Button>
                              </Menu.Target>

                              <Menu.Dropdown className="overflow-y-auto max-h-[220px] !w-[220px] h-fit border-b ">
                                <Menu.Label className="translate-x-1 mb-2">
                                  Can access
                                </Menu.Label>
                                <div className="flex flex-col pl-3  pb-2 h-fit gap-4 w-full">
                                  {sectionNoList.map((sectionNo, index) => (
                                    <Checkbox
                                      disabled={
                                        coIns.sections?.length == 1 &&
                                        coIns.sections?.includes(sectionNo)
                                      }
                                      key={index}
                                      classNames={{
                                        input:
                                          "bg-black bg-opacity-0  border-[1.5px] border-[#3E3E3E] cursor-pointer disabled:bg-gray-400",
                                        body: "mr-3",
                                        label:
                                          "text-b2 cursor-pointer acerSwift:max-macair133:text-b4",
                                      }}
                                      size="xs"
                                      label={`Section ${sectionNo}`}
                                      checked={coIns.sections?.includes(
                                        sectionNo
                                      )}
                                      onChange={(event) =>
                                        editCoInsInSec(
                                          sectionNo,
                                          event.currentTarget.checked,
                                          coIns
                                        )
                                      }
                                    />
                                  ))}
                                </div>
                              </Menu.Dropdown>
                            </Menu>
                            <Button
                              color="#FF4747"
                              variant="outline"
                              className="!h-7 px-3 "
                              onClick={() => removeCoIns(coIns)}
                            >
                              Remove
                            </Button>
                          </div>
                        </div>
                        <div className="flex text-secondary flex-row -mt-5 gap-1 font-medium text-b4 acerSwift:max-macair133:text-b5 acerSwift:max-macair133:-mt-6">
                          <div className=" font-semibold">
                            Can access section:
                          </div>
                          <div className="flex gap-1 w-[50%] flex-wrap ">
                            {coIns.sections?.map(
                              (sectionNo: any, index: number) => (
                                <p key={index}>
                                  {sectionNo}
                                  {index !== coIns.sections?.length - 1 && ","}
                                </p>
                              )
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </Stepper.Step>
        <Stepper.Step
          allowStepSelect={false}
          label="Review"
          description="STEP 5"
        >
          <div
            className="w-full flex flex-col sm:max-h-[320px] ipad11:max-h-[380px] acerSwift:max-macair133:max-h-[280px] bg-white border-secondary mt-2 border-[1px] mb-5 rounded-md"
            style={{
              boxShadow: "0px 0px 4px 0px rgba(0, 0, 0, 0.25)",
            }}
          >
            <div className="bg-bgTableHeader flex flex-col justify-start gap-[2px] font-semibold  rounded-t-md border-b-secondary border-[1px] px-4 py-3 text-secondary ">
              <p>
                {form.getValues().courseNo} - {form.getValues().courseName}
              </p>
              {form.getValues().sections?.at(0)?.topic && (
                <p className="text-secondary text-b4 acerSwift:max-macair133:text-b5">
                  Topic: {form.getValues().sections?.at(0)?.topic}
                </p>
              )}
            </div>
            <div className="flex flex-col max-h-[380px] h-fit w-full px-2 overflow-y-auto ">
              <div className="flex flex-col gap-3 mt-3 font-medium text-b4 acerSwift:max-macair133:text-b5">
                {form.getValues().sections?.map((sec, index) => (
                  <div
                    key={index}
                    className="w-full border-b-[1px] last:border-none border-[#c9c9c9] pb-2 h-fit px-4 gap-1 flex flex-col"
                  >
                    <span className="text-primary font-semibold flex flex-col text-b2 acerSwift:max-macair133:text-b3 mb-2">
                      Section {getSectionNo(sec.sectionNo)}
                    </span>
                    <div className="flex flex-col gap-1">
                      <span className="text-tertiary text-b2 acerSwift:max-macair133:text-b5 font-semibold">
                        Owner Section
                      </span>
                      <div className="ps-1.5 text-secondary mb-2">
                        <List size="sm" listStyleType="disc">
                          <List.Item className="mb-[3px] acerSwift:max-macair133:text-b4">
                            {getUserName(user, 1)}
                          </List.Item>
                        </List>
                      </div>
                    </div>

                    {!!sec.coInstructors?.length && (
                      <div className="flex flex-col gap-1">
                        <span className="text-tertiary text-b2 font-semibold acerSwift:max-macair133:text-b5">
                          Co-Instructor
                        </span>
                        <div className="ps-1.5 text-secondary mb-2 ">
                          <List size="sm" listStyleType="disc">
                            {sec.coInstructors?.map((coIns, index) => (
                              <List.Item
                                className="mb-[3px] acerSwift:max-macair133:text-b4"
                                key={index}
                              >
                                {coIns?.label}
                              </List.Item>
                            ))}
                          </List>
                        </div>
                      </div>
                    )}

                    <div className="flex flex-col gap-1">
                      <span className="text-tertiary text-b2 font-semibold acerSwift:max-macair133:text-b5">
                        Recurrence semester
                      </span>
                      <div className="ps-1.5 text-secondary mb-2">
                        <List
                          size="sm"
                          listStyleType="disc"
                          className="flex flex-col gap-1 acerSwift:max-macair133:text-b4"
                        >
                          <List.Item>
                            Repeat on semester{" "}
                            {sec.semester
                              ?.join(", ")
                              .replace(/, ([^,]*)$/, " and $1")}
                          </List.Item>
                          {sec.openThisTerm && (
                            <List.Item className="mb-[3px]">
                              Open in this semester ({academicYear.semester}/
                              {academicYear.year.toString().slice(-2)})
                            </List.Item>
                          )}
                        </List>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Stepper.Step>
      </Stepper>

      {active > 0 && (
        <Group className="flex w-full h-fit items-end justify-between">
          <div>
            {active > 0 && (
              <Button variant="subtle" onClick={prevStep} loading={loading}>
                Back
              </Button>
            )}
          </div>
          <Button
            loading={loading}
            onClick={() => nextStep()}
            rightSection={
              active != 4 && (
                <Icon
                  IconComponent={IconArrowRight}
                  className=" stroke-[2px] size-5"
                />
              )
            }
          >
            {active == 4 ? "Done" : "Next step"}
          </Button>
        </Group>
      )}
    </Modal>
  );
}
