import { useEffect, useState } from "react";
import {
  Stepper,
  Button,
  Group,
  Modal,
  Select,
  TextInput,
  Checkbox,
  TagsInput,
  List,
  Menu,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import {
  IconChevronDown,
  IconCircleFilled,
  IconChevronRight,
  IconArrowRight,
  IconUsers,
  IconX,
} from "@tabler/icons-react";
import { COURSE_TYPE, NOTI_TYPE } from "@/helpers/constants/enum";
import { IModelCourse } from "@/models/ModelCourse";
import AddCoIcon from "@/assets/icons/addCo.svg?react";
import Icon from "../Icon";
import { getInstructor } from "@/services/user/user.service";
import { IModelUser } from "@/models/ModelUser";
import { SEMESTER } from "@/helpers/constants/enum";
import { isNumber } from "lodash";
import { useAppDispatch, useAppSelector } from "@/store";
import {
  validateCourseNameorTopic,
  validateEmail,
} from "@/helpers/functions/validation";
import { createCourse } from "@/services/course/course.service";
import {
  getSection,
  getUserName,
  showNotifications,
  sortData,
} from "@/helpers/functions/function";
import { setCourseList } from "@/store/course";

type Props = {
  opened: boolean;
  onClose: () => void;
};
export default function ModalAddCourse({ opened, onClose }: Props) {
  const user = useAppSelector((state) => state.user);
  const academicYear = useAppSelector((state) => state.academicYear[0]);
  const dispatch = useAppDispatch();
  const [active, setActive] = useState(0);
  const [openedDropdown, setOpenedDropdown] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [instructorOption, setInstructorOption] = useState<any[]>([]);
  const [sectionNoList, setSectionNoList] = useState<string[]>([]);
  const [insInput, setInsInput] = useState<any>({ value: null });
  const [coInsList, setCoInsList] = useState<any[]>([]);
  const [swapMethodAddCo, setSwapMethodAddCo] = useState(false);
  const [invalidEmail, setInvalidEmail] = useState(false);
  const [firstInput, setFirstInput] = useState(true);

  const form = useForm({
    mode: "uncontrolled",
    initialValues: { sections: [{}] } as Partial<IModelCourse>,
    validate: {
      type: (value) => !value && "Course Type is required",
      courseNo: (value) => {
        if (!value) return "Course No. is required";
        if (!value.replace(/^[0]+$/, "").length) return "Cannot have only 0";
        const isValid = /^\d{6}$/.test(value.toString());
        return isValid ? null : "Require number 6 digits";
      },
      courseName: (value) => validateCourseNameorTopic(value, "Course Name"),
      sections: {
        topic: (value) => validateCourseNameorTopic(value, "Topic"),
        sectionNo: (value) => {
          if (value == undefined) return "Section No. is required";
          const isValid = isNumber(value) && value.toString().length <= 3;
          return isValid ? null : "Please enter a valid section no";
        },
        semester: (value) => {
          return value?.length ? null : "Please select semester at least one.";
        },
      },
    },
    validateInputOnBlur: true,
  });

  useEffect(() => {
    const fetchIns = async () => {
      let res = await getInstructor();
      if (res) {
        res = res.filter((e: any) => e.id != user.id);
        setInstructorOption(
          res.map((e: IModelUser) => {
            return { label: getUserName(e, 1), value: e.id };
          })
        );
      }
    };
    if (opened) {
      fetchIns();
    }
  }, [opened]);

  useEffect(() => {
    if (swapMethodAddCo) {
      if (insInput.value) setInvalidEmail(!validateEmail(insInput.value));
      else setInvalidEmail(false);
    }
  }, [insInput]);

  useEffect(() => {
    console.log("form: ", form.getValues().sections);
    console.log("coInsList: ", coInsList);
  }, [form]);

  const nextStep = async (type?: COURSE_TYPE) => {
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
        form.validateField("courseName");
        form.validateField("sections.0.topic");
        isValid =
          !form.validateField("courseNo").hasError &&
          !form.validateField("courseName").hasError &&
          (!form.validateField("sections.0.topic").hasError ||
            form.getValues().type !== COURSE_TYPE.SEL_TOPIC);

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
              getSection(form.getValues().sections?.at(i)?.sectionNo)
            );
          }
        }
        if (secNoList.length) {
          secNoList.sort((a: any, b: any) => parseInt(a) - parseInt(b));
          showNotifications(
            NOTI_TYPE.ERROR,
            "iiiii",
            `ooooooo ${secNoList.join(", ")}`
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
  };
  const prevStep = () => setActive((cur) => (cur > 0 ? cur - 1 : cur));
  const closeModal = () => {
    setActive(0);
    setSectionNoList([]);
    setInsInput({ value: null });
    setCoInsList([]);
    form.reset();
    onClose();
  };

  const addCourse = async () => {
    let payload: any = form.getValues();
    payload = {
      ...payload,
      academicYear: academicYear.id,
      updatedYear: academicYear.year,
      updatedSemester: academicYear.semester,
    };
    payload.sections?.forEach((sec: any) => {
      sec.coInstructors = sec.coInstructors?.map((coIns: any) => coIns.value);
    });
    const res = await createCourse(payload);
    if (res) {
      dispatch(setCourseList([]));
      closeModal();
      showNotifications("success", "Create Course", "Create coures successful");
    }
  };

  const setSectionList = (value: string[]) => {
    let sections = form.getValues().sections ?? [];
    const lastValue = value[value.length - 1];
    const type = form.getValues().type;
    // validate section No
    if (value.length >= sections.length) {
      if (
        !parseInt(lastValue) ||
        lastValue.length > 3 ||
        sections.some((sec) => sec.sectionNo === parseInt(lastValue))
      )
        return;
    }
    const sectionNo: string[] = value.sort((a, b) => parseInt(a) - parseInt(b));
    setSectionNoList(sectionNo.map((secNo) => getSection(secNo)));
    let newSections: any[] = [];
    if (sections) {
      // reset sections and instructors
      if (!sectionNo.length) {
        let initialSection = {};
        if (type == COURSE_TYPE.SEL_TOPIC) {
          initialSection = { topic: sections[0]?.topic };
        }
        setCoInsList([]);
        instructorOption.forEach((option) => (option.disabled = false));
      }
      // adjust coInstructors
      else if (sections?.length! > sectionNo.length) {
        coInsList.forEach((coIns, index) => {
          coIns.sections = coIns.sections.filter((sec: string) =>
            sectionNo.includes(sec)
          );
          if (!coIns.sections.length) {
            instructorOption.forEach((option) => {
              if (option.value == coIns.value) option.disabled = false;
            });
          }
        });
        setCoInsList(coInsList.filter((coIns) => coIns.sections.length > 0));
      }
      sectionNo.forEach((secNo, index) => {
        const data: any = {
          ...(sections.find((sec) => sec.sectionNo == parseInt(secNo)) || {}),
          sectionNo: parseInt(secNo),
          instructor: user.id,
          coInstructors: coInsList.map((coIns) => ({ ...coIns })),
        };
        if (type == COURSE_TYPE.SEL_TOPIC) {
          data.topic = sections[0]?.topic;
        }
        coInsList.forEach((coIns) => {
          if (!coIns.sections.includes(getSection(secNo))) {
            coIns.sections.push(getSection(secNo));
            coIns.sections.sort(
              (a: string, b: string) => parseInt(a) - parseInt(b)
            );
          }
        });
        newSections?.push(data);
      });
    }
    newSections.forEach((sec) =>
      sortData(sec.coInstructors!, "label", "string")
    );
    sortData(newSections, "sectionNo");
    form.setFieldValue("sections", [...newSections]);
  };

  const addCoIns = () => {
    if (insInput.value) {
      insInput.sections = [];
      const updatedInstructorOptions = instructorOption.map((option) =>
        option.value == insInput.value ? { ...option, disabled: true } : option
      );
      setInstructorOption(updatedInstructorOptions);
      delete insInput.disabled;
      const updatedSections = form.getValues().sections?.map((sec) => {
        const coInsArr = [...(sec.coInstructors ?? []), insInput];
        sortData(coInsArr, "label", "string");
        insInput.sections.push(getSection(sec.sectionNo));
        insInput.sections.sort((a: any, b: any) => parseInt(a) - parseInt(b));
        return {
          ...sec,
          coInstructors: [...coInsArr],
        };
      });
      setCoInsList([insInput, ...coInsList]);
      form.setFieldValue("sections", [...updatedSections!]);
    }
    setInsInput({ value: null });
  };

  const removeCoIns = (coIns: any) => {
    const newCoIns = coInsList.filter((e) => e.value !== coIns.value);
    const updatedInstructorOptions = instructorOption.map((option) =>
      option.value == coIns.value ? { ...option, disabled: false } : option
    );
    setInstructorOption(updatedInstructorOptions);
    const updatedSections = form.getValues().sections?.map((sec) => ({
      ...sec,
      coInstructors: (sec.coInstructors ?? []).filter(
        (p) => p.value !== coIns.value
      ),
    }));
    form.setFieldValue("sections", [...updatedSections!]);
    setCoInsList(newCoIns);
  };

  const editCoInsInSec = (index: number, checked: boolean, coIns: any) => {
    console.log(checked);

    const updatedSections = form.getValues().sections;
    updatedSections?.forEach((sec, i) => {
      if (i == index) {
        const secNo = getSection(sec.sectionNo);
        if (checked) {
          coIns.sections.push(secNo);
          coIns.sections.sort((a: any, b: any) => parseInt(a) - parseInt(b));
        } else {
          coIns.sections = coIns.sections.filter((e: any) => e !== secNo);
        }
        const coInsArr = [...(sec.coInstructors ?? []), { ...coIns }];
        sortData(coInsArr, "label", "string");
        const updatedCoInstructors = checked
          ? coInsArr
          : sec.coInstructors?.splice(sec.coInstructors.indexOf(coIns), 1);
        return { ...sec, coInstructors: updatedCoInstructors };
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
      if (checked && !semesterList?.includes(academicYear?.semester)) {
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
        content:
          "flex flex-col justify-center bg-[#F6F7FA] item-center overflow-hidden",
      }}
    >
      <Stepper
        active={active}
        color="#6869AD"
        onStepClick={setActive}
        allowNextStepsSelect={false}
        icon={<IconCircleFilled />}
        classNames={{
          separator: "text-primary -mx-1 mb-12 h-[3px] -translate-x-5",
          step: "flex flex-col  items-start mr-2",
          stepIcon: "mb-2 text-[#E6E6FF] bg-[#E6E6FF] border-[#E6E6FF]",
          stepBody: "flex-col-reverse m-0 ",
          stepLabel: "text-[13px] font-semibold",
          stepDescription: "text-[13px] font-semibold",
        }}
        className=" justify-center items-center mt-1  text-[14px] max-h-full"
      >
        <Stepper.Step label="Course Type" description="STEP 1">
          <p className="font-semibold mt-5 text-[15px]">
            Select type of course
          </p>

          <div className="w-full mt-2 flex flex-col gap-3  bg-transparent rounded-md">
            <Button
              onClick={() => nextStep(COURSE_TYPE.GENERAL)}
              color="#ffffff"
              className="w-ful border-[1px] text-[13px] border-secondary  h-fit py-3 items-center rounded-[6px] flex justify-start"
            >
              <p className="justify-start flex flex-col">
                <span className="flex justify-start text-[#3e3e3e]">
                  {COURSE_TYPE.GENERAL}
                </span>
                <br />
                <span className="flex justify-start font-medium text-[12px] f text-secondary -mt-1">
                  - Learner Person / Innovative Co-creator / Active Citizen
                </span>
              </p>
            </Button>
            <Button
              onClick={() => nextStep(COURSE_TYPE.SPECIAL)}
              color="#ffffff"
              className="w-ful border-[1px] text-[13px]  border-secondary h-fit py-3 !text-[#000000] items-center rounded-[6px] flex justify-start"
            >
              <p className="justify-start flex flex-col">
                <span className="flex justify-start text-[#3e3e3e]">
                  {COURSE_TYPE.SPECIAL}
                </span>
                <br />
                <span className="flex justify-start font-medium text-[12px] text-secondary -mt-1">
                  - Core Courses / Major Courses (Required Courses) / Minor
                  Courses
                </span>
              </p>
            </Button>
            <Button
              onClick={() => nextStep(COURSE_TYPE.SEL_TOPIC)}
              color="#ffffff"
              className="w-ful border-[1px] text-[13px] border-secondary  h-fit py-3 !text-[#000000] items-center rounded-[6px] flex justify-start"
            >
              <p className="justify-start flex flex-col">
                <span className="flex justify-start">Major Elective</span>{" "}
                <br />
                <span className="flex justify-start font-medium text-[12px] text-secondary -mt-1">
                  - Selected Topics Course
                </span>
              </p>
            </Button>
            <Button
              onClick={() => nextStep(COURSE_TYPE.FREE)}
              color="#ffffff"
              className="w-full border-[1px] h-fit py-3 text-[13px]   border-secondary items-start  !text-[#000000] rounded-[6px] flex justify-start"
            >
              <p className="justify-start flex flex-col">
                <span className="flex justify-start">{COURSE_TYPE.FREE}</span>
                <br />
                <span className="flex justify-start font-medium text-[12px] text-secondary -mt-1">
                  -
                </span>
              </p>
            </Button>
          </div>
        </Stepper.Step>
        <Stepper.Step label="Course Info" description="STEP 2">
          <div className="w-full  mt-2 h-fit  bg-white mb-5 rounded-md">
            <div className="flex flex-col gap-3">
              <TextInput
                classNames={{ input: "focus:border-primary" }}
                label="Course No."
                size="xs"
                withAsterisk
                placeholder={
                  form.getValues().type == COURSE_TYPE.SEL_TOPIC
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
                classNames={{ input: "focus:border-primary " }}
                placeholder={
                  form.getValues().type == COURSE_TYPE.SEL_TOPIC
                    ? "Ex. Select Topic in Comp Engr"
                    : "Ex. English 2"
                }
                {...form.getInputProps("courseName")}
              />
              {form.getValues().type == COURSE_TYPE.SEL_TOPIC && (
                <TextInput
                  label="Course Topic"
                  withAsterisk
                  size="xs"
                  classNames={{ input: "focus:border-primary" }}
                  placeholder="Ex. Full Stack Development"
                  {...form.getInputProps("sections.0.topic")}
                />
              )}
              <TagsInput
                label="Section"
                withAsterisk
                classNames={{
                  input:
                    " h-[145px] bg-[#ffffff] mt-[2px] p-3 text-[12px]  rounded-md",
                  pill: "bg-secondary text-white font-bold",
                  label: "font-semibold text-[#3e3e3e] text-b2",
                  error: "text-[10px] !border-none",
                }}
                placeholder="Ex. 001 or 1 (Press Enter for fill the next section)"
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
        <Stepper.Step label="Semester" description="STEP 3">
          <div className="flex flex-col max-h-[380px] h-fit w-full mt-2 mb-5   p-[2px]    overflow-y-scroll  ">
            <div className="flex flex-col font-medium text-[14px] gap-5">
              {form.getValues().sections?.map((sec: any, index) => (
                <div className="flex flex-col gap-1" key={index}>
                  <span className="text-secondary font-semibold">
                    Select Semester for Section {getSection(sec.sectionNo)}{" "}
                    <span className="text-red-500">*</span>
                  </span>
                  <div
                    style={{
                      boxShadow: "0px 0px 4px 0px rgba(0, 0, 0, 0.25)",
                    }}
                    className="w-full p-3 bg-white rounded-md gap-2 flex flex-col "
                  >
                    <div className="flex flex-row items-center justify-between">
                      <div className="gap-1 flex flex-col">
                        <span className="font-semibold">Open Semester</span>
                        <Checkbox
                          classNames={{
                            input:
                              "bg-[black] bg-opacity-0 border-[1.5px] border-[#3E3E3E] cursor-pointer disabled:bg-gray-400",
                            body: "mr-3",
                            label: "text-[14px] text-[#615F5F] cursor-pointer",
                          }}
                          color="#5768D5"
                          size="xs"
                          label={`Open in this semester (${
                            academicYear?.semester
                          }/${academicYear?.year.toString()?.slice(-2)})`}
                          checked={sec.openThisTerm}
                          {...form.getInputProps(
                            `sections.${index}.openThisTerm`
                          )}
                          onChange={(event) =>
                            setSemesterInSec(index, event.target.checked)
                          }
                        />
                      </div>
                      <Checkbox.Group
                        classNames={{ error: "mt-2" }}
                        {...form.getInputProps(`sections.${index}.semester`)}
                        value={sec.semester}
                        onChange={(event) => {
                          setSemesterInSec(index, true, event);
                        }}
                      >
                        <Group className="flex flex-row gap-1 justify-end ">
                          {SEMESTER.map((item) => (
                            <Checkbox
                              key={item}
                              classNames={{
                                input:
                                  "bg-black bg-opacity-0 border-[1.5px] border-[#3E3E3E] cursor-pointer disabled:bg-gray-400",
                                body: "mr-3",
                                label: "text-[14px] cursor-pointer",
                              }}
                              color="#5768D5"
                              size="xs"
                              label={item}
                              disabled={
                                sec.semester?.includes(item.toString()) &&
                                sec.openThisTerm
                              }
                              value={item.toString()}
                            />
                          ))}
                        </Group>
                      </Checkbox.Group>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Stepper.Step>
        <Stepper.Step label="Co-Instructor" description="STEP 4">
          <div className="flex flex-col gap-5 mt-3 flex-1 ">
            <div
              className="flex flex-col bg-white gap-2 max-h-[320px] mb-5 rounded-md h-fit w-full  p-4  "
              style={{
                boxShadow: "0px 0px 4px 0px rgba(0, 0, 0, 0.25)",
              }}
            >
              <div
                onClick={() => setSwapMethodAddCo(!swapMethodAddCo)}
                className="bg-[#e6e9ff] hover:bg-[#dee1fa] cursor-pointer h-fit rounded-lg text-secondary flex justify-between items-center p-4 "
              >
                <div className="flex gap-6">
                  <Icon IconComponent={AddCoIcon} className="text-secondary" />
                  <p className="font-semibold">
                    Add Co-Instructor by using
                    <span className="font-extrabold">
                      {swapMethodAddCo ? " Dropdown list" : " CMU Account"}
                    </span>
                  </p>
                </div>
                <IconChevronRight stroke={2} />
              </div>

              <div className="flex w-full items-end h-fit ">
                {swapMethodAddCo ? (
                  <TextInput
                    description="Make sure CMU account correct"
                    label={<p>Add Co-Instructor via CMU account (Optional)</p>}
                    className="w-full border-none "
                    style={{ boxShadow: "0px 1px 4px 0px rgba(0, 0, 0, 0.05)" }}
                    classNames={{
                      input: " !rounded-r-none ",
                      description: "font-medium mt-[1px] mb-2",
                    }}
                    placeholder="example@cmu.ac.th"
                    value={insInput.value!}
                    onChange={(event) =>
                      setInsInput({ value: event.target.value })
                    }
                  />
                ) : (
                  <Select
                    rightSectionPointerEvents="all"
                    label="Select Co-Instructor (Optional)"
                    placeholder="Co-Instructor"
                    data={instructorOption}
                    searchable
                    nothingFoundMessage="No result"
                    className="w-full border-none "
                    classNames={{ input: " rounded-e-none  rounded-md " }}
                    style={{ boxShadow: "0px 1px 4px 0px rgba(0, 0, 0, 0.05)" }}
                    rightSection={
                      <template className="flex items-center gap-2 absolute right-2">
                        {insInput.value && (
                          <IconX
                            size={"1.25rem"}
                            stroke={2}
                            className={`cursor-pointer`}
                            onClick={() => setInsInput({ value: null })}
                          />
                        )}
                        <IconChevronDown
                          stroke={2}
                          className={`${
                            openedDropdown ? "rotate-180" : ""
                          } stroke-primary cursor-pointer`}
                          onClick={() => setOpenedDropdown(!openedDropdown)}
                        />
                      </template>
                    }
                    dropdownOpened={openedDropdown}
                    // onDropdownOpen={() => setOpenedDropdown(true)}
                    onDropdownClose={() => setOpenedDropdown(false)}
                    value={insInput.value!}
                    onChange={(value, option) => setInsInput(option)}
                    onClick={() => setOpenedDropdown(!openedDropdown)}
                  />
                )}
                <Button
                  className="rounded-s-none min-w-fit border-l-0"
                  color="#5768D5"
                  disabled={
                    !insInput.value || (swapMethodAddCo && invalidEmail)
                  }
                  onClick={addCoIns}
                >
                  Add
                </Button>
              </div>
            </div>

            {!!coInsList.length && (
              <div
                className="w-full flex flex-col bg-white border-secondary border-[1px]  rounded-md"
                style={{
                  boxShadow: "0px 0px 4px 0px rgba(0, 0, 0, 0.25)",
                }}
              >
                <div className="bg-[#e6e9ff] flex gap-3 h-fit font-semibold items-center rounded-t-md border-b-secondary border-[1px] px-4 py-3 text-secondary ">
                  <IconUsers /> Added Co-Instructor
                </div>
                <div className="flex flex-col max-h-[250px] h-fit w-full   px-2   overflow-y-scroll ">
                  {/* <TextInput
                  size="xs"
                  leftSection={<TbSearch />}
                  placeholder="Name"
                  value={searchValue}
                  onChange={(event) =>
                    setSearchValue(event.currentTarget.value)
                  }
                  rightSectionPointerEvents="all"
                /> */}
                  <div className="flex flex-col max-h-[400px] h-fit p-1">
                    {coInsList.map(
                      (coIns, index) =>
                        (!searchValue.length ||
                          coIns.label
                            .toLowerCase()
                            .includes(searchValue.toLowerCase())) && (
                          <div
                            key={index}
                            className="w-full h-fit p-3   gap-4 flex flex-col"
                          >
                            <div className="flex w-full justify-between items-center">
                              <div className="flex flex-col  font-medium text-[14px]">
                                {/* <span className="text-[#3E3E3E] font-semibold">
                              {coIns.label ?? coIns.value}
                              </span> */}
                                <span className="text-[#3e3e3e] -translate-y-1 font-semibold text-[14px]">
                                  {coIns.label ? coIns.label : coIns.value}
                                </span>
                              </div>
                              <div className="flex justify-end gap-3 ">
                                <Menu shadow="md" width={200}>
                                  <Menu.Target>
                                    <Button
                                      variant="outline"
                                      color="#5768d5"
                                      size="xs"
                                      className=" transform-none text-[12px] rounded-md"
                                    >
                                      Access
                                    </Button>
                                  </Menu.Target>

                                  <Menu.Dropdown className=" overflow-y-scroll max-h-[180px] h-fit">
                                    <Menu.Label className=" -translate-x-1">
                                      Can access
                                    </Menu.Label>
                                    <div className="flex flex-col pb-2 h-fit gap-2 w-full">
                                      {sectionNoList.map((sectionNo, index) => (
                                        <Checkbox
                                          disabled={
                                            coIns.sections.length == 1 &&
                                            coIns.sections.includes(sectionNo)
                                          }
                                          key={index}
                                          classNames={{
                                            input:
                                              "bg-black bg-opacity-0  border-[1.5px] border-[#3E3E3E] cursor-pointer disabled:bg-gray-400",
                                            body: "mr-3",
                                            label: "text-[14px] cursor-pointer",
                                          }}
                                          color="#5768D5"
                                          size="xs"
                                          label={`Section ${sectionNo}`}
                                          checked={coIns.sections.includes(
                                            sectionNo
                                          )}
                                          onChange={(event) =>
                                            editCoInsInSec(
                                              index,
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
                                  className="text-[12px] transform-none rounded-md"
                                  size="xs"
                                  variant="outline"
                                  color="#FF4747"
                                  onClick={() => removeCoIns(coIns)}
                                >
                                  Remove
                                </Button>
                              </div>
                            </div>
                            <div className="flex text-secondary flex-row w-[70%] flex-wrap -mt-5 gap-1 font-medium text-[13px]">
                              <p className=" font-semibold">Section</p>

                              {coIns.sections.map(
                                (sectionNo: any, index: number) => (
                                  <p key={index}>
                                    {sectionNo}
                                    {index !== coIns.sections.length - 1 && ","}
                                  </p>
                                )
                              )}
                            </div>
                          </div>
                        )
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </Stepper.Step>
        <Stepper.Step label="Review" description="STEP 5">
          <div
            className="w-full flex flex-col bg-white border-secondary border-[1px] mb-5 rounded-md"
            style={{
              boxShadow: "0px 0px 4px 0px rgba(0, 0, 0, 0.25)",
            }}
          >
            <div className="bg-[#e6e9ff] flex flex-col justify-start gap-[2px] font-semibold  rounded-t-md border-b-secondary border-[1px] px-4 py-2 text-secondary ">
              <p>
                {form.getValues().courseNo} - {form.getValues().courseName}{" "}
              </p>
              {form.getValues().sections?.at(0)?.topic && (
                <p className="text-secondary text-b3">
                  Topic: {form.getValues().sections?.at(0)?.topic}
                </p>
              )}
              <p className="text-b3">Onwer Course: {getUserName(user, 1)}</p>
            </div>
            <div className="flex flex-col max-h-[320px] h-fit w-full   px-2   overflow-y-scroll ">
              {" "}
              <div className="flex flex-col gap-3 mt-3   font-medium text-[12px]">
                {form.getValues().sections?.map((sec, index) => (
                  <div
                    key={index}
                    className="w-full border-b-[1px] border-[#c9c9c9] pb-2  h-fit px-4    gap-1 flex flex-col"
                  >
                    <span className="text-secondary font-semibold text-[14px] mb-2">
                      Section {getSection(sec.sectionNo)}
                    </span>

                    {!!sec.coInstructors?.length && (
                      <div className="flex flex-col gap-1">
                        <span className="text-[#3E3E3E] font-semibold">
                          Co-Instructor
                        </span>
                        <div className="ps-1.5 text-secondary mb-2">
                          <List size="sm" listStyleType="disc">
                            {sec.coInstructors?.map((coIns, index) => (
                              <List.Item className="mb-[3px]" key={index}>
                                {coIns?.label}
                              </List.Item>
                            ))}
                          </List>
                        </div>
                      </div>
                    )}

                    <div className="flex flex-col gap-1">
                      <span className="text-[#3E3E3E] font-semibold">
                        Open in Semester
                      </span>
                      <div className="ps-1.5 text-secondary mb-2">
                        <List
                          size="sm"
                          listStyleType="disc"
                          className="flex flex-col gap-1"
                        >
                          <List.Item>
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
              <Button
                color="#575757"
                variant="subtle"
                className="rounded-[8px] text-[12px]   h-[36px] "
                justify="start"
                onClick={prevStep}
              >
                Back
              </Button>
            )}
          </div>
          <Button
            color="#5768d5"
            className="rounded-[8px] text-[12px] h-[36px] w-fit"
            onClick={() => nextStep()}
            rightSection={
              active != 4 && <IconArrowRight stroke={2} size={20} />
            }
          >
            {active == 4 ? "Done" : "Next step"}
          </Button>
        </Group>
      )}
    </Modal>
  );
}
