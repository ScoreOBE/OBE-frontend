import { useState } from "react";
import {
  Stepper,
  Button,
  Group,
  Modal,
  Select,
  TextInput,
  Textarea,
} from "@mantine/core";
import { IconChevronDown, IconCircleFilled } from "@tabler/icons-react";
import { COURSE_TYPE } from "@/helpers/constants/enum";
type Props = {
  opened: boolean;
  onClose: () => void;
};
export default function ModalAddCourse({ opened, onClose }: Props) {
  const [active, setActive] = useState(0);
  const [openedDropdown, setOpenedDropdown] = useState(false);

  const nextStep = () => {
    if (active == 4) closeModal();
    setActive((cur) => (cur < 4 ? cur + 1 : cur));
  };
  const prevStep = () => setActive((cur) => (cur > 0 ? cur - 1 : cur));

  const closeModal = () => {
    setActive(0);
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
        content: "justify-center item-center px-2",
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
          stepBody: "flex-col-reverse m-0",
        }}
        className=" justify-center items-center mt-3"
      >
        <Stepper.Step
          label="Course Type"
          classNames={{ stepLabel: "text-[14px]" }}
          description="STEP 1"
        >
          <Select
            clearable
            label="Type of Course"
            placeholder="Select Type of Course"
            data={[COURSE_TYPE.GENERAL, COURSE_TYPE.SEL_TOPIC]}
            value={""}
            // onChange={(_value, option) => setSelectedTerm(option)}
            allowDeselect={false}
            withCheckIcon={false}
            className="rounded-md my-5 border-none  "
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
        <Stepper.Step
          label="Course Name"
          classNames={{ stepLabel: "text-[14px]" }}
          description="STEP 2"
        >
          <div className=" flex flex-col gap-4">
            <TextInput
              className=" mt-3"
              classNames={{ input: "focus:border-primary " }}
              label="Course no."
              placeholder="Ex. 001102"
            />
            <TextInput
              label="Course name"
              classNames={{ input: "focus:border-primary " }}
              placeholder="English 2"
              value={""}
            />
          </div>
        </Stepper.Step>
        <Stepper.Step
          label="Add Section"
          classNames={{ stepLabel: "text-[14px]" }}
          description="STEP 3"
        >
          <div
            style={{
              boxShadow: "0px 0px 4px 0px rgba(0, 0, 0, 0.25)",
            }}
            className="w-full mt-2 te h-full p-4 rounded-md gap-4 flex flex-col"
          >
            <div className="flex flex-col gap-1">
              <span className="text-[#3E3E3E] font-medium text-[14px]">
                Course No.
              </span>
              <span className="text-primary font-medium text-[14px]">
                261361
              </span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-[#3E3E3E] font-medium text-[14px]">
                Course Name
              </span>
              <span className="text-primary font-medium text-[14px]">
                Software Engineering
              </span>
            </div>
          </div>
          <div className="text-[#3E3E3E] mt-4 mb-1 font-medium text-[14px]">
            Section
          </div>
          <Textarea
            classNames={{ input: "focus:border-primary " }}
            placeholder="Fill Section Number Ex. 001 or 1 (Press Enter for fill the next section)"
          ></Textarea>
        </Stepper.Step>
        <Stepper.Step
          label="Co-Instructor"
          classNames={{ stepLabel: "text-[14px]" }}
          description="STEP 4"
        >
          <div></div>
        </Stepper.Step>
        <Stepper.Step
          label="Review"
          classNames={{ stepLabel: "text-[14px]" }}
          description="STEP 5"
        >
          <div></div>
        </Stepper.Step>
      </Stepper>

      <Group className="flex w-full justify-between mt-8">
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
          {active == 4 ? "Done" : "Next"}
        </Button>
      </Group>
    </Modal>
  );
}
