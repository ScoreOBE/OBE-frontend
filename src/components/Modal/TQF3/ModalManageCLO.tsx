import { Button, Checkbox, Group, Modal, Textarea } from "@mantine/core";
import { IconList, IconTrash } from "@tabler/icons-react";
import { upperFirst } from "lodash";
import { useEffect, useLayoutEffect, useRef, useState } from "react";

type actionType = "add" | "edit";

type Props = {
  opened: boolean;
  onClose: () => void;
  type: actionType;
  courseNo: string;
};
export default function ModalManageCLO({
  opened,
  onClose,
  type,
  courseNo,
}: Props) {
  const height = type === "add" ? "h-full gap-5" : "h-fit gap-0";
  const cloLength = 3;
  const [checkedItem, setCheckedItem] = useState<string[]>([]);
  let options = [
    { label: "บรรยาย (Lecture)" },
    { label: "ปฏิบัติการ (Laboratory)" },
    { label: "อื่นๆ (Other)" },
  ];

  const [heightLeftSec, setHeightLeftSec] = useState(485);
  const cloDescriptionRef = useRef<any>(null);

  const updateHeight = () => {
    if (cloDescriptionRef.current) {
      const height = cloDescriptionRef.current.offsetHeight;
      setHeightLeftSec(height);
    }
  };

  useLayoutEffect(() => {
    updateHeight();
  });

  useEffect(() => {
    window.addEventListener("resize", updateHeight);
    return () => {
      window.removeEventListener("resize", updateHeight);
    };
  }, []);

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      withCloseButton={false}
      closeOnClickOutside={false}
      title={`${upperFirst(type)} CLO ${courseNo}`}
      size={type === "add" && cloLength > 0 ? "70vw" : "40vw"}
      centered
      transitionProps={{ transition: "pop" }}
      classNames={{
        root: `!h-fit`,
        content: `flex flex-col bg-[#F6F7FA] overflow-hidden`,
        body: `overflow-hidden `,
      }}
    >
      <div className={`flex flex-col ${height}`}>
        <div
          className={`flex gap-5 py-1 ${
            type === "add"
              ? checkedItem.includes("อื่นๆ (Other)")
                ? "max-h-[91%]"
                : "max-h-[80%]"
              : "h-fit"
          }`}
        >
          {/* Input Field */}
          <div
            id="cloDescription"
            ref={cloDescriptionRef}
            className={`flex flex-col rounded-md justify-between ${
              type === "add" && "p-5"
            } gap-1 overflow-hidden ${
              cloLength > 0 && type === "add" ? "w-[45%]" : "w-full"
            } h-full`}
            style={{
              boxShadow:
                type === "add" ? "0px 0px 4px 0px rgba(0, 0, 0, 0.25)" : "none",
            }}
          >
            <div className="flex flex-col gap-4 h-[90%]">
              <Textarea
                autoFocus={false}
                label={
                  <p className="font-semibold flex gap-1 h-full ">
                    CLO <span className="text-secondary">Thai language</span>
                    <span className=" text-error">*</span>
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
                label={
                  <p className="font-semibold flex gap-1">
                    CLO <span className="text-secondary">English language</span>
                    <span className=" text-error">*</span>
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
                <p className="text-secondary text-[13px] mb-1 font-semibold">
                  Learning Method <span className="text-error">*</span>
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
                      {item.label === "อื่นๆ (Other)" &&
                        checkedItem.includes("อื่นๆ (Other)") && (
                          <Textarea
                            className="mt-2 pl-8"
                            placeholder="(Required)"
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
              <div className="flex justify-end">
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
              className={`flex flex-col bg-white border-secondary border-[1px] rounded-md w-[55%] `}
              style={{
                height: heightLeftSec,
                boxShadow: "0px 0px 4px 0px rgba(0, 0, 0, 0.25)",
                overflowY: "auto",
              }}
            >
              <div className="sticky top-0 z-10 bg-[#e6e9ff] text-[14px] flex items-center justify-between border-b-secondary border-[1px] px-4 py-3 text-secondary font-semibold ">
                <div className="flex items-center gap-2">
                  <span className="flex flex-row items-center gap-2"> <IconList />List CLO Added</span>
                </div>
                <p>
                  {cloLength} CLO{cloLength > 1 ? "s" : ""}
                </p>
              </div>

              <div className="flex flex-col w-full h-fit px-4">
                {Array.from({ length: cloLength }).map((_, index) => (
                  <div
                    key={index}
                    className={`py-3 w-full border-b-[1px] pl-3 pr-1 ${
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
        <div className="flex gap-2 items-end justify-end h-fit">
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
