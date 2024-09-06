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
export default function ModalManageTopic({ opened, onClose, type }: Props) {
  const height = type === "add" ? "h-full" : "h-fit";
  const handlersLecRef = useRef<NumberInputHandlers>(null);
  const handlersLabRef = useRef<NumberInputHandlers>(null);
  const topicLenght = 6;

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      closeOnClickOutside={false}
      title={`${upperFirst(type)} Course Content 261405`}
      size={type === "add" && topicLenght > 0 ? "70vw" : "35vw"}
      centered
      withCloseButton={false}
      transitionProps={{ transition: "pop" }}
      classNames={{
        content: `flex flex-col bg-[#F6F7FA] overflow-hidden `,
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
            type === "add" ? " h-[450px]" : "h-fit"
          }`}
        >
          {/* Input Field */}
          <div
            className={`flex flex-col ${
              type === "add" && "p-5"
            } gap-1 rounded-md overflow-hidden ${
              topicLenght > 0 && type === "add" ? "w-[45%]" : "w-full"
            } h-full relative`}
            style={{
              boxShadow:
                type === "add" ? "0px 0px 4px 0px rgba(0, 0, 0, 0.25)" : "none",
            }}
          >
            <div className="flex flex-col gap-4 h-[80%]">
              <Textarea
                autoFocus={false}
                label={
                  <p className="font-semibold flex gap-1">
                    Course Content <span className=" text-error">*</span>
                  </p>
                }
                className="w-full border-none rounded-r-none"
                classNames={{
                  input: "flex h-[100px] p-3 text-[13px]",
                  label: "flex pb-1",
                }}
                placeholder="Ex. การอินทิเกรต"
              />

              <NumberInput
                label={
                  <p className="font-semibold flex gap-1 h-full">
                    Lecture hour
                    <span className=" text-error">*</span>
                  </p>
                }
                classNames={{
                  input: "flex px-3 py-5 text-[13px]",
                  label: "flex pb-1",
                }}
                allowNegative={false}
                handlersRef={handlersLecRef}
                defaultValue={0}
                step={1}
                max={100}
                rightSection={
                  <div className="flex gap-2 items-center mr-16">
                    <div
                      className="p-1 rounded-md hover:bg-bgTableHeader"
                      onClick={() => handlersLecRef.current?.decrement()}
                      style={{ cursor: "pointer" }}
                    >
                      <IconMinus size={18} color="#5768d5" />
                    </div>
                    <div className="h-8 border"></div>
                    <div
                      className=" p-1 rounded-md hover:bg-bgTableHeader"
                      onClick={() => handlersLecRef.current?.increment()}
                      style={{ cursor: "pointer" }}
                    >
                      <IconPlus size={18} color="#5768d5" />
                    </div>
                  </div>
                }
              />

              <NumberInput
                label={
                  <p className="font-semibold flex gap-1 h-full">
                    Lab hour <span className=" text-error">*</span>
                  </p>
                }
                classNames={{
                  input: "flex px-3 py-5 text-[13px]",
                  label: "flex pb-1",
                }}
                allowNegative={false}
                handlersRef={handlersLabRef}
                defaultValue={0}
                step={1}
                max={100}
                rightSection={
                  <div className="flex gap-2 items-center mr-16">
                    <div
                      className="p-1 rounded-md hover:bg-bgTableHeader"
                      onClick={() => handlersLabRef.current?.decrement()}
                      style={{ cursor: "pointer" }}
                    >
                      <IconMinus size={18} color="#5768d5" />
                    </div>
                    <div className="h-8 border"></div>
                    <div
                      className=" p-1 rounded-md hover:bg-bgTableHeader"
                      onClick={() => handlersLabRef.current?.increment()}
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
              className="flex flex-col bg-white border-secondary border-[1px] rounded-md w-[55%] h-[442px]"
              style={{
                boxShadow: "0px 0px 4px 0px rgba(0, 0, 0, 0.25)",
                overflowY: "auto",
              }}
            >
              <div className="sticky top-0 z-10 bg-[#e6e9ff] text-[14px] flex items-center justify-between border-b-secondary border-[1px] px-4 py-3 text-secondary font-semibold ">
                <div className="flex items-center gap-2">
                  <span>List Course Content Added</span>
                </div>
                <p>
                  {topicLenght} Course Content{topicLenght > 1 ? "s" : ""}
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
                          Course Content {index + 1}
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
                      <div className="flex text-pretty font-semibold">
                        <li></li> Week {index + 1}: Operation-System Structures
                      </div>
                      <div className="flex text-pretty">
                        <li></li> Lecture hour: 4 hrs
                      </div>
                      <div className="flex text-pretty">
                        <li></li> Lab hour: 0 hrs
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
