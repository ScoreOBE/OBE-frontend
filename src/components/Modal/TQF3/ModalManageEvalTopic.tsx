import {
  Button,
  Checkbox,
  Group,
  Modal,
  Textarea,
  TextInput,
  NumberInput,
  NumberInputHandlers,
} from "@mantine/core";
import { IconMinus, IconPlus, IconTrash } from "@tabler/icons-react";
import { upperFirst } from "lodash";
import { useRef, useState } from "react";

type actionType = "add" | "edit";

type Props = {
  opened: boolean;
  onClose: () => void;
  type: actionType;
};
export default function ModalManageEvalTopic({ opened, onClose, type }: Props) {
  const height = type === "add" ? "h-full" : "h-fit";
  const handlersRef = useRef<NumberInputHandlers>(null);
  const topicLenght = 6;

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      withCloseButton={false}
      closeOnClickOutside={false}
      title={`${upperFirst(type)} Evaluation Topic 261405`}
      size={type === "add" && topicLenght > 0 ? "70vw" : "45vw"}
      centered
      transitionProps={{ transition: "pop" }}
      classNames={{
        content: `flex flex-col gap-1.5 bg-[#F6F7FA] overflow-hidden `,
        body: `overflow-hidden ${height}`,
      }}
    >
      <div
        className={`flex flex-col  !gap-5 ${
          type === "add" ? "h-full" : "h-fit  "
        } `}
      >
        <div
          className={`flex gap-5 py-1 ${
            type === "add" ? " h-[500px]" : "h-fit"
          }`}
        >
          {/* Input Field */}
          <div
            className={`flex flex-col ${
              type === "add" && "p-5"
            } gap-1 rounded-lg overflow-hidden ${
              topicLenght > 0 && type === "add" ? "w-[45%]" : "w-full"
            } h-full relative`}
            style={{
              boxShadow:
                type === "add" ? "0px 0px 4px 0px rgba(0, 0, 0, 0.25)" : "none",
            }}
          >
            <div className="flex flex-col gap-3 h-[80%]">
              <TextInput
                withAsterisk={true}
                autoFocus={false}
                label={
                  <p className="font-semibold flex gap-1 h-full ">
                    Evaluation Topic{" "}
                    <span className="text-secondary">Thai language</span>
                  </p>
                }
                className="w-full border-none   rounded-r-none "
                classNames={{
                  input: "flex p-3 text-[13px]",
                  label: "flex pb-1",
                }}
                placeholder="Ex. แบบทดสอบ 1"
              />
              <TextInput
                autoFocus={false}
                withAsterisk={true}
                label={
                  <p className="font-semibold flex gap-1">
                    Evaluation Topic{" "}
                    <span className="text-secondary">English language</span>
                  </p>
                }
                className="w-full border-none rounded-r-none"
                classNames={{
                  input: "flex p-3 text-[13px]",
                  label: "flex pb-1",
                }}
                placeholder="Ex. Test 1"
              />

              <Textarea
                autoFocus={false}
                label={<p className="font-semibold flex gap-1">Description</p>}
                className="w-full border-none rounded-r-none"
                classNames={{
                  input: "flex h-[125px] p-3 text-[13px]",
                  label: "flex pb-1",
                }}
                placeholder="(Optional)"
              />

              <NumberInput
                withAsterisk
                label={
                  <p className="font-semibold flex gap-1 h-full">
                    Evaluation Percentage
                  </p>
                }
                classNames={{
                  input: "flex px-3 py-5 text-[13px]",
                  label: "flex pb-1",
                }}
                allowNegative={false}
                handlersRef={handlersRef}
                defaultValue={0}
                step={1}
                max={100}
                rightSection={
                  <div className="flex gap-2 items-center mr-16">
                    <div
                      className="p-1 rounded-md hover:bg-bgTableHeader"
                      onClick={() => handlersRef.current?.decrement()}
                      style={{ cursor: "pointer" }}
                    >
                      <IconMinus size={18} color="#5768d5" />
                    </div>
                    <div className="h-8 border"></div>
                    <div
                      className=" p-1 rounded-md hover:bg-bgTableHeader"
                      onClick={() => handlersRef.current?.increment()}
                      style={{ cursor: "pointer" }}
                    >
                      <IconPlus size={18} color="#5768d5" />
                    </div>
                  </div>
                }
              />
            </div>

            {/* Add More Button */}

            {type === "add" && (
              <div className="absolute right-5 bottom-5">
                <Button
                  //   onClick={() => setIsAddAnother(true)}
                  variant="outline"
                  className="rounded-[8px] text-[12px] h-[32px] w-fit "
                >
                  Add more
                </Button>
              </div>
            )}
          </div>
          {/* List CLO */}
          {!!topicLenght && type === "add" && (
            <div
              className="flex flex-col bg-white border-secondary border-[1px] rounded-md w-[55%] h-[492px]"
              style={{
                boxShadow: "0px 0px 4px 0px rgba(0, 0, 0, 0.25)",
                overflowY: "auto",
              }}
            >
              <div className="sticky top-0 z-10 bg-[#e6e9ff] text-[14px] flex items-center justify-between border-b-secondary border-[1px] px-4 py-3 text-secondary font-semibold ">
                <div className="flex items-center gap-2">
                  <span>List Evaluation Topic Added</span>
                </div>
                <p>
                  {topicLenght} Topic{topicLenght > 1 ? "s" : ""}
                </p>
              </div>

              <div className="flex flex-col w-full h-fit px-4">
                {Array.from({ length: topicLenght }).map((_, index) => (
                  <div
                    key={index}
                    className={`py-3 w-full border-b-[1px] px-3 ${
                      Array.length > 1 ? "last:border-none last:pb-5" : ""
                    } `}
                  >
                    <div className="flex flex-col gap-2 w-full">
                      <div className="flex items-center justify-between">
                        <p className="text-secondary font-semibold text-[14px]">
                          Eval Topic {index + 1}
                        </p>

                        <div className="flex items-center justify-center border-[#FF4747] size-8 rounded-full hover:bg-[#FF4747]/10 cursor-pointer">
                          <IconTrash
                            stroke={1.5}
                            color="#FF4747"
                            className="size-4 flex items-center"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="text-tertiary text-[13px] font-medium flex flex-col gap-1">
                      <div className="flex justify-between items-center text-primary mt-2">
                        <div className="flex text-pretty">
                          <li></li> สอบกลางภาค (Midterm Exam)
                        </div>
                        <p className="font-semibold text-[14px]">0 %</p>
                      </div>
                      <div className="flex text-pretty">
                        <li></li>{" "}
                        วัดผลความรู้ความเข้าใจเกี่ยวกับโครงสร้างและการทำงานของระบบปฏิบัติการขั้นสูง
                        ครอบคลุมทั้งภาคทฤษฎีและปฏิบัติ
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        {/* Button */}
        <div className="flex gap-2  items-end  justify-end h-fit">
          <Button
            onClick={onClose}
            variant="subtle"
            color="#575757"
            className="rounded-[8px] text-[12px] h-8 w-fit "
          >
            Cancel
          </Button>
          <Button
            // onClick={submit}
            className="rounded-[8px] text-[12px] h-8 w-fit "
          >
            Done
          </Button>
        </div>
      </div>
    </Modal>
  );
}
