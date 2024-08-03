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
  Input,
  List,
} from "@mantine/core";
import { FORM_INDEX, useForm } from "@mantine/form";
import {
  IconChevronDown,
  IconCircleFilled,
  IconChevronRight,
  IconArrowRight,
  IconUsers,
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
import { useAppSelector } from "@/store";

type Props = {
  opened: boolean;
  onClose: () => void;
};
export default function ModalAddCourse({ opened, onClose }: Props) {
  const user = useAppSelector((state) => state.user);
  const [params, setParams] = useSearchParams();
  const [active, setActive] = useState(4);
  const [openedDropdown, setOpenedDropdown] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [instructorOption, setInstructorOption] = useState<any[]>([]);
  const [sectionNoList, setSectionNoList] = useState<string[]>([]);
  const [insInput, setInsInput] = useState<any>();
  const [coInsList, setCoInsList] = useState<any[]>([]);
  const [swapMethodAddCo, setSwapMethodAddCo] = useState(false);

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
    initialValues: { sections: [{}] } as Partial<IModelCourse>,
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

  const nextStep = () => {
    let isValid = true;
    const length = form.getValues().sections?.length || 0;
    switch (active) {
      case 0:
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
        break;
    }
    if (isValid) {
      if (active == 5) closeModal();
      setActive((cur) => (cur < 5 ? cur + 1 : cur));
    }
  };
  const prevStep = () => setActive((cur) => (cur > 0 ? cur - 1 : cur));
  const closeModal = () => {
    setActive(0);
    setSectionNoList([]);
    setInsInput(undefined);
    setCoInsList([]);
    form.reset();
    onClose();
  };

  const setSectionList = (value: string[]) => {
    let sections = form.getValues().sections;
    let sectionNo: string[] = [...sectionNoList];
    if (sections && sections.length) {
      const topic = sections[0].topic;
      if (!value.length) {
        sections = sections?.slice(0, 1);
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
          sections[index].topic = topic;
          sections[index].sectionNo = parseInt(secNo);
          sectionNo[index] = ("000" + secNo).slice(-3);
        } else {
          sections?.push({ topic, sectionNo: parseInt(secNo) });
          sectionNo.push(("000" + secNo).slice(-3));
        }
      });
    }
    form.setFieldValue("sections", [...sections!]);
    setSectionNoList(sectionNo);
  };

  const addCoIns = () => {
    if (insInput) {
      setCoInsList([...coInsList, insInput]);
      const updatedInstructorOptions = instructorOption.map((option) =>
        option.value === insInput.value ? { ...option, disabled: true } : option
      );
      setInstructorOption(updatedInstructorOptions);
    }
    setInsInput(undefined);
  };

  const removeCoIns = (coIns: any) => {
    const newCoIns = coInsList.filter((e) => e.value !== coIns.value);
    const insOption: any[] = [];
    instructorOption.forEach((e) => {
      if (e.value == coIns.value) {
        insOption.push({ ...coIns, disabled: false });
      } else {
        insOption.push(e);
      }
    });
    let sections = form.getValues().sections;
    sections?.forEach((e) => {
      e.coInstructors = e.coInstructors?.filter(
        (p) => p != coIns.value
      ) as string[];
    });
    form.setFieldValue("sections", [...sections!]);
    setInstructorOption(insOption);
    setCoInsList(newCoIns);
  };

  const addCoInsInSec = (index: number, checked: boolean, value: string) => {
    let coInstructors: string[] =
      (form.getValues().sections?.at(index)?.coInstructors as string[]) ?? [];
    if (checked) {
      coInstructors?.push(value);
    } else {
      coInstructors = coInstructors?.filter((e) => e != value);
    }
    form.setFieldValue(`sections.${index}.coInstructors`, coInstructors);
  };

  useEffect(() => {
    console.log(form.getValues().sections);
  }, [form, insInput]);

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
        icon={<IconCircleFilled size={300} />}
        classNames={{
          separator: "text-primary -mx-2 mb-12 h-[3px] -translate-x-6",
          step: "flex flex-col  items-start mr-2",
          stepIcon: "mb-2 text-[#E6E6FF] bg-[#E6E6FF]  border-[#E6E6FF]",
          stepBody: "flex-col-reverse m-0 ",
          stepLabel: "text-[14px]",
        }}
        className=" justify-center items-center mt-1 mb-5 text-[14px] max-h-full"
      >
        <Stepper.Step label="Course Type" description="STEP 1">
          <div
            className="w-full px-4 py-[1px] mt-2 bg-white rounded-md"
            style={{ boxShadow: "0px 0px 4px 0px rgba(0, 0, 0, 0.20)" }}
          >
            <Select
              clearable
              withAsterisk
              rightSectionPointerEvents="none"
              label="Type of Course"
              placeholder="Select Type of Course"
              data={[COURSE_TYPE.GENERAL, COURSE_TYPE.SEL_TOPIC]}
              {...form.getInputProps("type")}
              allowDeselect={false}
              withCheckIcon={false}
              className="rounded-md my-5 border-none mb-8"
              classNames={{
                label: "font-medium mb-1 text-[14px] text-[#3E3E3E]",
                input: "text-primary font-medium focus:border-primary",
                option: "hover:bg-hover text-primary font-medium",
                dropdown: "drop-shadow-[0_0px_4px_rgba(0,0,0,0.30)]",
              }}
              rightSection={
                <IconChevronDown
                  className={`${
                    openedDropdown ? "rotate-180" : ""
                  } stroke-primary stroke-2`}
                />
              }
              onDropdownOpen={() => setOpenedDropdown(true)}
              onDropdownClose={() => setOpenedDropdown(false)}
            />
          </div>
        </Stepper.Step>
        <Stepper.Step label="Course Name" description="STEP 2">
          <div
            className="w-full p-5 mt-2  bg-white rounded-md"
            style={{ boxShadow: "0px 0px 4px 0px rgba(0, 0, 0, 0.20)" }}
          >
            <div className="flex flex-col gap-4">
              <TextInput
                classNames={{ input: "focus:border-primary " }}
                label="Course no."
                withAsterisk
                placeholder={
                  form.getValues().type === COURSE_TYPE.SEL_TOPIC
                    ? "Ex. 26X4XX"
                    : "Ex. 001102"
                }
                {...form.getInputProps("courseNo")}
              />
              <TextInput
                label="Course name"
                withAsterisk
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
                  classNames={{ input: "focus:border-primary" }}
                  placeholder="Ex. Full Stack Development"
                  {...form.getInputProps("sections.0.topic")}
                />
              )}
            </div>
          </div>
        </Stepper.Step>
        <Stepper.Step label="Add Section" description="STEP 3">
          <div
            style={{
              boxShadow: "0px 0px 4px 0px rgba(0, 0, 0, 0.25)",
            }}
            className="w-full mt-2 te h-full bg-white p-4 rounded-md gap-4 flex flex-col"
          >
            <div className="flex flex-col gap-1  font-medium text-[14px]">
              <span className="text-[#3E3E3E]">Course No.</span>
              <span className="text-primary">{form.getValues().courseNo}</span>
            </div>
            <div className="flex flex-col gap-1  font-medium text-[14px]">
              <span className="text-[#3E3E3E]">Course Name</span>
              <span className="text-primary">
                {form.getValues().courseName}
              </span>
            </div>
            {form.getValues().sections?.at(0)?.topic && (
              <div className="flex flex-col gap-1  font-medium text-[14px]">
                <span className="text-[#3E3E3E]">Course Topic</span>
                <span className="text-primary">
                  {form.getValues().sections?.at(0)?.topic}
                </span>
              </div>
            )}
          </div>
          <div
            className="w-full p-5 py-4 mt-5  bg-white rounded-md"
            style={{ boxShadow: "0px 0px 4px 0px rgba(0, 0, 0, 0.20)" }}
          >
            <TagsInput
              label="Section"
              withAsterisk
              classNames={{
                input:
                  "focus:border-primary h-[140px] p-3 mb-3 px-3 rounded-lg",
                pill: "bg-primary text-white",
              }}
              placeholder="Ex. 001 or 1 (Press Enter for fill the next section)"
              splitChars={[",", " ", "|"]}
              {...form.getInputProps(`section.sectionNo`)}
              error={form.validateField(`sections.0.sectionNo`).error}
              value={sectionNoList}
              onChange={setSectionList}
            ></TagsInput>
            <p>{form.validateField("sections.sectionNo").error}</p>
          </div>
        </Stepper.Step>
        <Stepper.Step label="Map Semester" description="STEP 4">
          <div
            style={{
              boxShadow: "0px 0px 4px 0px rgba(0, 0, 0, 0.25)",
            }}
            className="flex flex-col max-h-[320px] h-fit w-full mt-2  p-4   rounded-md  overflow-y-scroll  "
          >
            <div className="flex flex-col font-medium text-[14px] gap-5">
              {form.getValues().sections?.map((e, index) => (
                <div className="flex flex-col gap-1">
                  <span className="text-primary">
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
                        <span>Open Semester</span>
                        <Checkbox
                          classNames={{
                            input:
                              "bg-[black] bg-opacity-0 border-[1.5px] border-[#3E3E3E] cursor-pointer disabled:bg-gray-400",
                            body: "mr-3",
                            label: "text-[14px] text-[#615F5F] ",
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
                        className=""
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
                                label: "text-[14px]",
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
              onClick={() => setSwapMethodAddCo(!swapMethodAddCo)}
              className="bg-[#e6e9ff] hover:bg-[#dee1fa] cursor-pointer  h-fit rounded-lg text-secondary flex justify-between items-center p-4   "
            >
              <div className="flex gap-6">
                <Icon IconComponent={AddCoIcon} className="text-secondary" />
                <p>
                  Add Co-Instructor by using{" "}
                  <span className="font-semibold">
                    {swapMethodAddCo ? "Dropdown list" : "CMU Account"}
                  </span>
                </p>
              </div>
              <IconChevronRight stroke={2} />
            </div>

            <div className="flex w-full items-end h-fit ">
              {swapMethodAddCo ? (
                <TextInput
                  label={
                    <p>
                      Add Co-Instructor via CMU account{" "}
                      <span className=" text-red-500">
                        (make sure CMU account correct)
                      </span>
                    </p>
                  }
                  className="w-full border-none "
                  style={{ boxShadow: "0px 1px 4px 0px rgba(0, 0, 0, 0.05)" }}
                  classNames={{
                    label: "font-medium mb-1 text-[14px] text-[#3E3E3E]",
                    input:
                      "text-primary font-medium focus:border-primary rounded-e-none cursor-pointer",
                  }}
                  placeholder="example@cmu.ac.th"
                ></TextInput>
              ) : (
                <Select
                  rightSectionPointerEvents="none"
                  label="Select Co-Instructor to add"
                  placeholder="Select Instructor"
                  data={instructorOption}
                  allowDeselect
                  withCheckIcon={false}
                  searchable
                  className="w-full border-none "
                  style={{ boxShadow: "0px 1px 4px 0px rgba(0, 0, 0, 0.05)" }}
                  classNames={{
                    label: "font-medium mb-1 text-[14px] text-[#3E3E3E]",
                    input:
                      "text-primary font-medium focus:border-primary rounded-e-none cursor-pointer",
                    option: "hover:bg-[#DDDDF6] text-primary font-medium",
                    dropdown: "drop-shadow-[0_0px_4px_rgba(0,0,0,0.30)]",
                  }}
                  rightSection={
                    <IconChevronDown
                      className={`${
                        openedDropdown ? "rotate-180" : ""
                      } stroke-primary stroke-2`}
                    />
                  }
                  onDropdownOpen={() => setOpenedDropdown(true)}
                  onDropdownClose={() => setOpenedDropdown(false)}
                  value={insInput?.value}
                  onChange={(value, option) => setInsInput(option)}
                />
              )}
              <Button
                className="rounded-s-none w-[12%]"
                color="#5768D5"
                onClick={addCoIns}
              >
                Add
              </Button>
            </div>

            <div
              className="w-full flex flex-col bg-white border-secondary border-[1px]  rounded-md"
              style={{
                boxShadow: "0px 0px 4px 0px rgba(0, 0, 0, 0.25)",
              }}
            >
              <div className="bg-[#e6e9ff] flex gap-3 items-center rounded-t-md border-b-secondary border-[1px] px-4 py-3 text-secondary font-medium">
                <IconUsers/> Added Co-Instructor
              </div>
              <div className="flex flex-col max-h-[250px] h-fit w-full   p-4  overflow-y-scroll ">
                <Input
                  leftSection={<TbSearch />}
                  placeholder="Name"
                  value={searchValue}
                  onChange={(event) =>
                    setSearchValue(event.currentTarget.value)
                  }
                  className="focus:border-none px-1"
                  classNames={{ input: "bg-gray-200 rounded-md border-none" }}
                  rightSectionPointerEvents="all"
                />
                <div className="flex flex-col h-[200px] gap-2 overflow-y-scroll p-1">
                  {coInsList.map(
                    (e) =>
                      (!searchValue.length ||
                        e.label
                          .toLowerCase()
                          .includes(searchValue.toLowerCase())) && (
                        <div
                          style={{
                            boxShadow: "0px 0px 4px 0px rgba(0, 0, 0, 0.25)",
                          }}
                          className="w-full mt-2 h-fit p-4 rounded-md gap-4 flex flex-col"
                        >
                          <div className="flex w-full justify-between items-center">
                            <div className="flex flex-col gap-1 font-medium text-[14px]">
                              <span className="text-[#3E3E3E]">Name</span>
                              <span className="text-primary text-[14px]">
                                {e.label}
                              </span>
                            </div>
                            <Button
                              className="px-3 h-3/4 rounded-lg"
                              color="#FF4747"
                              onClick={() => removeCoIns(e)}
                            >
                              Remove
                            </Button>
                          </div>
                          <div className="flex flex-col gap-3.5 font-medium text-[14px]">
                            <span className="text-[#3E3E3E] ">Can access</span>
                            <Checkbox.Group>
                              <Group className="flex flex-col w-fit">
                                {sectionNoList.map((sectionNo, index) => (
                                  <Checkbox
                                    classNames={{
                                      input:
                                        "bg-black bg-opacity-0 border-[1.5px] border-[#3E3E3E] cursor-pointer disabled:bg-gray-400",
                                      body: "mr-3",
                                      label: "text-[14px]",
                                    }}
                                    color="#5768D5"
                                    size="xs"
                                    label={`Section ${sectionNo}`}
                                    // value={}
                                    onChange={(event) =>
                                      addCoInsInSec(
                                        index,
                                        event.currentTarget.checked,
                                        e.value
                                      )
                                    }
                                  />
                                ))}
                              </Group>
                            </Checkbox.Group>
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
          <div className="flex flex-col gap-4 mt-3 font-medium text-[14px]">
            <div
              style={{
                boxShadow: "0px 0px 4px 0px rgba(0, 0, 0, 0.25)",
              }}
              className=" flex flex-col flex-1 p-4 rounded-md gap-4 "
            >
              <div className="flex flex-col gap-1 ">
                <span className="text-[#3E3E3E]">Course No.</span>
                <span className="text-primary">
                  {form.getValues().courseNo}
                </span>
              </div>

              <div className="flex flex-col gap-1">
                <span className="text-[#3E3E3E]">Course Name</span>
                <span className="text-primary">
                  {form.getValues().courseName}
                </span>
              </div>
              {form.getValues().sections?.at(0)?.topic && (
                <div className="flex flex-col gap-1  font-medium text-[14px]">
                  <span className="text-[#3E3E3E]">Course Topic</span>
                  <span className="text-primary">
                    {form.getValues().sections?.at(0)?.topic}
                  </span>
                </div>
              )}
            </div>

            <div className="flex flex-col gap-2  ">
              <span className="text-[#3E3E3E] ">Review</span>
              <div
                style={{
                  boxShadow: "0px 0px 4px 0px rgba(0, 0, 0, 0.25)",
                }}
                className=" flex flex-col flex-1 rounded-md gap-4"
              >
                <div className="flex flex-col p-4 h-[200px] gap-4 overflow-y-scroll">
                  {}
                  <div
                    style={{
                      boxShadow: "0px 0px 4px 0px rgba(0, 0, 0, 0.25)",
                    }}
                    className="w-full  h-fit p-4 rounded-md gap-4 flex flex-col"
                  >
                    <span className="text-[#3E3E3E]">Section 803</span>

                    <div className="flex flex-col gap-1">
                      <span className="text-[#3E3E3E]">Main Instructor</span>
                      <div className="ps-1.5 text-primary ">
                        <List size="sm" listStyleType="disc">
                          <List.Item>Arnan Sripitakiat</List.Item>
                        </List>
                      </div>
                    </div>

                    <div className="flex flex-col gap-1">
                      <span className="text-[#3E3E3E]">Co-Instructor</span>
                      <div className="ps-1.5 text-primary">
                        <List size="sm" listStyleType="disc">
                          <List.Item>Dome Potikanond</List.Item>
                        </List>
                      </div>
                    </div>

                    <div className="flex flex-col gap-1">
                      <span className="text-[#3E3E3E]">Open in Semester</span>
                      <div className="ps-1.5 text-primary">
                        <List
                          size="sm"
                          listStyleType="disc"
                          className="flex flex-col gap-1"
                        >
                          <List.Item>1, 2 and 3</List.Item>
                          <List.Item>Open in this semester (3/66)</List.Item>
                        </List>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Stepper.Step>
      </Stepper>

      <Group className="flex w-full h-fit items-end justify-between">
        <div>
          {active > 0 && (
            <Button
              color="#E3E5EB"
              className="rounded-[10px]   items-center text-black hover:text-black justify-center h-[36px]  border-0"
              justify="start"
              onClick={prevStep}
            >
              Back
            </Button>
          )}
        </div>
        <Button
          color="#6869AD"
          className="rounded-[10px] h-[36px] w-fit"
          onClick={nextStep}
          rightSection={
            active != 5 && <IconArrowRight stroke={2} className="ml-1" />
          }
        >
          {active == 5 ? "Done" : "Next step"}
        </Button>
      </Group>
    </Modal>
  );
}
