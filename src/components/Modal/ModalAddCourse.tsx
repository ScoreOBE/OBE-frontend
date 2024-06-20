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
import { useForm } from "@mantine/form";
import {
  IconChevronDown,
  IconCircleFilled,
  IconChevronRight,
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

type Props = {
  opened: boolean;
  onClose: () => void;
};
export default function ModalAddCourse({ opened, onClose }: Props) {
  const [params, setParams] = useSearchParams();
  const [active, setActive] = useState(0);
  const [openedDropdown, setOpenedDropdown] = useState(false);
  const [instructorOption, setInstructorOption] = useState([]);

  const validateCourseNameorTopic = (value: string) => {
    const maxLength = 70;
    if (!value) return "Course Name is required";
    if (!value.trim().length) return "Cannot have only spaces";
    if (value.length > maxLength)
      return `You have ${value.length - 70} characters too many`;
    const isValid = /^[0-9A-Za-z !"%&'()*+\-.<=>?@[\]\\^_]+$/.test(value);
    return isValid
      ? null
      : `only contain 0-9, a-z, A-Z, space, !"%&()*+'-.<=>?@[]\\^-`;
  };

  const form = useForm({
    initialValues: { sections: [] } as Partial<IModelCourse>,
    validate: {
      type: (value) => {
        return !value && "Course Type is required";
      },
      courseNo: (value) => {
        if (!value) return "Course No. is required";
        const isValid = /^\d{6}$/.test(value.toString());
        return isValid ? null : "Please enter a valid course no";
      },
      courseName: (value) => validateCourseNameorTopic(value!),
      // sections: (value) => validateCourseNameorTopic(value!),
    },
    validateInputOnBlur: true,
  });

  useEffect(() => {
    const fetchIns = async () => {
      const res = await getInstructor();
      setInstructorOption(
        res.map((e: IModelUser) => {
          return { label: `${e.firstNameEN} ${e.lastNameEN}`, value: e.id };
        })
      );
    };
    fetchIns();
  }, []);

  const nextStep = () => {
    let isValid = true;
    switch (active) {
      case 0:
        isValid = !form.validateField("type").hasError;
        break;
      case 1:
        isValid =
          !form.validateField("courseNo").hasError &&
          !form.validateField("courseName").hasError;
        break;
      case 2:
        break;
      case 3:
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
    form.reset();
    onClose();
  };

  useEffect(() => {
    console.log(form.getValues().sections);
  }, [form]);

  return (
    <Modal
      opened={opened}
      onClose={closeModal}
      closeOnClickOutside={false}
      title="Add course"
      size="50vw"
      radius={"12px"}
      centered
      transitionProps={{ transition: "pop" }}
      classNames={{
        title: "text-primary font-semibold text-[18px]",
        content:
          "flex flex-col justify-center item-center px-2 overflow-hidden",
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
        className=" justify-center items-center mt-3 text-[14px] max-h-full"
      >
        <Stepper.Step label="Course Type" description="STEP 1">
          <Select
            clearable
            label="Type of Course"
            placeholder="Select Type of Course"
            data={[COURSE_TYPE.GENERAL, COURSE_TYPE.SEL_TOPIC]}
            {...form.getInputProps("type")}
            allowDeselect={false}
            withCheckIcon={false}
            className="rounded-md my-5 border-none mb-8"
            style={{ boxShadow: "0px 1px 4px 0px rgba(0, 0, 0, 0.05)" }}
            classNames={{
              label: "font-medium mb-1 text-[14px] text-[#3E3E3E]",
              input: "text-primary font-medium focus:border-primary",
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
          />
        </Stepper.Step>
        <Stepper.Step label="Course Name" description="STEP 2">
          <div className="flex flex-col gap-4 mt-3">
            <TextInput
              classNames={{ input: "focus:border-primary " }}
              label="Course no."
              placeholder={
                form.getValues().type === COURSE_TYPE.SEL_TOPIC
                  ? "Ex. 26X4XX"
                  : "Ex. 001102"
              }
              {...form.getInputProps("courseNo")}
            />
            <TextInput
              label="Course name"
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
                classNames={{ input: "focus:border-primary" }}
                placeholder="Ex. Full Stack Development"
                {...form.getInputProps("sections.topic")}
              />
            )}
          </div>
        </Stepper.Step>
        <Stepper.Step label="Add Section" description="STEP 3">
          <div
            style={{
              boxShadow: "0px 0px 4px 0px rgba(0, 0, 0, 0.25)",
            }}
            className="w-full mt-2 te h-full p-4 rounded-md gap-4 flex flex-col"
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
            {form.getValues().type === COURSE_TYPE.SEL_TOPIC && (
              <div className="flex flex-col gap-1  font-medium text-[14px]">
                <span className="text-[#3E3E3E]">Course Topic</span>
                <span className="text-primary">
                  {/* รอใส่ข้อมูล Topic {form.getValues().____} */}
                  Test Course Topic
                </span>
              </div>
            )}
          </div>
          <div className="text-[#3E3E3E] mt-4 mb-1 font-medium text-[14px]">
            Section
          </div>
          <TagsInput
            classNames={{
              input:
                "focus:border-primary active:border-primary h-[140px] p-3 px-3",
              pill: "bg-primary text-white",
            }}
            placeholder="Fill Section Number Ex. 001 or 1 (Press Enter for fill the next section)"
            {...form.getInputProps("sections")}
            value={form.getValues().sections?.map((e) => ("000" + e).slice(-3))}
            onChange={(sections) => {
              form.setFieldValue(
                "sections",
                sections.map((section) => section.replace(/^0+/, ""))
              );
            }}
          ></TagsInput>
        </Stepper.Step>
        <Stepper.Step label="Map Semester" description="STEP 4">
          <div
            style={{
              boxShadow: "0px 0px 4px 0px rgba(0, 0, 0, 0.25)",
            }}
            className="flex flex-col gap-5 h-[350px] w-full mt-2  p-4  rounded-md  overflow-y-scroll  "
          >
            <div className="flex flex-col font-medium text-[14px] gap-1">
              <span className="text-primary">
                Select Semester for Section 803
              </span>
              <div
                style={{
                  boxShadow: "0px 0px 4px 0px rgba(0, 0, 0, 0.25)",
                }}
                className="w-full p-3 rounded-md gap-2 flex flex-col "
              >
                <div className="flex flex-row items-center justify-between">
                  <span>Open Semester</span>
                  <div className="flex flex-row gap-1">
                    {Object.keys(SEMESTER).map((e) => (
                      <Checkbox
                        classNames={{
                          input:
                            "bg-black bg-opacity-0 border-[1.5px] border-[#3E3E3E] cursor-pointer disabled:bg-gray-400",
                          body: "mr-3",
                          label: "text-[14px]",
                        }}
                        color="#5768D5"
                        size="xs"
                        value={e}
                        label={e}
                        // checked={isChecked}
                        // disabled={disabled}
                        readOnly
                      />
                    ))}
                  </div>
                </div>

                <Checkbox
                  classNames={{
                    input:
                      "bg-[black] bg-opacity-0 border-[1.5px] border-[#3E3E3E] cursor-pointer disabled:bg-gray-400",
                    body: "mr-3",
                    label: "text-[14px] text-[#615F5F] ",
                  }}
                  color="#5768D5"
                  size="xs"
                  value={"1"}
                  label={`Open in this semester (${params.get(
                    "semester"
                  )}/${params.get("year")?.slice(-2)})`}
                  // checked={isChecked}
                  // disabled={disabled}
                  readOnly
                />
              </div>
            </div>
          </div>
        </Stepper.Step>
        <Stepper.Step label="Co-Instructor" description="STEP 5">
          <div className="flex flex-col gap-5 mt-3 flex-1 ">
            <div className="bg-[#F4F5FE]  h-12 rounded-lg text-secondary flex justify-between items-center px-6   ">
              <div className="flex gap-6">
                <Icon IconComponent={AddCoIcon} className="text-secondary" />
                <p>
                  Add Co-Instructor by using{" "}
                  <span className="font-semibold"> CMU Account</span>
                </p>
              </div>
              <IconChevronRight stroke={2} />
            </div>
            <div className="flex w-full items-end h-fit ">
              <Select
                clearable
                label="Add Co-Instrcutor"
                placeholder="Select Instructor"
                data={instructorOption}
                allowDeselect={false}
                withCheckIcon={false}
                searchable
                className="w-full border-none "
                style={{ boxShadow: "0px 1px 4px 0px rgba(0, 0, 0, 0.05)" }}
                classNames={{
                  label: "font-medium mb-1 text-[14px] text-[#3E3E3E]",
                  input:
                    "text-primary font-medium focus:border-primary rounded-e-none ",
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
              />
              <Button className="rounded-s-none w-[12%]" color="#5768D5">
                Add
              </Button>
            </div>
            <div
              style={{
                boxShadow: "0px 0px 4px 0px rgba(0, 0, 0, 0.25)",
              }}
              className="w-full mt-2  h-full p-4 rounded-md gap-1.5 flex flex-col "
            >
              <Input
                leftSection={<TbSearch />}
                placeholder="Name"
                // value={searchValue}
                // onChange={(event) => setSearchValue(event.currentTarget.value)}
                // onKeyDown={(event) => event.key == "Enter" && searchCourse()}
                // onInput={() => setIsFocused(true)}
                className="focus:border-none px-1"
                classNames={{ input: "bg-gray-200 rounded-md border-none" }}
                rightSectionPointerEvents="all"
              />
              <div className="flex flex-col h-[200px] gap-4 overflow-y-scroll p-1">
                <div
                  style={{
                    boxShadow: "0px 0px 4px 0px rgba(0, 0, 0, 0.25)",
                  }}
                  className="w-full mt-2 h-fit p-4 rounded-md gap-4 flex flex-col"
                >
                  <div className="flex w-full justify-between items-center">
                    <div className="flex flex-col gap-1 font-medium text-[14px]">
                      <span className="text-[#3E3E3E] ">Name</span>
                      <span className="text-primary text-[14px]">
                        Switch Thanaporn
                      </span>
                    </div>
                    <Button
                      className=" px-3 h-3/4 rounded-lg  "
                      color="#FF4747"
                    >
                      Remove
                    </Button>
                  </div>
                  <div className="flex flex-col gap-3.5 font-medium text-[14px]">
                    <span className="text-[#3E3E3E] ">Can access</span>
                    <Checkbox
                      classNames={{
                        input:
                          "bg-black bg-opacity-0 border-[1.5px] border-[#3E3E3E] cursor-pointer disabled:bg-gray-400",
                        body: "mr-3",
                        label: "text-[14px]",
                      }}
                      color="#5768D5"
                      size="xs"
                      value={"001"}
                      label="Section 001"
                      // checked={isChecked}
                      // disabled={disabled}
                      readOnly
                    />
                    <Checkbox
                      classNames={{
                        input:
                          "bg-black bg-opacity-0 border-[1.5px] border-[#3E3E3E] cursor-pointer disabled:bg-gray-400",
                        body: "mr-3",
                        label: "text-[14px]",
                      }}
                      color="#5768D5"
                      size="xs"
                      value={"001"}
                      label="Section 001"
                      // checked={isChecked}
                      // disabled={disabled}
                      readOnly
                    />
                    <Checkbox
                      classNames={{
                        input:
                          "bg-black bg-opacity-0 border-[1.5px] border-[#3E3E3E] cursor-pointer disabled:bg-gray-400",
                        body: "mr-3",
                        label: "text-[14px]",
                      }}
                      color="#5768D5"
                      size="xs"
                      value={"001"}
                      label="Section 001"
                      // checked={isChecked}
                      // disabled={disabled}
                      readOnly
                    />
                  </div>
                </div>
                <div
                  style={{
                    boxShadow: "0px 0px 4px 0px rgba(0, 0, 0, 0.25)",
                  }}
                  className="w-full mt-2 h-fit p-4 rounded-md gap-4 flex flex-col"
                >
                  <div className="flex w-full justify-between items-center">
                    <div className="flex flex-col gap-1 font-medium text-[14px]">
                      <span className="text-[#3E3E3E] ">Name</span>
                      <span className="text-primary text-[14px]">
                        Switch Thanaporn
                      </span>
                    </div>
                    <Button
                      className=" px-3 h-3/4 rounded-lg  "
                      color="#FF4747"
                    >
                      Remove
                    </Button>
                  </div>
                  <div className="flex flex-col gap-3.5 font-medium text-[14px]">
                    <span className="text-[#3E3E3E] ">Can access</span>
                    <Checkbox
                      classNames={{
                        input:
                          "bg-black bg-opacity-0 border-[1.5px] border-[#3E3E3E] cursor-pointer disabled:bg-gray-400",
                        body: "mr-3",
                        label: "text-[14px]",
                      }}
                      color="#5768D5"
                      size="xs"
                      value={"001"}
                      label="Section 001"
                      // checked={isChecked}
                      // disabled={disabled}
                      readOnly
                    />
                    <Checkbox
                      classNames={{
                        input:
                          "bg-black bg-opacity-0 border-[1.5px] border-[#3E3E3E] cursor-pointer disabled:bg-gray-400",
                        body: "mr-3",
                        label: "text-[14px]",
                      }}
                      color="#5768D5"
                      size="xs"
                      value={"001"}
                      label="Section 001"
                      // checked={isChecked}
                      // disabled={disabled}
                      readOnly
                    />
                    <Checkbox
                      classNames={{
                        input:
                          "bg-black bg-opacity-0 border-[1.5px] border-[#3E3E3E] cursor-pointer disabled:bg-gray-400",
                        body: "mr-3",
                        label: "text-[14px]",
                      }}
                      color="#5768D5"
                      size="xs"
                      value={"001"}
                      label="Section 001"
                      // checked={isChecked}
                      // disabled={disabled}
                      readOnly
                    />
                  </div>
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

              {form.getValues().type === COURSE_TYPE.SEL_TOPIC && (
                <div className="flex flex-col gap-1  font-medium text-[14px]">
                  <span className="text-[#3E3E3E]">Course Topic</span>
                  <span className="text-primary">
                    {/* รอใส่ข้อมูล Topic {form.getValues().____} */}
                    Test Course Topic
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

      <Group className="flex w-full h-fit items-end justify-between mt-4">
        <div>
          {active > 0 && (
            <Button
              className="rounded-[10px] mt-4 hover:bg-[#ebebeb] items-center justify-center h-[36px]  border-0"
              variant="default"
              justify="start"
              onClick={prevStep}
            >
              Back
            </Button>
          )}
        </div>
        <Button
          color="#6869AD"
          className="rounded-[10px] h-[36px] mt-4 w-[100px]"
          onClick={nextStep}
        >
          {active == 5 ? "Done" : "Next"}
        </Button>
      </Group>
    </Modal>
  );
}
