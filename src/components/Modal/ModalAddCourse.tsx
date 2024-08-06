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
import { COURSE_TYPE } from "@/helpers/constants/enum";
import { IModelCourse } from "@/models/ModelCourse";
import AddCoIcon from "@/assets/icons/addCo.svg?react";
import Icon from "../Icon";
import { getInstructor } from "@/services/user/user.service";
import { IModelUser } from "@/models/ModelUser";
import { TbSearch } from "react-icons/tb";
import { SEMESTER } from "@/helpers/constants/enum";
import { useSearchParams } from "react-router-dom";
import { isNumber } from "lodash";
import { useAppDispatch, useAppSelector } from "@/store";
import { validateEmail } from "@/helpers/functions/validation";
import { createCourse } from "@/services/course/course.service";
import { showNotifications, sortData } from "@/helpers/functions/function";
import { IModelAcademicYear } from "@/models/ModelAcademicYear";
import { setCourseList } from "@/store/course";

type Props = {
  opened: boolean;
  onClose: () => void;
  academicYear: IModelAcademicYear;
};
export default function ModalAddCourse({
  opened,
  onClose,
  academicYear,
}: Props) {
  const user = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();
  const [params, setParams] = useSearchParams();
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

  const validateCourseNameorTopic = (value: string, title: string) => {
    const maxLength = 70;
    if (!value) return `${title} is required`;
    if (!value.trim().length) return "Cannot have only spaces";
    if (value.length > maxLength)
      return `You have ${value.length - 70} characters too many`;
    const isValid = /^[0-9A-Za-z "%&()*+,-./<=>?@[\]\\^_]+$/.test(value);
    return isValid
      ? null
      : `only contain 0-9, a-z, A-Z, space, "%&()*+,-./<=>?@[]\\^_`;
  };

  const form = useForm({
    mode: "uncontrolled",
    initialValues: {
      academicYear: academicYear.id,
      updatedYear: academicYear.year,
      updatedSemester: academicYear.semester,
      sections: [{}],
    } as Partial<IModelCourse>,
    validate: {
      type: (value) => !value && "Course Type is required",
      courseNo: (value) => {
        if (!value) return "Course No. is required";
        const isValid = /^\d{6}$/.test(value.toString());
        return isValid ? null : "Please enter a valid course no";
      },
      courseName: (value) => validateCourseNameorTopic(value!, "Course Name"),
      sections: {
        topic: (value) => validateCourseNameorTopic(value!, "Topic"),
        sectionNo: (value) => {
          if (value === undefined) return "Section No. is required";
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
      res = res.filter((e: any) => e.id != user.id);
      setInstructorOption(
        res.map((e: IModelUser) => {
          return { label: `${e.firstNameEN} ${e.lastNameEN}`, value: e.id };
        })
      );
    };
    fetchIns();
  }, [onClose]);

  useEffect(() => {
    if (swapMethodAddCo) {
      if (insInput.value) setInvalidEmail(!validateEmail(insInput.value));
      else setInvalidEmail(false);
    }
  }, [insInput]);

  const nextStep = async (type?: COURSE_TYPE) => {
    setFirstInput(false);
    let isValid = true;
    const length = form.getValues().sections?.length || 0;
    switch (active) {
      case 0:
        form.setFieldValue("type", type);
        isValid = !form.validateField("type").hasError;
        break;
      case 1:
        isValid =
          (!form.validateField("courseNo").hasError &&
            !form.validateField("courseName").hasError) ||
          (!form.validateField("sections.0.topic").hasError &&
            form.getValues().type == COURSE_TYPE.SEL_TOPIC);
        break;
      case 2:
        for (let i = 0; i < length; i++) {
          isValid = !form.validateField(`sections.${i}.sectionNo`).hasError;
          if (!isValid) break;
        }
        break;
      case 3:
        for (let i = 0; i < length; i++) {
          if (isValid) {
            isValid = !form.validateField(`sections.${i}.semester`).hasError;
          } else {
            form.validateField(`sections.${i}.semester`);
          }
        }
        break;
      case 4:
        // coInsList.forEach((conIns)=>{
        //   if(isValid) {
        //     isValid =
        //   }
        // })
        break;
    }
    if (isValid) {
      setFirstInput(true);
      if (active == 5) {
        await addCourse();
      }
      setActive((cur) => (cur < 5 ? cur + 1 : cur));
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
    const payload = form.getValues();
    payload.sections?.forEach((sec) => {
      sec.coInstructors = sec.coInstructors?.map((coIns) => coIns.value);
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
    let sectionNo: string[] = [...sectionNoList];
    if (sections) {
      const topic = sections[0]?.topic;
      if (!value.length) {
        sections[0].sectionNo = undefined;
        sectionNo = [];
      } else if (sections?.length! > value.length) {
        sections = sections?.slice(0, value.length);
        sectionNo = sectionNo?.slice(0, value.length);
      }
      value.forEach((secNo, index) => {
        if (
          !parseInt(secNo) ||
          secNo.length > 3 ||
          sections?.find((e) => e.sectionNo == parseInt(secNo))
        )
          return;
        else if (sections?.at(index)) {
          sections[index].sectionNo = parseInt(secNo);
          sections[index].instructor = user.id;
          sections[index].coInstructors = [];
          sectionNo[index] = ("000" + secNo).slice(-3);
        } else {
          const data: any = {
            sectionNo: parseInt(secNo),
            instructor: user.id,
            coInstructors: [],
          };
          if (form.getValues().type === COURSE_TYPE.SEL_TOPIC) {
            data.topic = topic;
          }
          sections?.push(data);
          sectionNo.push(("000" + secNo).slice(-3));
        }
      });
    }
    sections.forEach((sec) => sortData(sec.coInstructors!, "label", "string"));
    form.setFieldValue("sections", [...sections]);
    setSectionNoList(sectionNo);
  };

  const addCoIns = () => {
    if (insInput.value) {
      setCoInsList([...coInsList, insInput]);
      const updatedInstructorOptions = instructorOption.map((option) =>
        option.value === insInput.value ? { ...option, disabled: true } : option
      );
      setInstructorOption(updatedInstructorOptions);
      delete insInput.disabled;
      const updatedSections = form.getValues().sections?.map((sec) => {
        const coInsArr = [...(sec.coInstructors ?? []), insInput];
        sortData(coInsArr, "label", "string");
        return {
          ...sec,
          coInstructors: [...coInsArr],
        };
      });
      form.setFieldValue("sections", [...updatedSections!]);
    }
    setInsInput({ value: null });
  };

  const removeCoIns = (coIns: any) => {
    const newCoIns = coInsList.filter((e) => e.value !== coIns.value);
    const updatedInstructorOptions = instructorOption.map((option) =>
      option.value === coIns.value ? { ...option, disabled: false } : option
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

  const addCoInsInSec = (index: number, checked: boolean, coIns: any) => {
    const updatedSections = form.getValues().sections?.map((sec, i) => {
      if (i === index) {
        const coInsArr = [...(sec.coInstructors ?? []), { ...coIns }];
        sortData(coInsArr, "label", "string");
        const updatedCoInstructors = checked
          ? coInsArr
          : (sec.coInstructors ?? []).filter((e) => e.value !== coIns.value);
        return { ...sec, coInstructors: updatedCoInstructors };
      }
      return sec;
    });
    form.setFieldValue("sections", [...updatedSections!]);
  };

  // useEffect(() => {
  //   console.log(form.getValues().sections);
  // }, [form]);

  return (
    <Modal
      opened={opened}
      onClose={closeModal}
      closeOnClickOutside={false}
      title="Add course"
      size="50vw"
      centered
      transitionProps={{ transition: "pop" }}
      classNames={{
        content:
          "flex flex-col justify-center bg-[#F6F7FA] item-center px-2 overflow-hidden",
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
          stepIcon: "mb-2 text-[#E6E6FF] bg-[#E6E6FF]  border-[#E6E6FF]",
          stepBody: "flex-col-reverse m-0 text-[12px] ",
          stepLabel: "text-[12px] font-semibold",
          stepDescription: "text-[12px] font-semibold",
          
        }}
        className=" justify-center items-center mt-1 mb-5 text-[14px] max-h-full"
      >
        <Stepper.Step label="Course Type" description="STEP 1">
          <p className="font-semibold mt-5 text-[15px]">
            Select type of course
          </p>

          <div className="w-full   mt-2 flex flex-col gap-3  bg-transparent rounded-md">
            <Button
              onClick={() => nextStep(COURSE_TYPE.GENERAL)}
              color="#ffffff"
              className="w-ful border-[1px] text-[13px] border-[#d0d0d0] h-fit py-3 !text-[#000000] items-center rounded-[6px] flex justify-start"
            >
              <p className="justify-start flex flex-col">
                <span className="flex justify-start">General Education</span>{" "}
                <br />
                <span className="flex justify-start font-medium text-[12px] text-secondary -mt-1 mb-2">
                  - Learner Person
                </span>
                <span className="flex justify-start font-medium text-[12px] text-secondary  mb-2">
                  - Innovative Co-creator
                </span>
                <span className="flex justify-start font-medium text-[12px] text-secondary  ">
                  - Active Citizen
                </span>
              </p>
            </Button>
            <Button
              onClick={() => nextStep(COURSE_TYPE.GENERAL)}
              color="#ffffff"
              className="w-ful border-[1px] text-[13px] border-[#d0d0d0] h-fit py-3 !text-[#000000] items-center rounded-[6px] flex justify-start"
            >
              {" "}
              <p className="justify-start flex flex-col">
                {" "}
                <span className="flex justify-start">
                  Field of Specialization
                </span>{" "}
                <br />
                <span className="flex justify-start font-medium text-[12px] text-secondary -mt-1 mb-2">
                  - Core Courses
                </span>
                <span className="flex justify-start font-medium text-[12px] text-secondary mb-2">
                  - Major Courses (Required Courses)
                </span>
                <span className="flex justify-start font-medium text-[12px] text-secondary">
                  - Minor Courses
                </span>
              </p>{" "}
            </Button>
            <Button
              onClick={() => nextStep(COURSE_TYPE.SEL_TOPIC)}
              color="#ffffff"
              className="w-ful border-[1px] text-[13px] border-[#d0d0d0] h-fit py-3 !text-[#000000] items-center rounded-[6px] flex justify-start"
            >
              <p className="justify-start flex flex-col">
                <span className="flex justify-start">Major Elective</span>{" "}
                <br />
                <span className="flex justify-start font-medium text-[12px] text-secondary -mt-1 mb-2">
                  - Selected Topics in Computer Software
                </span>
                <span className="flex justify-start font-medium text-[12px] text-secondary mb-2 ">
                  - Selected Topics in Computer Networks
                </span>
                <span className="flex justify-start font-medium text-[12px] text-secondary  ">
                  - Selected Topics in Computational Intelligence
                </span>
              </p>
            </Button>
            <Button
              onClick={() => nextStep(COURSE_TYPE.GENERAL)}
              color="#ffffff"
              className="w-ful border-[1px] text-[13px] border-[#d0d0d0] h-fit py-3 !text-[#000000] items-center rounded-[6px] flex justify-start"
            >
              {" "}
              <p className="justify-start flex flex-col">
                <span className="flex justify-start">Free Elective</span>
              </p>
            </Button>
          </div>
        </Stepper.Step>
        <Stepper.Step label="Course Name" description="STEP 2">
          <div
            className="w-full p-4 mt-2 h-fit  bg-white rounded-md"
            style={{ boxShadow: "0px 0px 4px 0px rgba(0, 0, 0, 0.20)" }}
          >
            <div className="flex flex-col gap-3">
              <TextInput
                classNames={{ input: "focus:border-primary" }}
                label="Course no."
                size="xs"
                withAsterisk
                placeholder={
                  form.getValues().type === COURSE_TYPE.SEL_TOPIC
                    ? "Ex. 26X4XX"
                    : "Ex. 001102"
                }
                maxLength={6}
                {...form.getInputProps("courseNo")}
              />
              <TextInput
                label="Course name"
                withAsterisk
                size="xs"
                classNames={{ input: "focus:border-primary " }}
                placeholder={
                  form.getValues().type === COURSE_TYPE.SEL_TOPIC
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
            </div>
          </div>
        </Stepper.Step>
        <Stepper.Step label="Add Section" description="STEP 3">
          <div className="flex gap-2 flex-row">
            <div
              style={{
                boxShadow: "0px 0px 4px 0px rgba(0, 0, 0, 0.25)",
              }}
              className="w-full h-[200px] bg-white p-4 rounded-md gap-4 flex flex-col"
            >
              <div className="flex flex-col font-medium text-[14px]">
                <span className="text-[#3E3E3E] font-semibold">Course No.</span>
                <span className="text-primary">
                  {form.getValues().courseNo}
                </span>
              </div>
              <div className="flex flex-col font-medium text-[14px]">
                <span className="text-[#3E3E3E] font-semibold">
                  Course Name
                </span>
                <span className="text-primary">
                  {form.getValues().courseName}
                </span>
              </div>
              {form.getValues().sections?.at(0)?.topic && (
                <div className="flex flex-col  font-medium text-[14px]">
                  <span className="text-[#3E3E3E] font-semibold">
                    Course Topic
                  </span>
                  <span className="text-secondary mb-1">
                    {form.getValues().sections?.at(0)?.topic}
                  </span>
                </div>
              )}
            </div>
            <div
              className="w-full p-3   bg-white rounded-md"
              style={{ boxShadow: "0px 0px 4px 0px rgba(0, 0, 0, 0.20)" }}
            >
              <TagsInput
                label="Section"
                withAsterisk
                classNames={{
                  input:
                    "focus:border-secondary h-[145px] mt-1 p-2 text-[12px]  rounded-md",
                  pill: "bg-primary text-white",
                  label: "font-semibold",
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
        <Stepper.Step label="Map Semester" description="STEP 4">
          <div className="flex flex-col max-h-[380px] h-fit w-full mt-2   p-[2px]    overflow-y-scroll  ">
            <div className="flex flex-col font-medium text-[14px] gap-5">
              {form.getValues().sections?.map((e, index) => (
                <div className="flex flex-col gap-1" key={index}>
                  <span className="text-secondary font-semibold">
                    Select Semester for Section{" "}
                    {("000" + e.sectionNo).slice(-3)}
                  </span>
                  <div
                    style={{
                      boxShadow: "0px 0px 4px 0px rgba(0, 0, 0, 0.25)",
                    }}
                    className="w-full p-3 rounded-md gap-2 flex flex-col "
                  >
                    <div className="flex flex-row items-center justify-between">
                      <div className="gap-2 flex flex-col">
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
                          label={`Open in this semester (${params.get(
                            "semester"
                          )}/${params.get("year")?.slice(-2)})`}
                          {...form.getInputProps(
                            `sections.${index}.openThisTerm`,
                            {
                              type: "checkbox",
                            }
                          )}
                        />
                      </div>
                      <Checkbox.Group
                        classNames={{ error: "mt-2" }}
                        {...form.getInputProps(`sections.${index}.semester`)}
                      >
                        <Group className="flex flex-row gap-1 justify-end ">
                          {Object.keys(SEMESTER).map((item) => (
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
                              value={item}
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
        <Stepper.Step label="Co-Instructor" description="STEP 5">
          <div className="flex flex-col gap-5 mt-3 flex-1 ">
            <div
              className="flex flex-col gap-3 max-h-[320px] rounded-md h-fit w-full mt-2 p-4  "
              style={{
                boxShadow: "0px 0px 4px 0px rgba(0, 0, 0, 0.25)",
              }}
            >
              <div
                onClick={() => setSwapMethodAddCo(!swapMethodAddCo)}
                className="bg-[#e6e9ff] hover:bg-[#dee1fa] cursor-pointer h-fit rounded-lg text-secondary flex justify-between items-center p-4"
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
                    label={<p>Add Co-Instructor via CMU account </p>}
                    className="w-full border-none "
                    style={{ boxShadow: "0px 1px 4px 0px rgba(0, 0, 0, 0.05)" }}
                    classNames={{
                      input: " !rounded-r-none ",
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
                    label="Select Co-Instructor"
                    placeholder="Co-Instructor"
                    data={instructorOption}
                    searchable
                    nothingFoundMessage="No result"
                    className="w-full border-none "
                    classNames={{
                      input: " rounded-e-none  rounded-md ",
                    }}
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

            <div
              className="w-full flex flex-col bg-white border-secondary border-[1px]  rounded-md"
              style={{
                boxShadow: "0px 0px 4px 0px rgba(0, 0, 0, 0.25)",
              }}
            >
              <div className="bg-[#e6e9ff] flex gap-3 font-semibold items-center rounded-t-md border-b-secondary border-[1px] px-4 py-3 text-secondary ">
                <IconUsers /> Added Co-Instructor
              </div>
              <div className="flex flex-col max-h-[250px] h-fit w-full   p-4  overflow-y-scroll ">
                <TextInput
                  size="xs"
                  leftSection={<TbSearch />}
                  placeholder="Name"
                  value={searchValue}
                  onChange={(event) =>
                    setSearchValue(event.currentTarget.value)
                  }
                  rightSectionPointerEvents="all"
                />
                <div className="flex flex-col h-[200px] gap-2 overflow-y-scroll p-1">
                  {coInsList.map(
                    (coIns, index) =>
                      (!searchValue.length ||
                        coIns.label
                          .toLowerCase()
                          .includes(searchValue.toLowerCase())) && (
                        <div
                          key={index}
                          style={{
                            boxShadow: "0px 0px 4px 0px rgba(0, 0, 0, 0.25)",
                          }}
                          className="w-full mt-2 h-fit p-4 rounded-md gap-4 flex flex-col"
                        >
                          <div className="flex w-full justify-between items-center">
                            <div className="flex flex-col  font-medium text-[14px]">
                              <span className="text-[#3E3E3E] font-semibold">
                                {coIns.label ? "Name" : "Email"}
                              </span>
                              <span className="text-secondary text-[14px]">
                                {coIns.label ?? coIns.value}
                              </span>
                            </div>
                            <Button
                              className="text-[12px]  rounded-md"
                              size="xs"
                              color="#FF4747"
                              onClick={() => removeCoIns(coIns)}
                            >
                              Remove
                            </Button>
                          </div>
                          <div className="flex flex-col gap-3 font-medium text-[14px]">
                            <span className="text-[#3E3E3E] font-semibold">
                              Can access
                            </span>

                            <Checkbox.Group>
                              <Group className="flex flex-col w-fit">
                                {sectionNoList.map((sectionNo, index) => (
                                  <Checkbox
                                    key={index}
                                    classNames={{
                                      input:
                                        "bg-black bg-opacity-0 border-[1.5px] border-[#3E3E3E] cursor-pointer disabled:bg-gray-400",
                                      body: "mr-3",
                                      label: "text-[14px]",
                                    }}
                                    color="#5768D5"
                                    size="xs"
                                    label={`Section ${sectionNo}`}
                                    checked={form
                                      .getValues()
                                      .sections?.find(
                                        (sec: any) =>
                                          sec.sectionNo == parseInt(sectionNo)
                                      )
                                      ?.coInstructors?.includes(coIns)}
                                    onChange={(event) =>
                                      addCoInsInSec(
                                        index,
                                        event.currentTarget.checked,
                                        coIns
                                      )
                                    }
                                  />
                                ))}
                              </Group>
                            </Checkbox.Group>
                            <div className="flex flex-col gap-2 w-full">
                              {sectionNoList.map((sectionNo, index) => (
                                <Checkbox
                                  key={index}
                                  classNames={{
                                    input:
                                      "bg-black bg-opacity-0 border-[1.5px] border-[#3E3E3E] cursor-pointer disabled:bg-gray-400",
                                    body: "mr-3",
                                    label: "text-[14px]",
                                  }}
                                  color="#5768D5"
                                  size="xs"
                                  label={`Section ${sectionNo}`}
                                  checked={form
                                    .getValues()
                                    .sections?.find(
                                      (sec) =>
                                        sec.sectionNo == parseInt(sectionNo)
                                    )
                                    ?.coInstructors?.some(
                                      (coins) => coins.value == coIns.value
                                    )}
                                  onChange={(event) =>
                                    addCoInsInSec(
                                      index,
                                      event.currentTarget.checked,
                                      coIns
                                    )
                                  }
                                />
                              ))}
                            </div>
                          </div>
                        </div>
                      )
                  )}
                </div>
              </div>
            </div>
          </div>
        </Stepper.Step>
        <Stepper.Step label="Review" description="STEP 6">
          <div className="flex flex-row gap-3 mt-3   font-medium text-[14px]">
            <div
              className=" flex flex-col w-[40%] p-4 rounded-md gap-4 "
              style={{
                boxShadow: "0px 0px 4px 0px rgba(0, 0, 0, 0.25)",
              }}
            >
              <div className="flex flex-col ">
                <span className="text-[#3E3E3E] font-semibold">Course No.</span>
                <span className="text-secondary">
                  {form.getValues().courseNo}
                </span>
              </div>

              <div className="flex flex-col">
                <span className="text-[#3E3E3E] font-semibold">
                  Course Name
                </span>
                <span className="text-secondary">
                  {form.getValues().courseName}
                </span>
              </div>
              {form.getValues().sections?.at(0)?.topic && (
                <div className="flex flex-col   font-medium text-[14px]">
                  <span className="text-[#3E3E3E] font-semibold">
                    Course Topic
                  </span>
                  <span className="text-secondary">
                    {form.getValues().sections?.at(0)?.topic}
                  </span>
                </div>
              )}
            </div>

            <div
              className="flex flex-col w-[60%] rounded-md max-h-[350px] h-fit   overflow-y-scroll"
              style={{
                boxShadow: "0px 0px 4px 0px rgba(0, 0, 0, 0.25)",
              }}
            >
              {form.getValues().sections?.map((sec, index) => (
                <div
                  key={index}
                  className="w-full border-b-[2px]  h-fit px-4 py-3   gap-1 flex flex-col"
                >
                  <span className="text-secondary font-semibold mb-2">
                    Section {("000" + sec.sectionNo).slice(-3)}
                  </span>

                  <div className="flex flex-col gap-1">
                    <span className="text-[#3E3E3E] font-semibold">
                      Main Instructor
                    </span>
                    <div className="ps-1.5 text-secondary ">
                      <List size="sm" listStyleType="disc">
                        <List.Item>
                          {user.firstNameEN} {user.lastNameEN}
                        </List.Item>
                      </List>
                    </div>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-[#3E3E3E] font-semibold">
                      Co-Instructor
                    </span>
                    <div className="ps-1.5 text-secondary">
                      <List size="sm" listStyleType="disc">
                        {sec.coInstructors?.map((coIns, index) => (
                          <List.Item key={index}>{coIns?.label}</List.Item>
                        ))}
                      </List>
                  {!!sec.coInstructors?.length && (
                    <div className="flex flex-col gap-1">
                      <span className="text-[#3E3E3E] font-semibold">
                        Co-Instructor
                      </span>
                      <div className="ps-1.5 text-secondary">
                        <List size="sm" listStyleType="disc">
                          {sec.coInstructors?.map((coIns, index) => (
                            <List.Item key={index}>{coIns?.label}</List.Item>
                          ))}
                        </List>
                      </div>
                    </div>
                  )}

                  <div className="flex flex-col gap-1">
                    <span className="text-[#3E3E3E] font-semibold">
                      Open in Semester
                    </span>
                    <div className="ps-1.5 text-secondary">
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
                          <List.Item>
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
              active != 5 && <IconArrowRight stroke={2} size={20} />
            }
          >
            {active == 5 ? "Done" : "Next step"}
          </Button>
        </Group>
      )}
    </Modal>
  );
}
