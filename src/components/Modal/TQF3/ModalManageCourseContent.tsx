import { TEACHING_METHOD } from "@/helpers/constants/enum";
import { validateTextInput } from "@/helpers/functions/validation";
import { IModelSchedule, IModelTQF3Part2 } from "@/models/ModelTQF3";
import {
  Button,
  Modal,
  Textarea,
  NumberInput,
  NumberInputHandlers,
  FocusTrapInitialFocus,
  rem,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import trash from "@/assets/icons/trash.svg?react";
import list2 from "@/assets/icons/list2.svg?react";
import minus from "@/assets/icons/minus.svg?react";
import plus2 from "@/assets/icons/plus2.svg?react";
import { upperFirst } from "lodash";
import { useEffect, useRef, useState } from "react";
import Icon from "@/components/Icon";

type actionType = "add" | "edit";

type Props = {
  opened: boolean;
  onClose: () => void;
  type: actionType;
  teachingMethod: string[];
  data: IModelSchedule[] | IModelSchedule;
  setScheduleList: (value: any) => void;
};
export default function ModalManageTopic({
  opened,
  onClose,
  type,
  teachingMethod,
  data,
  setScheduleList,
}: Props) {
  const height = type === "add" ? "h-full" : "h-fit";
  const handlersLecRef = useRef<NumberInputHandlers>(null);
  const handlersLabRef = useRef<NumberInputHandlers>(null);
  const topicRef = useRef<HTMLDivElement>(null);
  const [isAdded, setIsAdded] = useState(false);

  const form = useForm({
    mode: "controlled",
    initialValues: { schedule: [] } as Partial<IModelTQF3Part2>,
  });

  const formOneWeek = useForm({
    mode: "controlled",
    initialValues: {
      weekNo: 1,
      topic: "",
      lecHour: 0,
      labHour: 0,
    } as Partial<IModelSchedule>,
    validate: {
      topic: (value) => validateTextInput(value, "Course Content", 0, false),
      lecHour: (value, values) =>
        !value && !values.labHour && "Lecture hour or Lab hour is required",
      labHour: (value, values) =>
        !value && !values.lecHour && "Lecture hour or Lab hour is required",
    },
    validateInputOnBlur: true,
    onValuesChange(values, previous) {
      if (values.lecHour != previous.lecHour) {
        formOneWeek.validateField("labHour");
      } else if (values.labHour != previous.labHour) {
        formOneWeek.validateField("lecHour");
      }
    },
  });

  useEffect(() => {
    if (opened && data) {
      form.reset();
      formOneWeek.reset();
      if (type == "add") {
        const length = (data as IModelSchedule[]).length || 0;
        formOneWeek.setValues({
          weekNo: length + 1,
          topic: "",
          lecHour: teachingMethod.includes(TEACHING_METHOD.LEC.en) ? 3 : 0,
          labHour: teachingMethod.includes(TEACHING_METHOD.LAB.en) ? 3 : 0,
        });
      } else {
        formOneWeek.setValues(data as IModelSchedule);
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
      if (form.getValues().schedule?.length! > 0) {
        setScheduleList(form.getValues().schedule);
      } else if (!formOneWeek.validate().hasErrors) {
        setScheduleList([{ ...formOneWeek.getValues() }]);
      } else {
        return;
      }
    } else if (!formOneWeek.validate().hasErrors) {
      setScheduleList(formOneWeek.getValues());
    } else {
      return;
    }
    onClose();
  };

  const addMore = () => {
    if (!formOneWeek.validate().hasErrors) {
      form.insertListItem("schedule", formOneWeek.getValues());
      setIsAdded(true);
      formOneWeek.setValues({
        weekNo: formOneWeek.getValues().weekNo! + 1,
        topic: "",
        lecHour: teachingMethod.includes(TEACHING_METHOD.LEC.en) ? 3 : 0,
        labHour: teachingMethod.includes(TEACHING_METHOD.LAB.en) ? 3 : 0,
      });
    }
  };

  const removeTopic = (index: number) => {
    const length = (data as IModelSchedule[]).length;
    form.removeListItem("schedule", index);
    const newTopicList = form.getValues().schedule;
    newTopicList?.forEach((week, i) => {
      week.weekNo = length + i + 1;
    });
    formOneWeek.setFieldValue("weekNo", length + newTopicList?.length! + 1);
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      closeOnClickOutside={false}
      title={`${upperFirst(type)} Course Content`}
      size={
        type === "add" && form.getValues().schedule?.length! > 0
          ? "70vw"
          : "35vw"
      }
      centered
      transitionProps={{ transition: "pop" }}
      classNames={{
        content: `flex flex-col bg-[#F6F7FA] overflow-hidden `,
        body: `overflow-hidden ${height}`,
        header: `mb-1`,
      }}
    >
      <FocusTrapInitialFocus />
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
            } gap-1 rounded-md overflow-hidden ${
              form.getValues().schedule?.length! > 0 && type === "add"
                ? "w-[45%]"
                : "w-full"
            } h-full relative`}
            style={{
              boxShadow:
                type === "add" ? "0px 0px 4px 0px rgba(0, 0, 0, 0.25)" : "none",
            }}
          >
            <div className="flex flex-col gap-4  h-[80%]">
              <Textarea
                autoFocus={false}
                label={
                  <p className="font-semibold flex gap-1">
                    Course Content <span className=" text-error">*</span>
                  </p>
                }
                className="w-full border-none rounded-r-none"
                classNames={{
                  input: "flex h-[200px] p-3 text-[13px]",
                  label: "flex pb-1",
                }}
                placeholder="Ex. การอินทิเกรต (Integration)"
                {...formOneWeek.getInputProps("topic")}
              />

              <NumberInput
                label={
                  <p className="font-semibold flex gap-1 h-full">
                    Lecture hour (hr)
                    <span className=" text-error">*</span>
                  </p>
                }
                classNames={{
                  input: "flex px-3 py-5 text-[13px]",
                  label: "flex pb-1",
                }}
                size="xs"
                allowNegative={false}
                handlersRef={handlersLecRef}
                decimalScale={2}
                step={1}
                min={0}
                max={100}
                rightSection={
                  <div className="flex gap-2 items-center mr-16">
                    <div
                      className="p-1 rounded-md hover:bg-bgTableHeader"
                      onClick={() => handlersLecRef.current?.decrement()}
                      style={{ cursor: "pointer" }}
                    >
                      <Icon
                        IconComponent={minus}
                        className="size-4 stroke-[#5768d5]"
                      />
                    </div>
                    <div className="h-8 border"></div>
                    <div
                      className=" p-1 rounded-md hover:bg-bgTableHeader"
                      onClick={() => handlersLecRef.current?.increment()}
                      style={{ cursor: "pointer" }}
                    >
                      <Icon
                        IconComponent={plus2}
                        className="size-4 stroke-[#5768d5]"
                      />
                    </div>
                  </div>
                }
                {...formOneWeek.getInputProps("lecHour")}
                error=""
              />

              <NumberInput
                label={
                  <p className="font-semibold flex gap-1 h-full">
                    Lab hour (hr) <span className=" text-error">*</span>
                  </p>
                }
                classNames={{
                  input: "flex px-3 py-5 text-[13px]",
                  label: "flex pb-1",
                }}
                size="xs"
                allowNegative={false}
                handlersRef={handlersLabRef}
                decimalScale={2}
                step={1}
                min={0}
                max={100}
                rightSection={
                  <div className="flex gap-2 items-center mr-16">
                    <div
                      className="p-1 rounded-md hover:bg-bgTableHeader"
                      onClick={() => handlersLabRef.current?.decrement()}
                      style={{ cursor: "pointer" }}
                    >
                      <Icon
                        IconComponent={minus}
                        className="size-4 stroke-[#5768d5]"
                      />
                    </div>
                    <div className="h-8 border"></div>
                    <div
                      className=" p-1 rounded-md hover:bg-bgTableHeader"
                      onClick={() => handlersLabRef.current?.increment()}
                      style={{ cursor: "pointer" }}
                    >
                      <Icon
                        IconComponent={plus2}
                        className="size-4 stroke-[#5768d5]"
                      />
                    </div>
                  </div>
                }
                {...formOneWeek.getInputProps("labHour")}
                error=""
              />
              <p className="text-error text-b3 -mt-1">
                {formOneWeek.getInputProps("lecHour").error ||
                  formOneWeek.getInputProps("labHour").error}
              </p>
            </div>

            {/* Add More Button */}
            {type === "add" && (
              <div className="absolute right-5 bottom-5">
                <Button variant="outline" onClick={addMore}>
                  Add more
                </Button>
              </div>
            )}
          </div>
          {/* List Course Content */}
          {!!form.getValues().schedule?.length && type === "add" && (
            <div
              className="flex flex-col bg-white border-secondary border-[1px] rounded-md w-[55%] h-full"
              style={{
                boxShadow: "0px 0px 4px 0px rgba(0, 0, 0, 0.25)",
                overflowY: "auto",
              }}
            >
              <div className="sticky top-0 z-10 bg-[#e6e9ff] text-[14px] flex items-center justify-between border-b-secondary border-[1px] px-4 py-3 text-secondary font-semibold ">
                <div className="flex items-center gap-2">
                  <Icon
                    IconComponent={list2}
                    style={{ width: rem(20), height: rem(20) }}
                  />{" "}
                  <span className="flex flex-row items-center gap-2">
                    List Course Content Added
                  </span>
                </div>
                <p>
                  {form.getValues().schedule?.length!} Course Content
                  {form.getValues().schedule?.length! > 1 ? "s" : ""}
                </p>
              </div>

              <div className="flex flex-col w-full h-fit px-4">
                {form.getValues().schedule?.map((item, index) => (
                  <div
                    ref={
                      index === form.getValues().schedule?.length! - 1
                        ? topicRef
                        : undefined
                    }
                    className={`py-3 w-full border-b-[1px] pl-3 ${
                      form.getValues().schedule?.length! > 1
                        ? "last:border-none last:pb-5"
                        : ""
                    } `}
                  >
                    <div className="flex flex-col w-full">
                      <div className="flex items-center justify-between">
                        <p className="text-secondary mb-2 font-semibold text-[14px]">
                          {/* Course Content {item.weekNo} */}
                          Week {item.weekNo}
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
                      <div className="flex text-pretty font-semibold">
                        {/* <li></li> Week {item.weekNo}: {item.topic} */}
                        <li></li> Topic: {item.topic}
                      </div>
                      <div className="flex text-pretty">
                        <li></li> Lecture hour: {item.lecHour} hr
                        {!!item.lecHour && "s"}
                      </div>
                      <div className="flex text-pretty">
                        <li></li> Lab hour: {item.labHour} hr
                        {!!item.labHour && "s"}
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
          <Button variant="subtle" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={onClickDone}
            disabled={
              form.getValues().schedule?.length == 0 && !formOneWeek.errors
            }
          >
            Done
          </Button>
        </div>
      </div>
    </Modal>
  );
}
