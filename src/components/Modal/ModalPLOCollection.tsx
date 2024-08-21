import { useState } from "react";
import { Button, Group, Modal, Stepper, TextInput } from "@mantine/core";
import { IconArrowRight, IconCircleFilled } from "@tabler/icons-react";

type Props = {
  opened: boolean;
  onClose: () => void;
  // fetchCourse: (id: string) => void;
};
export default function ModalAddPLOCollection({ opened, onClose }: Props) {
  //   const user = useAppSelector((state) => state.user);
  //   const academicYear = useAppSelector((state) => state.academicYear[0]);
  const [loading, setLoading] = useState(false);
  const [active, setActive] = useState(0);
  const [sectionNoList, setSectionNoList] = useState<string[]>([]);
  const [coInsList, setCoInsList] = useState<any[]>([]);
  const [firstInput, setFirstInput] = useState(true);

  const nextStep = () =>
    setActive((current) => (current < 3 ? current + 1 : current));
  const prevStep = () => setActive((cur) => (cur > 0 ? cur - 1 : cur));
  const closeModal = () => {
    setActive(0);
    setSectionNoList([]);
    setCoInsList([]);
    // form.reset();
    onClose();
  };

  return (
    <Modal
      opened={opened}
      onClose={closeModal}
      closeOnClickOutside={false}
      title="Add PLO Collection"
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
          separator: ` mb-12 h-[3px]  `,
          step: "flex flex-col  items-start mr-2",
          stepIcon: "mb-2 text-[#E6E6FF] bg-[#E6E6FF] border-[#E6E6FF]",
          stepBody: "flex-col-reverse m-0 ",
          stepLabel: "text-[13px] font-semibold",
          stepDescription: "text-[13px] font-semibold",
        }}
        className=" justify-center items-center mt-1  text-[14px] max-h-full"
      >
        <Stepper.Step
          allowStepSelect={false}
          label="PLO Info"
          description="STEP 1"
        >
          <div className="flex flex-col gap-3">
            <div className="mt-3 border-b border-gray">
              <TextInput
                withAsterisk={true}
                label="PLO Collection Name"
                className="w-full border-none pb-5 "
                classNames={{
                  input: "flex p-3 ",
                  label: "flex pb-1 gap-1",
                }}
                size="xs"
                placeholder="Ex. PLO 1/67"
              />
            </div>
            <TextInput
              withAsterisk={true}
              label={
                <p className=" font-semibold flex gap-1">
                  Criteria <span className="text-secondary">Thai language</span>
                </p>
              }
              className="w-full border-none "
              classNames={{
                input: "flex p-3 ",
                label: "flex pb-1 gap-1",
              }}
               size="sm"
              placeholder="Ex. เกณฑ์ของ ABET"
            />
            <TextInput
              withAsterisk={true}
              label={
                <p className=" flex gap-1">
                  Criteria{" "}
                  <span className="text-secondary">English language</span>
                </p>
              }
              className="w-full border-none "
              classNames={{
                input: "flex p-3 ",
                label: "flex pb-1 gap-1",
              }}
               size="xs"
              placeholder="Ex. ABET Criteria"
            />
          </div>
        </Stepper.Step>
        <Stepper.Step
          allowStepSelect={false}
          label="Add PLO"
          description="STEP 2"
        ></Stepper.Step>
        <Stepper.Step
          allowStepSelect={false}
          label="Map Department"
          description="STEP 3"
        ></Stepper.Step>
        <Stepper.Step
          allowStepSelect={false}
          label="Review"
          description="STEP 4"
        ></Stepper.Step>
      </Stepper>
      {active >= 0 && (
        <Group className="flex w-full h-fit items-end justify-between mt-7">
          <div>
            {active > 0 && (
              <Button
                color="#575757"
                variant="subtle"
                className="rounded-[8px] text-[12px] h-[32px] w-fit "
                justify="start"
                onClick={prevStep}
              >
                Back
              </Button>
            )}
          </div>
          <Button
            color="#5768d5"
            className="rounded-[8px] text-[12px] h-[32px] w-fit "
            loading={loading}
            onClick={() => nextStep()}
            rightSection={
              active != 3 && <IconArrowRight stroke={2} size={20} />
            }
          >
            {active == 3 ? "Done" : "Next step"}
          </Button>
        </Group>
      )}
    </Modal>
  );
}
