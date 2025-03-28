import { validateTextInput } from "@/helpers/functions/validation";
import { IModelCLO, IModelTQF3Part2 } from "@/models/ModelTQF3";
import {
  Button,
  Checkbox,
  Modal,
  Textarea,
  Tooltip,
  Kbd,
  FocusTrap,
} from "@mantine/core";
import IconTrash from "@/assets/icons/trash.svg?react";
import IconList2 from "@/assets/icons/list2.svg?react";
import { useForm } from "@mantine/form";
import { upperFirst } from "lodash";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import Icon from "@/components/Icon";
import { useHotkeys } from "react-hotkeys-hook";

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
  const descriptionRef = useRef<any>(null);
  const cloRef = useRef<HTMLDivElement>(null);
  const [isAdded, setIsAdded] = useState(false);
  const isMac = /Mac|iPod|iPhone|iPad/.test(navigator.platform);
  const refTextarea = useRef<HTMLTextAreaElement>(null);
  const [textareaLength, setTextareaLength] = useState({
    descTH: 0,
    descEN: 0,
  });

  const updateHeight = () => {
    if (descriptionRef.current) {
      const height = descriptionRef.current.offsetHeight;
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
    onValuesChange: (values) => {
      localStorage.setItem("dataAddListClo", JSON.stringify(values));
    },
  });

  const formOneCLO = useForm({
    mode: "controlled",
    initialValues: {
      no: 1,
      descTH: "",
      descEN: "",
      learningMethod: [],
      other: "",
    } as Partial<IModelCLO>,
    validate: {
      descTH: (value) =>
        validateTextInput(value, "CLO Thai language", 300, false),
      descEN: (value) =>
        validateTextInput(value, "CLO English language", 300, false),
      learningMethod: (value) =>
        !value?.length && "Select Learning Method at least one",
      other: (value, values) =>
        !value?.length &&
        values.learningMethod?.includes(LearningMethod.Other) &&
        "Other is required",
    },
    validateInputOnBlur: true,
    onValuesChange: (values) => {
      localStorage.setItem("dataAddOneClo", JSON.stringify(values));
    },
  });

  formOneCLO.watch("descTH", (value) => {
    setTextareaLength((prev) => ({
      ...prev,
      descTH: value.value?.length || 0,
    }));
  });
  formOneCLO.watch("descEN", (value) => {
    setTextareaLength((prev) => ({
      ...prev,
      descEN: value.value?.length || 0,
    }));
  });

  useEffect(() => {
    if (opened && data) {
      if (!localStorage.getItem("dataAddListClo")) {
        form.reset();
      }
      if (!localStorage.getItem("dataAddOneClo")) {
        formOneCLO.reset();
      }
      if (type == "add") {
        const dataListStorage = JSON.parse(
          localStorage.getItem("dataAddListClo")!
        );
        const dataOneStorage = JSON.parse(
          localStorage.getItem("dataAddOneClo")!
        );
        const length =
          dataListStorage?.length ?? ((data as IModelCLO[]).length || 0);
        if (dataListStorage) {
          form.setValues(dataListStorage);
        }
        if (dataOneStorage) {
          formOneCLO.setValues(dataOneStorage);
        } else {
          formOneCLO.setFieldValue("no", length + 1);
        }
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

  const closeModal = () => {
    onClose();
    localStorage.removeItem("dataAddListClo");
    localStorage.removeItem("dataAddOneClo");
  };

  const onClickDone = () => {
    if (type == "add") {
      if (formOneCLO.getValues().descTH?.length) {
        addMore();
      }
      if (form.getValues().clo?.length! > 0) {
        setCloList(form.getValues().clo);
      } else {
        formOneCLO.validate();
        return;
      }
    } else if (!formOneCLO.validate().hasErrors) {
      setCloList(formOneCLO.getValues());
    } else {
      return;
    }
    closeModal();
  };

  const addMore = () => {
    if (!formOneCLO.validate().hasErrors) {
      form.insertListItem("clo", formOneCLO.getValues());
      setIsAdded(true);
      formOneCLO.setValues({
        no: formOneCLO.getValues().no! + 1,
        descTH: "",
        descEN: "",
        learningMethod: [],
        other: "",
      });
      refTextarea.current!.focus();
    }
  };

  useHotkeys(
    "ctrl+enter, meta+enter",
    () => {
      addMore();
    },
    {
      enableOnFormTags: ["INPUT", "TEXTAREA", "SELECT"],
    }
  );

  const removeCLO = (index: number) => {
    const length = (data as IModelCLO[]).length;
    form.removeListItem("clo", index);
    const newCloList = form.getValues().clo;
    newCloList?.forEach((clo, i) => {
      clo.no = length + i + 1;
    });
    formOneCLO.setFieldValue("no", length + newCloList?.length! + 1);
  };

  return (
    <Modal
      opened={opened}
      onClose={closeModal}
      closeOnEscape={false}
      closeOnClickOutside={false}
      title={`${upperFirst(type)} CLO`}
      size={
        type === "add" && form.getValues().clo?.length! > 0 ? "70vw" : "50vw"
      }
      centered
      transitionProps={{ transition: "pop" }}
      classNames={{
        root: `!h-fit`,
        content: `flex flex-col bg-[#F6F7FA] overflow-hidden bg-red-400`,
        body: `overflow-hidden `,
        header: `mb-1`,
        title: "acerSwift:max-macair133:!text-b1",
      }}
    >
      <div className={`flex flex-col ${height}`}>
        <div
          className={`flex gap-5 py-1 h-fit sm:max-macair133:overflow-y-auto sm:max-macair133:px-[2px] ${
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
          {/* Input Field */}{" "}
          <FocusTrap>
            <div
              id="description"
              ref={descriptionRef}
              className={`flex flex-col rounded-md sm:overflow-y-auto justify-between  ${
                type === "add" && "p-5"
              } gap-1 overflow-y-hidden ${
                form.getValues().clo?.length! > 0 && type === "add"
                  ? "w-[45%]"
                  : "w-full"
              } h-full`}
              style={{
                boxShadow:
                  type === "add"
                    ? "0px 0px 4px 0px rgba(0, 0, 0, 0.25)"
                    : "none",
              }}
            >
              <div className="flex flex-col gap-4 h-[90%]">
                <div>
                  <Textarea
                    data-autoFocus={true}
                    ref={refTextarea}
                    label={
                      <p className="font-semibold flex gap-1 h-full ">
                        CLO <span className="text-secondary">Thai</span>
                        <span className=" text-error">*</span>
                      </p>
                    }
                    maxLength={300}
                    className="w-full border-none"
                    classNames={{
                      input:
                        "flex h-[80px] acerSwift:max-macair133:!h-[70px] px-3 py-2 text-b3 acerSwift:max-macair133:!text-b4",
                      label: "flex pb-1 acerSwift:max-macair133:!text-b4",
                    }}
                    placeholder="อธิบายหลักการทำงานของระบบปฏิบัติการคอมพิวเตอร์"
                    {...formOneCLO.getInputProps("descTH")}
                  />
                  <p className="text-end text-b4 text-deemphasize">
                    {textareaLength.descTH}/300
                  </p>
                </div>
                <div>
                  <Textarea
                    label={
                      <p className="font-semibold flex gap-1">
                        CLO <span className="text-secondary">English</span>
                        <span className=" text-error">*</span>
                      </p>
                    }
                    maxLength={300}
                    className="w-full border-none"
                    classNames={{
                      input:
                        "flex h-[80px] px-3 acerSwift:max-macair133:!h-[70px] py-2 text-b3 acerSwift:max-macair133:!text-b4",
                      label: "flex pb-1 acerSwift:max-macair133:!text-b4",
                    }}
                    placeholder="Explain the working principle of computer operating systems."
                    {...formOneCLO.getInputProps("descEN")}
                  />
                  <p className="text-end text-b4 text-deemphasize">
                    {textareaLength.descEN}/300
                  </p>
                </div>

                <div className="flex flex-col gap-2 pb-1 ">
                  <p className="text-secondary text-b3 acerSwift:max-macair133:!text-b4 mb-1 font-semibold">
                    Learning Method <span className="text-error">*</span>
                  </p>
                  <Checkbox.Group
                    {...formOneCLO.getInputProps("learningMethod")}
                  >
                    {options.map((item, index) => (
                      <div
                        key={index}
                        className="flex-col pb-[14px] items-center w-full"
                      >
                        <Checkbox
                          size="xs"
                          classNames={{
                            label:
                              "font-medium text-b3 acerSwift:max-macair133:!text-b4 text-default",
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
            </div>
          </FocusTrap>
          {/* List CLO */}
          {!!form.getValues().clo?.length && type === "add" && (
            <div
              className={`flex flex-col bg-white border-secondary border-[1px] rounded-md w-[55%] overflow-y-auto overflow-x-hidden`}
              style={{
                height: heightLeftSec,
                boxShadow: "0px 0px 4px 0px rgba(0, 0, 0, 0.25)",
              }}
            >
              <div className="sticky top-0 z-10 bg-bgTableHeader text-b2 acerSwift:max-macair133:!text-b3 flex items-center justify-between border-b-secondary border-[1px] px-4 py-3 text-secondary font-semibold ">
                <div className="flex items-center gap-2">
                  <Icon IconComponent={IconList2} className="size-5" />
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
                        <p className="text-secondary font-semibold text-b2 acerSwift:max-macair133:!text-b3">
                          CLO-{item.no}
                        </p>
                        <div
                          className="flex items-center justify-center border-[#FF4747] size-8 rounded-full hover:bg-[#FF4747]/10 cursor-pointer"
                          onClick={() => removeCLO(index)}
                        >
                          <Icon
                            IconComponent={IconTrash}
                            className="size-4 stroke-[2px] stroke-[#ff4747] flex items-center"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="text-tertiary text-b3 acerSwift:max-macair133:!text-b4 font-medium flex flex-col gap-1">
                      <div className="flex text-pretty">
                        <li></li>
                        {item.descTH}
                      </div>
                      <div className="flex text-pretty">
                        <li></li>
                        {item.descEN}
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
        <div className="flex gap-2 items-end  justify-end h-fit">
          <Button
            variant="subtle"
            onClick={closeModal}
            className="acerSwift:max-macair133:!text-b5"
          >
            Cancel
          </Button>
          {/* Add More Button */}
          {type === "add" && (
            <div className="flex justify-end">
              <Tooltip
                arrowOffset={20}
                arrowSize={8}
                arrowRadius={1}
                transitionProps={{
                  transition: "fade",
                  duration: 300,
                }}
                multiline
                withArrow
                label={
                  <div className="text-default text-[12px] p-2 font-medium gap-2">
                    <Kbd className=" text-secondary">
                      {isMac ? "⌘" : "Ctrl"}
                    </Kbd>{" "}
                    + <Kbd className=" text-secondary">Enter</Kbd>
                  </div>
                }
                color="#FCFCFC"
                className="w-fit border  rounded-md "
                position="top"
              >
                <Button
                  variant="subtle"
                  onClick={addMore}
                  className="acerSwift:max-macair133:!text-b5"
                >
                  Add more CLO
                </Button>
              </Tooltip>
            </div>
          )}
          <Button
            className="acerSwift:max-macair133:!text-b5"
            onClick={onClickDone}
            disabled={form.getValues().clo?.length == 0 && !formOneCLO.errors}
          >
            Save
          </Button>
        </div>
      </div>
    </Modal>
  );
}
