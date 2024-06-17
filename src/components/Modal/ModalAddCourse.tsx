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

type Props = {
  opened: boolean;
  onClose: () => void;
};
export default function ModalAddCourse({ opened, onClose }: Props) {
  const [active, setActive] = useState(0);
  const [openedDropdown, setOpenedDropdown] = useState(false);
  const [instructorOption, setInstructorOption] = useState([]);
  const form = useForm({
    initialValues: {} as Partial<IModelCourse>,
    validate: {
      type: (value) => {
        return !value && "Course Type is required";
      },
      courseNo: (value) => {
        if (!value) return "Course No. is required";
        const isValid = /^\d{6}$/.test(value.toString());
        return isValid ? null : "Please enter a valid course no";
      },
      courseName: (value) => {
        return !value && "Course Name is required";
      },
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
          <div className=" flex flex-col gap-4">
            <TextInput
              className=" mt-3"
              classNames={{ input: "focus:border-primary " }}
              label="Course no."
              placeholder="Ex. 001102"
              {...form.getInputProps("courseNo")}
            />
            <TextInput
              label="Course name"
              classNames={{ input: "focus:border-primary " }}
              placeholder="English 2"
              {...form.getInputProps("courseName")}
            />
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
          </div>
          <div className="text-[#3E3E3E] mt-4 mb-1 font-medium text-[14px] ">
            Section
          </div>
          <TagsInput
            classNames={{
              input: "focus:border-primary active:border-primary h-[140px]   ",
              pill: "bg-primary text-white",
            }}
            placeholder="Fill Section Number Ex. 001 or 1 (Press Enter for fill the next section)"
          ></TagsInput>
        </Stepper.Step>
        <Stepper.Step label="Map Semester" description="STEP 4">
          <div></div>
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
              className="w-full mt-2  h-full p-4 rounded-md gap-4 flex flex-col "
            >
              <Input
                leftSection={<TbSearch />}
                placeholder="Course No / Course Name"
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
                      <span className="text-primary text-[16px]">
                        Switch Thanaporn
                      </span>
                    </div>
                    <Button className=" px-5 rounded-md  " color="#FF4747">
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
                      <span className="text-primary text-[16px]">
                        Switch Thanaporn
                      </span>
                    </div>
                    <Button className=" px-5 rounded-md  " color="#FF4747">
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
          <div></div>
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
