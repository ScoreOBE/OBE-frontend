import { useState } from "react";
import { Stepper, Button, Group, Modal } from "@mantine/core";
type Props = {
  opened: boolean;
  onClose: () => void;
};
const initialState = {};
export default function ModalAddCourse({ opened, onClose }: Props) {
  const [active, setActive] = useState(0);
  const nextStep = () => {
    if (active == 4) {
      closeModal();
    }
    setActive((current) => (current < 4 ? current + 1 : current));
  };
  const prevStep = () =>
    setActive((current) => (current > 0 ? current - 1 : current));

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
      size="auto"
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

      <Group justify="center" mt="xl">
        <Button variant="default" onClick={prevStep}>
          Back
        </Button>
        <Button onClick={nextStep}>{active == 4 ? "Done" : "Next"}</Button>
      </Group>
    </Modal>
  );
}
