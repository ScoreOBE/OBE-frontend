import { useState } from "react";
import { Stepper, Button, Group, Modal, Select } from "@mantine/core";
import {
  IconChevronDown,
  IconCircleFilled,
  IconMailOpened,
  IconShieldCheck,
} from "@tabler/icons-react";
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
        title: "text-primary font-semibold text-[18px] f",
        content: "justify-center item-center px-4",
      }}
    >
      <Stepper
        active={active}
        color="#6869AD"
        onStepClick={setActive}
        allowNextStepsSelect={false}
        classNames={{
          separator: "text-primary -mx-2 mb-12 h-[3px] -translate-x-6",
          step: "flex flex-col  items-start",
          stepIcon: "mb-2 text-primary",
          stepBody: "flex-col-reverse m-0",
        }}
        className=" justify-center items-center "
      >
        <Stepper.Step label="Course Type" description="STEP 1">
          <Select
            label="Type of Course"
            placeholder="Select Type of Course"
            data={[COURSE_TYPE.GENERAL, COURSE_TYPE.SEL_TOPIC]}
            value={""}
            // onChange={(_value, option) => setSelectedTerm(option)}
            allowDeselect={false}
            withCheckIcon={false}
            className="rounded-md my-5 border-none "
            style={{ boxShadow: "0px 1px 4px 0px rgba(0, 0, 0, 0.05)" }}
            classNames={{
              label: "font-medium mb-1 text-[16px] text-[#3E3E3E]",
              input: "text-primary font-medium border-primary",
              option: "hover:bg-[#DDDDF6] text-primary font-medium",
              dropdown: ""
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
          <div></div>
        </Stepper.Step>
        <Stepper.Step label="Add Section" description="STEP 3">
          <div></div>
        </Stepper.Step>
        <Stepper.Step label="Co-Instructor" description="STEP 4">
          <div></div>
        </Stepper.Step>
        <Stepper.Step label="Review" description="STEP 5">
          <div></div>
        </Stepper.Step>
      </Stepper>

      <Group className="flex w-full justify-between mt-8">
        <div>
          {active > 0 && (
            <Button className="rounded-[10px] hover:bg-[#ebebeb] items-center justify-center h-[36px]  border-0" variant="default" justify="start" onClick={prevStep}>
              Back
            </Button>
          )}
        </div>
        <Button
        color="#6869AD"
          className="rounded-[10px] h-[36px] w-[100px]"
          onClick={nextStep}
        >
          {active == 4 ? "Done" : "Next"}
        </Button>
      </Group>
    </Modal>
  );
}
