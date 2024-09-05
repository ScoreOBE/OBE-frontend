import { Button, Checkbox, Group, Modal, Textarea } from "@mantine/core";
import { IconTrash } from "@tabler/icons-react";
import { upperFirst } from "lodash";
import { useState } from "react";

type actionType = "add" | "edit";

type Props = {
  opened: boolean;
  onClose: () => void;
  type: actionType;
};
export default function ModalManageCLO({ opened, onClose, type }: Props) {
  const height = type === "add" ? "h-full" : "h-fit";
  const cloLength = 6;
  const [checkedItem, setCheckedItem] = useState<string[]>([]);
  let options = [
    { label: "บรรยาย (Lecture)" },
    { label: "ปฏิบัติการ (Laboratory)" },
    { label: "อื่นๆ (Other)" },
  ];

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      withCloseButton={false}
      closeOnClickOutside={false}
      title={`${upperFirst(type)} CLO 259194`}
      size={type === "add" && cloLength > 0 ? "70vw" : "40vw"}
      centered
      transitionProps={{ transition: "pop" }}
      classNames={{
        content: `flex flex-col gap-1.5 bg-[#F6F7FA] overflow-hidden ${height}`,
        body: `overflow-hidden ${height}`,
      }}
    >
      <div className={`flex flex-col ${height}  justify-between`}>
        <div
          className={`flex gap-5 py-1 ${type === "add" ? "h-[91%]" : "h-fit"}`}
        >
          {/* Input Field */}
          <div
            className={`flex flex-col ${
              type === "add" && "p-5"
            } gap-0 rounded-lg overflow-hidden ${
              cloLength > 0 && type === "add" ? "w-[45%]" : "w-full"
            } h-full relative`}
            style={{
              boxShadow:
                type === "add" ? "0px 0px 4px 0px rgba(0, 0, 0, 0.25)" : "none",
            }}
          >
            <div className="flex flex-col gap-3 h-[80%]">
              <Textarea
                withAsterisk={true}
                autoFocus={false}
                label={
                  <p className="font-semibold flex gap-1 h-full ">
                    CLO <span className="text-secondary">Thai language</span>
                  </p>
                }
                className="w-full border-none  rounded-r-none "
                classNames={{
                  input: "flex h-[100px] p-3 text-[13px]",
                  label: "flex pb-1",
                }}
                placeholder="Ex. อธิบายหลักการทำงานของระบบปฏิบัติการคอมพิวเตอร์"
              />
              <Textarea
                autoFocus={false}
                withAsterisk={true}
                label={
                  <p className="font-semibold flex gap-1">
                    CLO <span className="text-secondary">English language</span>
                  </p>
                }
                className="w-full border-none rounded-r-none"
                classNames={{
                  input: "flex h-[100px] p-3 text-[13px]",
                  label: "flex pb-1",
                }}
                placeholder="Ex. Explain the working principle of computer operating systems."
              />

              <div className="flex flex-col gap-2 pb-1 ">
                <p className="text-secondary text-[13px] font-semibold">
                  Learning Method <span className="text-delete">*</span>
                </p>
                <Checkbox.Group
                  value={checkedItem}
                  onChange={(event) => setCheckedItem(event)}
                >
                  {options.map((item, index) => (
                    <div
                      key={index}
                      className="flex-col pb-3 items-center w-full"
                    >
                      <Checkbox
                        size="sm"
                        classNames={{
                          label: "font-medium text-[13px] text-[#333333]",
                        }}
                        label={item.label}
                        value={item.label}
                      />
                      {item.label === "อื่นๆ (Other)" && (
                        <Textarea
                          className="mt-2 pl-8"
                          placeholder="(Required)"
                          disabled={!checkedItem.includes("อื่นๆ (Other)")}
                          classNames={{
                            input: "text-[13px] text-[#333333] h-[70px]",
                          }}
                        />
                      )}
                    </div>
                  ))}
                </Checkbox.Group>
              </div>
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
          {!!cloLength && type === "add" && (
            <div
              className="flex flex-col bg-white border-secondary border-[1px] rounded-md w-[55%] h-auto"
              style={{
                boxShadow: "0px 0px 4px 0px rgba(0, 0, 0, 0.25)",
                overflowY: "auto",
              }}
            >
              <div className="sticky top-0 z-10 bg-[#e6e9ff] text-[14px] flex items-center justify-between border-b-secondary border-[1px] px-4 py-3 text-secondary font-semibold ">
                <div className="flex items-center gap-2">
                  <span>List CLO Added</span>
                </div>
                <p>
                  {cloLength} CLO{cloLength > 1 ? "s" : ""}
                </p>
              </div>

              <div className="flex flex-col w-full h-fit px-4">
                {Array.from({ length: cloLength }).map((_, index) => (
                  <div
                    className={`py-3 w-full border-b-[1px] px-3 ${
                      Array.length > 1 ? "last:border-none last:pb-5" : ""
                    } `}
                  >
                    <div className="flex flex-col gap-2 w-full">
                      <div className="flex items-center justify-between">
                        <p className="text-secondary font-semibold text-[14px]">
                          CLO-{index + 1}
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
                      <div className="flex text-pretty">
                        <li></li> อธิบายหลักการทำงานของระบบปฏิบัติการคอมพิวเตอร์
                      </div>
                      <div className="flex text-pretty">
                        <li></li> Explain the working principle of computer
                        operating systems.
                      </div>

                      <div className="flex text-pretty">
                        <li></li> Text
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
