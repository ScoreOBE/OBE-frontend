import { useState } from "react";
import { Button, Modal } from "@mantine/core";
import IconArrowRight from "@/assets/icons/arrowRight.svg?react";
import templateGuideStep1 from "@/assets/image/templateGuide1.png";
import templateGuideStep2 from "@/assets/image/templateGuide2.png";
import templateGuideStep3 from "@/assets/image/templateGuide3.png";
import templateGuideStep4 from "@/assets/image/templateGuide4.png";
import templateGuideStep5 from "@/assets/image/templateGuide51.png";
import templateGuideStep0 from "@/assets/image/templateGuide0.png";

import Icon from "../../Icon";

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

  const close = () => {
    onClose();
    setTimeout(() => {
      setStep(1);
    }, 300);
  };

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <>
            <p className="text-transparent bg-clip-text bg-gradient-to-r from-[#4285f4] mb-10 leading-[38px] text-[28px]  via-[#ec407a] via-[#a06ee1] to-[#fb8c00] font-semibold text-[24px]">
              ScoreOBE+ <br /> Template Guide <br /> for Upload Score
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
            <p className="text-[#ED220D] leading-[38px] text-[28px] mb-7 font-semibold">
              Do not edit
            </p>
            <p className="text-[14px] mb-16 text-default font-medium">
              <span className="text-emphasize font-semibold">
                Cells A1:E4 and Column E
              </span>{" "}
              - <span className="text-[#ED220D] font-semibold">Reserved</span>{" "}
              for template structure{" "}
              <span className="text-[#ED220D] font-semibold">
                (don't enter data here)
              </span>
            </p>
          </>
        );
      case 3:
        return (
          <>
            <p className="text-[#0EB2AA] leading-[38px] text-[28px] mb-7 font-semibold">
              Fill Student Information <br />
              (top-down)
            </p>
            <div className="text-[14px] mb-16 text-default font-medium">
              <div className="flex">
                <li></li>
                <span className="text-emphasize font-semibold">Column A </span>:
                Section Number(s)
              </div>{" "}
              <br />
              <div className="flex -mt-3">
                <li></li>
                <span className="text-emphasize font-semibold">Column B </span>:
                Student ID Column{" "}
              </div>{" "}
              <br />
              <div className="flex -mt-3">
                <li></li>{" "}
                <span className="text-emphasize font-semibold">Column C </span>:
                Student First Name
              </div>{" "}
              <br />
              <div className="flex -mt-3">
                <li></li>
                <span className="text-emphasize font-semibold">Column D </span>:
                Student Last Name{" "}
              </div>{" "}
            </div>
          </>
        );
      case 4:
        return (
          <>
            <p className="text-secondary leading-[38px] text-[28px] mb-7 font-semibold">
              Fill Question <br /> Information (left-right)
            </p>
            <div className="text-[14px] mb-16 text-default font-medium flex flex-col gap-2">
              <div className="flex">
                <li></li>
                <p>
                  <span className="text-emphasize font-semibold">
                    Columns F1
                  </span>
                  : - Question names{" "}
                  <span className="text-[#ED220D] font-semibold">
                    (required)
                  </span>
                </p>
              </div>{" "}
              <div className="flex">
                <li></li>
                <p>
                  <span className="text-emphasize font-semibold">
                    Columns F2
                  </span>
                  : - Full scores for each question{" "}
                  <span className="text-[#ED220D] font-semibold">
                    (required)
                  </span>
                </p>
              </div>{" "}
              <div className="flex">
                <li></li>
                <p>
                  <span className="text-emphasize font-semibold">
                    Columns F3 and F4
                  </span>
                  - Question descriptions (optional)
                </p>
              </div>{" "}
            </div>
          </>
        );
      case 5:
        return (
          <>
            <p className="text-[#0295A9] leading-[38px] text-[28px] mb-7 font-semibold">
              Adding Score <br /> New Evaluation
            </p>
            <p className="text-[14px] mb-16 text-default font-medium">
              <span className="text-emphasize font-semibold">
                Click the "+" icon
              </span>{" "}
              at the bottom right corner (next to the "Final" sheet)
            </p>
          </>
        );
      case 6:
        return (
          <>
            <p className="text-secondary leading-[38px] text-[28px] mb-7 font-semibold">
              Example
            </p>
          </>
        );
      // case 7:
      //   return (
      //     <>
      //       <p className="text-secondary leading-[38px] text-[28px] mb-7 font-semibold">
      //         Final Step <br /> Completing the Guide
      //       </p>
      //       <p className="text-[14px] mb-16 text-default font-medium">
      //         You're ready to upload the scores.
      //       </p>
      //     </>
      //   );
      default:
        return null;
    }
  };

  const renderStepImage = () => {
    switch (step) {
      case 1:
        return templateGuideStep0;
      case 2:
        return templateGuideStep1;
      case 3:
        return templateGuideStep2;
      case 4:
        return templateGuideStep3;
      case 5:
        return templateGuideStep4;
      case 6:
        return templateGuideStep5;

      default:
        return templateGuideStep0;
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
        withCloseButton={false}
        classNames={{
          content: "flex flex-col !p-0 overflow-hidden",
          body: "flex flex-col pr-0 overflow-hidden h-fit",
        }}
      >
        <div className="flex justify-between pl-8 items-center  h-[560px]">
          <div className="flex flex-col">
            <div className="w-[350px] pr-8">{renderStepContent()}</div>
            <div className="flex gap-4 mt-4">
              {step === 1 ? (
                <Button variant="outline" onClick={close}>
                  Close
                </Button>
              ) : (
                <Button variant="outline" onClick={back}>
                  Back
                </Button>
              )}
              {step < 6 && (
                <Button
                  rightSection={
                    <Icon
                      className="storke-[1px]"
                      IconComponent={IconArrowRight}
                    />
                  }
                  onClick={next}
                >
                  Next
                </Button>
              )}
              {step === 6 && <Button onClick={close}>Got it!</Button>}
            </div>
          </div>
          <img src={renderStepImage()} alt="CMULogo" className=" w-[2000px]" />
        </div>
      </Modal>
    </>
  );
}
