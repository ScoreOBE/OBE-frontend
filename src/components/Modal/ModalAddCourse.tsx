import { useState } from "react";
import { Stepper, Button, Group, Modal } from "@mantine/core";
type Props = {
  opened: boolean;
  onClose: () => void;
};
export default function ModalAddCourse({ opened, onClose }: Props) {
  const [active, setActive] = useState(0);
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
      title="Filter"
      size="800px"
      centered
      transitionProps={{ transition: "pop" }}
      classNames={{ title: "text-primary font-medium text-lg" }}
    >
      <Stepper
        active={active}
        onStepClick={setActive}
        allowNextStepsSelect={false}
        color="#6869AD"
        classNames={{
          separator: "text-primary",
          step: "flex flex-col",
          stepIcon: "mb-2 text-primary",
        }}
      >
        <Stepper.Step label="STEP 1" description="Course Type">
          <div></div>
        </Stepper.Step>
        <Stepper.Step label="STEP 2" description="Course Name">
          <div></div>
        </Stepper.Step>
        <Stepper.Step label="STEP 3" description="Add Section">
          <div></div>
        </Stepper.Step>
        <Stepper.Step label="STEP 4" description="Co-Instructor">
          <div></div>
        </Stepper.Step>
        <Stepper.Step label="STEP 5" description="Review">
          <div></div>
        </Stepper.Step>
      </Stepper>

      <Group className="flex w-full justify-between mt-5">
        {active > 0 && (
          <Button variant="default" justify="start" onClick={prevStep}>
            Back
          </Button>
        )}
        <Button onClick={nextStep}>{active == 4 ? "Done" : "Next"}</Button>
      </Group>
    </Modal>
  );
}
