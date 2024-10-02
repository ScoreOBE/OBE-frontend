import { useState } from "react";
import { Button, Modal } from "@mantine/core";
import { IconArrowRight, IconArrowLeft } from "@tabler/icons-react";
import templateGuideStep1 from "@/assets/image/templateGuideStep1.png";
import templateGuideStep2 from "@/assets/image/templateGuideStep2.png";
import templateGuideStep3 from "@/assets/image/templateGuideStep3.png";
import templateGuideStep4 from "@/assets/image/templateGuideStep4.png";
import templateGuideStep5 from "@/assets/image/templateGuideStep5.png";
import templateGuideStep6 from "@/assets/image/templateGuideStep6.png";
import templateGuideStep7 from "@/assets/image/templateGuideStep7.png";

type Props = {
  opened: boolean;
  onClose: () => void;
};

export default function ModalTemplateGuide({ opened, onClose }: Props) {
  const [step, setStep] = useState(1); // Step 1 is the default initial page

  const next = () => {
    setStep((prevStep) => prevStep + 1);
  };

  const back = () => {
    setStep((prevStep) => prevStep - 1);
  };

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <>
            <p className="text-secondary leading-[42px] text-[32px] mb-7 font-semibold">
              CMU OBE <br /> Template Guide <br /> for Upload Score
            </p>
            <p className="text-[14px] mb-16 text-default font-medium">
              This template helps you easily upload student grades for your
              assignments.
            </p>
          </>
        );
      case 2:
        return (
          <>
            <p className="text-secondary leading-[42px] text-[32px] mb-7 font-semibold">
              Step 2 <br /> Additional Instructions
            </p>
            <p className="text-[14px] mb-16 text-default font-medium">
              Follow the instructions to upload the grades correctly.
            </p>
          </>
        );
      case 3:
        return (
          <>
            <p className="text-secondary leading-[42px] text-[32px] mb-7 font-semibold">
              Step 3 <br /> Step Description
            </p>
            <p className="text-[14px] mb-16 text-default font-medium">
              More instructions for step 3.
            </p>
          </>
        );
      case 4:
        return (
          <>
            <p className="text-secondary leading-[42px] text-[32px] mb-7 font-semibold">
              Step 4 <br /> Step Description
            </p>
            <p className="text-[14px] mb-16 text-default font-medium">
              More instructions for step 4.
            </p>
          </>
        );
      case 5:
        return (
          <>
            <p className="text-secondary leading-[42px] text-[32px] mb-7 font-semibold">
              Step 5 <br /> Step Description
            </p>
            <p className="text-[14px] mb-16 text-default font-medium">
              More instructions for step 5.
            </p>
          </>
        );
      case 6:
        return (
          <>
            <p className="text-secondary leading-[42px] text-[32px] mb-7 font-semibold">
              Step 6 <br /> Step Description
            </p>
            <p className="text-[14px] mb-16 text-default font-medium">
              More instructions for step 6.
            </p>
          </>
        );
      case 7:
        return (
          <>
            <p className="text-secondary leading-[42px] text-[32px] mb-7 font-semibold">
              Final Step <br /> Completing the Guide
            </p>
            <p className="text-[14px] mb-16 text-default font-medium">
              You're ready to upload the scores.
            </p>
          </>
        );
      default:
        return null;
    }
  };

  const renderStepImage = () => {
    switch (step) {
      case 1:
        return templateGuideStep1;
      case 2:
        return templateGuideStep2;
      case 3:
        return templateGuideStep3;
      case 4:
        return templateGuideStep4;
      case 5:
        return templateGuideStep5;
      case 6:
        return templateGuideStep6;
      case 7:
        return templateGuideStep7;
      default:
        return templateGuideStep1;
    }
  };

  return (
    <>
      <Modal
        size="72vw"
        opened={opened}
        onClose={onClose}
        centered
        transitionProps={{ transition: "pop" }}
        closeOnClickOutside={true}
        withCloseButton={false}
        classNames={{
          content: "flex flex-col !p-0 overflow-hidden",
          body: "flex flex-col pr-0 overflow-hidden h-fit",
        }}
      >
        <div className="flex justify-between items-center h-full gap-3">
          <div className="flex flex-col pl-8">
            {renderStepContent()}
            <div className="flex gap-4 mt-4">
              {step === 1 ? (
                <Button variant="outline" onClick={onClose}>
                  Close
                </Button>
              ) : (
                <Button variant="outline" onClick={back}>
                  Back
                </Button>
              )}
              {step < 7 && (
                <Button rightSection={<IconArrowRight />} onClick={next}>
                  Next
                </Button>
              )}
              {step === 7 && <Button onClick={onClose}>Got it!</Button>}
            </div>
          </div>
          <img
            src={renderStepImage()}
            alt="CMULogo"
            className="h-[600px] translate-x-10 translate-y-6 w-[700px]"
          />
        </div>
      </Modal>
    </>
  );
}
