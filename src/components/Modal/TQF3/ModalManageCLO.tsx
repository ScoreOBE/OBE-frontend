import { validateTextInput } from "@/helpers/functions/validation";
import { IModelCLO, IModelTQF3Part2 } from "@/models/ModelTQF3";
import {
  Button,
  Checkbox,
  FocusTrapInitialFocus,
  Modal,
  rem,
  Textarea,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconList, IconTrash } from "@tabler/icons-react";
import { upperFirst } from "lodash";
import { useEffect, useLayoutEffect, useRef, useState } from "react";

export enum LearningMethod {
  Lec = "บรรยาย (Lecture)",
  Lab = "ปฏิบัติการ (Laboratory)",
  Other = "อื่นๆ (Other)",
}

type actionType = "add" | "edit";

type Props = {
  opened: boolean;
  onClose: () => void;
  type: actionType;
  data: IModelCLO[] | IModelCLO;
  setCloList: (value: any) => void;
};

export default function ModalManageCLO({
  opened,
  onClose,
  type,
  data,
  setCloList,
}: Props) {
  const height = type === "add" ? "h-full gap-5" : "h-fit gap-0";
  const options = [
    { label: LearningMethod.Lec },
    { label: LearningMethod.Lab },
    { label: LearningMethod.Other },
  ];
  const [heightLeftSec, setHeightLeftSec] = useState(485);
  const cloDescriptionRef = useRef<any>(null);
  const cloRef = useRef<HTMLDivElement>(null);
  const [isAdded, setIsAdded] = useState(false);

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

  const form = useForm({
    mode: "controlled",
    initialValues: { clo: [] } as Partial<IModelTQF3Part2>,
  });

  const formOneCLO = useForm({
    mode: "controlled",
    initialValues: {
      cloNo: 1,
      cloDescTH: "",
      cloDescEN: "",
      learningMethod: [],
      other: "",
    } as Partial<IModelCLO>,
    validate: {
      cloDescTH: (value) =>
        validateTextInput(value, "CLO Thai language", 0, false),
      cloDescEN: (value) =>
        validateTextInput(value, "CLO English language", 0, false),
      learningMethod: (value) =>
        !value?.length && "Select Learning Method at least one",
    },
    validateInputOnBlur: true,
  });

  useEffect(() => {
    if (opened && data) {
      form.reset();
      formOneCLO.reset();
      if (type == "add") {
        const length = (data as IModelCLO[]).length || 0;
        formOneCLO.setFieldValue("cloNo", length + 1);
      } else {
        formOneCLO.setValues(data as IModelCLO);
      }
    }
  }, [data, opened]);

  useEffect(() => {
    if (cloRef.current && isAdded) {
      cloRef.current.scrollIntoView({ behavior: "smooth" });
      setIsAdded(false);
    }
  }, [isAdded]);

  const addMore = () => {
    if (!formOneCLO.validate().hasErrors) {
      form.insertListItem("clo", formOneCLO.getValues());
      setIsAdded(true);
      formOneCLO.setValues({
        cloNo: formOneCLO.getValues().cloNo! + 1,
        cloDescTH: "",
        cloDescEN: "",
        learningMethod: [],
        other: "",
      });
    }
  };

  const removeCLO = (index: number) => {
    form.removeListItem("clo", index);
    const newCloList = form.getValues().clo;
    newCloList?.forEach((clo, i) => {
      clo.cloNo = (data as IModelCLO[]).length + i + 1;
    });
    formOneCLO.setFieldValue("cloNo", newCloList?.length! + 1);
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      closeOnClickOutside={false}
      title={`${upperFirst(type)} CLO`}
      size={
        type === "add" && form.getValues().clo?.length! > 0 ? "70vw" : "40vw"
      }
      centered
      transitionProps={{ transition: "pop" }}
      classNames={{
        root: `!h-fit`,
        content: `flex flex-col bg-[#F6F7FA] overflow-hidden`,
        body: `overflow-hidden`,
        header: `mb-1`,
      }}
    >
      <FocusTrapInitialFocus />
      <div className={`flex flex-col ${height}`}>
        <div
          className={`flex gap-5 py-1 ${
            type === "add"
              ? form
                  .getValues()
                  .clo![
                    form.getValues().clo?.length! > 0
                      ? form.getValues().clo?.length! - 1
                      : 0
                  ]?.learningMethod.includes(LearningMethod.Other)
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
              form.getValues().clo?.length! > 0 && type === "add"
                ? "w-[45%]"
                : "w-full"
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
                className="w-full border-none"
                classNames={{
                  input: "flex h-[110px] px-3 py-2 text-[13px]",
                  label: "flex pb-1",
                }}
                placeholder="Ex. อธิบายหลักการทำงานของระบบปฏิบัติการคอมพิวเตอร์"
                {...formOneCLO.getInputProps("cloDescTH")}
              />
              <Textarea
                autoFocus={false}
                label={
                  <p className="font-semibold flex gap-1">
                    CLO <span className="text-secondary">English language</span>
                    <span className=" text-error">*</span>
                  </p>
                }
                className="w-full border-none"
                classNames={{
                  input: "flex h-[110px] px-3 py-2 text-[13px]",
                  label: "flex pb-1",
                }}
                placeholder="Ex. Explain the working principle of computer operating systems."
                {...formOneCLO.getInputProps("cloDescEN")}
              />

              <div className="flex flex-col gap-2 pb-1 ">
                <p className="text-secondary text-[13px] mb-1 font-semibold">
                  Learning Method <span className="text-error">*</span>
                </p>
                <Checkbox.Group {...formOneCLO.getInputProps("learningMethod")}>
                  {options.map((item, index) => (
                    <div
                      key={index}
                      className="flex-col pb-[14px] items-center w-full"
                    >
                      <Checkbox
                        size="xs"
                        classNames={{
                          label: "font-medium text-[13px] text-default",
                        }}
                        label={item.label}
                        value={item.label}
                      />
                      {item.label === LearningMethod.Other &&
                        formOneCLO
                          .getValues()
                          .learningMethod?.includes(LearningMethod.Other) && (
                          <Textarea
                            size="xs"
                            className="mt-2 pl-8"
                            placeholder="(Required)"
                            classNames={{
                              input: "text-[13px] text-default",
                            }}
                            {...formOneCLO.getInputProps("other")}
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
                <Button variant="outline" onClick={addMore}>
                  Add more
                </Button>
              </div>
            )}
          </div>
          {/* List CLO */}
          {!!form.getValues().clo?.length && type === "add" && (
            <div
              className={`flex flex-col bg-white border-secondary border-[1px] rounded-md w-[55%] overflow-y-auto overflow-x-hidden`}
              style={{
                height: heightLeftSec,
                boxShadow: "0px 0px 4px 0px rgba(0, 0, 0, 0.25)",
              }}
            >
              <div className="sticky top-0 z-10 bg-[#e6e9ff] text-[14px] flex items-center justify-between border-b-secondary border-[1px] px-4 py-3 text-secondary font-semibold ">
                <div className="flex items-center gap-2">
                  <IconList style={{ width: rem(20), height: rem(20) }} />{" "}
                  <span className="flex flex-row items-center gap-2">
                    List CLO Added
                  </span>
                </div>
                <p>
                  {form.getValues().clo?.length!} CLO
                  {form.getValues().clo?.length! > 1 ? "s" : ""}
                </p>
              </div>
              <div className="flex flex-col w-full h-fit px-4">
                {form.getValues().clo?.map((item, index) => (
                  <div
                    ref={
                      index === form.getValues().clo?.length! - 1
                        ? cloRef
                        : undefined
                    }
                    className={`py-3 w-full border-b-[1px] pl-3 ${
                      form.getValues().clo?.length! > 1
                        ? "last:border-none last:pb-5"
                        : ""
                    }`}
                  >
                    <div className="flex flex-col gap-2 w-full">
                      <div className="flex items-center justify-between">
                        <p className="text-secondary font-semibold text-[14px]">
                          CLO-{item.cloNo}
                        </p>
                        <div
                          className="flex items-center justify-center border-[#FF4747] size-8 rounded-full hover:bg-[#FF4747]/10 cursor-pointer"
                          onClick={() => removeCLO(index)}
                        >
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
                        <li></li>
                        {item.cloDescTH}
                      </div>
                      <div className="flex text-pretty">
                        <li></li>
                        {item.cloDescEN}
                      </div>
                      {item.learningMethod.length > 0 && (
                        <div className="flex text-pretty">
                          <li></li>
                          {item.learningMethod
                            .join(", ")
                            .replace(LearningMethod.Other, item.other || "")}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        {/* Button */}
        <div className="flex gap-2 items-end justify-end h-fit">
          <Button variant="subtle" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={() => {
              setCloList(
                type == "add" ? form.getValues().clo : formOneCLO.getValues()
              );
              onClose();
            }}
            disabled={type == "add" ? form.getValues().clo?.length == 0 : false}
          >
            Done
          </Button>
        </div>
      </div>
    </Modal>
  );
}
