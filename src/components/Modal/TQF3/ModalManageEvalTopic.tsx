import Icon from "@/components/Icon";
import { validateTextInput } from "@/helpers/functions/validation";
import { IModelEval, IModelTQF3Part3 } from "@/models/ModelTQF3";
import {
  Button,
  Modal,
  Textarea,
  TextInput,
  NumberInput,
  NumberInputHandlers,
  Alert,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import trash from "@/assets/icons/trash.svg?react";
import list2 from "@/assets/icons/list2.svg?react";
import minus from "@/assets/icons/minus.svg?react";
import plus2 from "@/assets/icons/plus2.svg?react";
import { upperFirst } from "lodash";
import { useEffect, useRef, useState } from "react";
import Info2 from "@/assets/icons/Info2.svg?react";

type actionType = "add" | "edit";

type Props = {
  opened: boolean;
  onClose: () => void;
  type: actionType;
  data: IModelEval[] | IModelEval;
  setEvalList: (value: any) => void;
  total: number;
};
export default function ModalManageEvalTopic({
  opened,
  onClose,
  type,
  data,
  setEvalList,
  total = 0,
}: Props) {
  const height = type === "add" ? "h-full" : "h-fit";
  const handlersRef = useRef<NumberInputHandlers>(null);
  const topicRef = useRef<HTMLDivElement>(null);
  const [isAdded, setIsAdded] = useState(false);
  const [percentTotal, setPercentTotal] = useState(0);
  const [openedTooltip, setOpenedTooltip] = useState(false);

  const form = useForm({
    mode: "controlled",
    initialValues: { eval: [] } as Partial<IModelTQF3Part3>,
  });

  const formOneTopic = useForm({
    mode: "controlled",
    initialValues: {
      no: 1,
      topicTH: "",
      topicEN: "",
      desc: "",
      percent: 0,
    } as Partial<IModelEval>,
    validate: {
      topicTH: (value) =>
        validateTextInput(value, "Topic Thai language", 0, false),
      topicEN: (value) =>
        validateTextInput(value, "Topic English language", 0, false),
      percent: (value) => !value && "Evaluation Percentage is required",
    },
    validateInputOnBlur: true,
  });

  useEffect(() => {
    if (opened && data) {
      form.reset();
      formOneTopic.reset();
      setPercentTotal(total);
      if (type == "add") {
        const length = (data as IModelEval[]).length || 0;
        formOneTopic.setFieldValue("no", length + 1);
      } else {
        formOneTopic.setValues(data as IModelEval);
      }
    }
  }, [data, opened]);

  useEffect(() => {
    if (topicRef.current && isAdded) {
      topicRef.current.scrollIntoView({ behavior: "smooth" });
      setIsAdded(false);
    }
  }, [isAdded]);

  const onClickDone = () => {
    if (type == "add") {
      if (form.getValues().eval?.length! > 0) {
        setEvalList(form.getValues().eval);
      } else if (!formOneTopic.validate().hasErrors) {
        setEvalList([{ ...formOneTopic.getValues() }]);
      } else {
        return;
      }
    } else if (!formOneTopic.validate().hasErrors) {
      setEvalList(formOneTopic.getValues());
    } else {
      return;
    }
    onClose();
  };

  const addMore = () => {
    if (!formOneTopic.validate().hasErrors) {
      setPercentTotal(percentTotal + formOneTopic.getValues().percent!);
      form.insertListItem("eval", formOneTopic.getValues());
      setIsAdded(true);
      formOneTopic.setValues({
        no: formOneTopic.getValues().no! + 1,
        topicTH: "",
        topicEN: "",
        desc: "",
        percent: 0,
      });
    }
  };

  const removeTopic = (index: number) => {
    const length = (data as IModelEval[]).length;
    setPercentTotal(percentTotal - form.getValues().eval![index].percent);
    form.removeListItem("eval", index);
    const newEvalList = form.getValues().eval;
    newEvalList?.forEach((topic, i) => {
      topic.no = length + i + 1;
    });
    formOneTopic.setFieldValue("no", length + newEvalList?.length! + 1);
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      closeOnClickOutside={false}
      title={`${upperFirst(type)} Evaluation Topic`}
      size={
        type === "add" && form.getValues().eval?.length! > 0 ? "70vw" : "45vw"
      }
      centered
      transitionProps={{ transition: "pop" }}
      classNames={{
        content: `flex flex-col bg-[#F6F7FA] overflow-hidden`,
        body: `overflow-hidden ${height}`,
      }}
    >
      {percentTotal == 100 && (
        <Alert
          radius="md"
          variant="light"
          color="blue"
          classNames={{
            body: " flex justify-center",
          }}
          className="mb-2"
          title={
            <div className="flex items-center  gap-2">
              <Icon IconComponent={Info2} />
              <p className="pl-2">
                Your Evaluation topics in your course now add up to 100%.
              </p>
            </div>
          }
        ></Alert>
      )}
      <div
        className={`flex flex-col !gap-5 ${
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
            className={`flex flex-col justify-between rounded-md ${
              type === "add" && "p-5"
            } gap-1 overflow-hidden ${
              form.getValues().eval?.length! > 0 && type === "add"
                ? "w-[45%]"
                : "w-full"
            } h-full`}
            style={{
              boxShadow:
                type === "add" ? "0px 0px 4px 0px rgba(0, 0, 0, 0.25)" : "none",
            }}
          >
            <div className="flex flex-col gap-4 h-[88%]">
              <TextInput
                disabled={percentTotal == 100}
                autoFocus={false}
                label={
                  <p className="font-semibold flex gap-1 h-full ">
                    Evaluation Topic{" "}
                    <span className="text-secondary">Thai language</span>
                    <span className=" text-error">*</span>
                  </p>
                }
                className="w-full border-none   rounded-r-none "
                classNames={{
                  input: "flex p-3 text-[13px]",
                  label: "flex pb-1",
                }}
                placeholder="Ex. แบบทดสอบ 1"
                {...formOneTopic.getInputProps("topicTH")}
              />
              <TextInput
                disabled={percentTotal == 100}
                autoFocus={false}
                label={
                  <p className="font-semibold flex gap-1">
                    Evaluation Topic{" "}
                    <span className="text-secondary">English language</span>
                    <span className=" text-error">*</span>
                  </p>
                }
                className="w-full border-none rounded-r-none"
                classNames={{
                  input: "flex p-3 text-[13px]",
                  label: "flex pb-1",
                }}
                placeholder="Ex. Test 1"
                {...formOneTopic.getInputProps("topicEN")}
              />
              <Textarea
                disabled={percentTotal == 100}
                autoFocus={false}
                label={<p className="font-semibold flex gap-1">Description</p>}
                className="w-full border-none rounded-r-none"
                classNames={{
                  input: "flex h-[125px] px-3 py-2 text-[13px]",
                  label: "flex pb-1",
                }}
                placeholder="(Optional)"
                {...formOneTopic.getInputProps("desc")}
              />
              <NumberInput
                size="xs"
                disabled={percentTotal == 100}
                label={
                  <p className="font-semibold flex gap-1 h-full">
                    Evaluation Percentage (%)
                    <span className="text-error">*</span>
                  </p>
                }
                classNames={{
                  input: "flex px-3 py-5 text-[13px]  ",
                  label: "flex pb-1",
                  wrapper: "!border-none",
                }}
                allowNegative={false}
                handlersRef={handlersRef}
                step={5}
                min={0}
                max={100 - percentTotal}
                rightSection={
                  <div className="flex gap-2 items-center mr-16">
                    <div
                      className="p-1 rounded-md hover:bg-bgTableHeader"
                      onClick={() => handlersRef.current?.decrement()}
                      style={{ cursor: "pointer" }}
                    >
                      <Icon IconComponent={minus} className=" size-4 stroke-[#5768d5]" />
                    </div>
                    <div className="h-8 border"></div>
                    <div
                      className=" p-1 rounded-md hover:bg-bgTableHeader"
                      onClick={() => handlersRef.current?.increment()}
                      style={{ cursor: "pointer" }}
                    >
                      <Icon IconComponent={plus2} className="size-4 stroke-[#5768d5]"   />
                    </div>
                  </div>
                }
                {...formOneTopic.getInputProps("percent")}
              />
            </div>

            {/* Add More Button */}
            {type === "add" && (
              <div className="flex justify-end">
                <Button
                  variant="outline"
                  disabled={percentTotal == 100}
                  onClick={addMore}
                  onMouseOver={() => setOpenedTooltip(true)}
                  onMouseLeave={() => setOpenedTooltip(false)}
                >
                  Add more
                </Button>
              </div>
            )}
          </div>
          {/* List CLO */}
          {!!form.getValues().eval?.length! && type === "add" && (
            <div
              className="flex flex-col bg-white border-secondary border-[1px] rounded-md w-[55%] h-[492px]"
              style={{
                boxShadow: "0px 0px 4px 0px rgba(0, 0, 0, 0.25)",
                overflowY: "auto",
              }}
            >
              <div className="sticky top-0 z-10 bg-[#e6e9ff] text-[14px] flex items-center justify-between border-b-secondary border-[1px] px-4 py-3 text-secondary font-semibold ">
                <div className="flex items-center gap-2">
                  <span className="flex flex-row items-center gap-2">
                    <Icon IconComponent={list2} /> List Evaluation Topic Added
                  </span>
                </div>
                <p>
                  {form.getValues().eval?.length!} Topic
                  {form.getValues().eval?.length! > 1 ? "s" : ""}
                </p>
              </div>
              <div className="flex flex-col w-full h-fit px-4">
                {form.getValues().eval?.map((item, index) => (
                  <div
                    ref={
                      index === form.getValues().eval?.length! - 1
                        ? topicRef
                        : undefined
                    }
                    className={`py-3 w-full border-b-[1px] pl-3  ${
                      form.getValues().eval?.length! > 1
                        ? "last:border-none last:pb-5"
                        : ""
                    } `}
                  >
                    <div className="flex flex-col gap-2 w-full">
                      <div className="flex items-center justify-between">
                        <p className="text-secondary mb-2 font-semibold text-[14px]">
                          Eval Topic {item.no} ({item.percent}%)
                        </p>

                        <div
                          className="flex items-center justify-center border-[#FF4747] size-8 rounded-full hover:bg-[#FF4747]/10 cursor-pointer"
                          onClick={() => removeTopic(index)}
                        >
                          <Icon
                            IconComponent={trash}
                            className="size-4 stroke-[#ff4747] stroke-[2px] flex items-center"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="text-tertiary text-[13px] font-medium flex flex-col gap-1">
                      <div className="flex justify-between items-center font-semibold">
                        <div className="flex text-pretty">
                          <li></li> {item.topicTH} ({item.topicEN})
                        </div>
                      </div>
                      {!!item.desc.length && (
                        <div className="flex text-pretty">
                          <li></li> {item.desc}
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
        <div className="flex gap-2  items-end  justify-end h-fit">
          <Button variant="subtle" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={onClickDone}
            disabled={
              form.getValues().eval?.length == 0 && !formOneTopic.errors
            }
          >
            Done
          </Button>
        </div>
      </div>
    </Modal>
  );
}
